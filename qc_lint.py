#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
盐言短篇 L1 机械门质检脚本(质检流程方案·阶段1)
零依赖,纯标准库。用法:
    python3 qc_lint.py 正文.md [--report 报告.md]
检查项映射:Q1.1–Q1.12(见《质检流程方案.md》)
换稿复用:只改下方 STORY 配置区(人名/硬数字台账/频次阈值)。
"""
import io, re, sys, argparse

# ========================= STORY 配置区(换稿改这里) =========================
STORY = {
    "names": {  # Q1.12 人名一致性:<名字>: 最低出现次数
        "许棠": 5, "沈一蔓": 5, "陆峥": 2, "何姐": 3, "小满": 3,
    },
    "ledger": [  # Q1.11 硬数字台账:(项, [正文写法变体], 最低出现次数)
        ("连续加班 47 天", ["四十七"], 2),
        ("银行卡余额 4316", ["四千三百一十六"], 1),
        ("违约金 30 万", ["三十万"], 2),
        ("终版补偿 24 万", ["二十四万"], 1),
        ("确认书落款 3/23", ["三月,二十三号", "三月二十三"], 1),
        ("死亡日 3/14", ["三月十四"], 1),
        ("录音日 3/13", ["三月十三"], 1),
        ("发布会 10/23", ["十月二十三"], 1),
        ("生日 8/17", ["八月十七"], 1),
        ("2023 年", ["二零二三"], 1),
        ("2022 年(正文以「四年前」指代)", ["二零二二", "四年前"], 1),
    ],
    "freq": {  # Q1.9 频次阈值(硬门):超过即 ✗
        "像": 10, "一下": 10, "眼睛": 5, "指尖": 5, "膝盖": 5, "手指": 5,
    },
    "watch": ["就是", "站在", "那种", "慢慢", "轻轻", "忽然", "盯着", "很久"],  # 口头禅观察表
    "blacklist": [  # Q1.9 禁用比喻黑名单(存在即 ✗)
        r"命运的?齿轮", r"如潮水般", r"仿佛春风", r"心猛地一[沉凉]", r"眼眶泛红",
        r"不由得", r"一丝[^\n]{0,6}涌上心头", r"仿佛整个世界", r"像被抽空了力气",
    ],
    "min_chars": 10000,   # Q1.1 官方短篇线
    "target_chars": 12000,
}

# ========================= 实现 =========================
CN = {"零": 0, "一": 1, "二": 2, "两": 2, "三": 3, "四": 4, "五": 5,
      "六": 6, "七": 7, "八": 8, "九": 9}

def cn2int(s):
    s = s.strip()
    if s.isdigit():
        return int(s)
    total = num = 0
    for ch in s:
        if ch == "十":
            total += (num or 1) * 10
            num = 0
        elif ch in CN:
            num = CN[ch]
        else:
            return None
    return total + num

RE_TIME = re.compile(
    r"(凌晨|清晨|早上|早晨|上午|中午|下午|傍晚|晚上|夜里|深夜|半夜)?"
    r"(零?[一二三四五六七八九十]{1,3}|\d{1,2})点"
    r"(整|半|零?[一二三四五六七八九十]{1,2}分|[一二三四五六七八九十]{1,2}多|\d{1,2}分?)?"
)
RE_COLON = re.compile(r"(\d{1,2})[:：](\d{2})")
RE_QUOTE = re.compile(r"「[^」]*」")
RE_GENERIC = re.compile(r"每天|永远|有时候|从来|一共|总是")
RE_SECTION = re.compile(r"^(\d+)\.$")

def parse_line_times(line):
    """返回 [(分钟, 原文, 是否对话内)]"""
    quote_spans = [m.span() for m in RE_QUOTE.finditer(line)]
    def in_quote(pos):
        return any(a <= pos < b for a, b in quote_spans)
    out = []
    for m in RE_TIME.finditer(line):
        prefix, h, tail = m.group(1), m.group(2), m.group(3) or ""
        hour = cn2int(h)
        if hour is None or not (0 <= hour <= 23):
            continue
        # 量词降噪:裸「一点」(无前缀无分钟)跳过
        if hour == 1 and not prefix and not tail:
            continue
        if tail == "半":
            minute = 30
        elif tail.endswith("分"):
            mm = tail[:-1].lstrip("零")
            mv = cn2int(mm) if mm else 0
            minute = mv if mv is not None and 0 <= mv <= 59 else 0
        elif tail.endswith("多"):
            minute = 0  # Approximate to the hour
        else:
            minute = 0
        out.append((hour * 60 + minute, m.group(0), in_quote(m.start())))
    for m in RE_COLON.finditer(line):
        hh, mm = int(m.group(1)), int(m.group(2))
        if 0 <= hh <= 23 and 0 <= mm <= 59:
            out.append((hh * 60 + mm, m.group(0), in_quote(m.start())))
    return out

def qc(path):
    s = io.open(path, encoding="utf-8").read()
    lines = s.split("\n")
    hard, warn, info = [], [], []   # ✗ / ⚠ / ℹ

    def H(sec, msg): hard.append(f"[{sec}] {msg}")
    def W(sec, msg): warn.append(f"[{sec}] {msg}")

    # ---- Q1.1 字数 ----
    s2 = re.sub(r"\s+", "", s)
    han = len(re.findall(r"[\u4e00-\u9fff]", s))
    info.append(f"字数:平台口径 {len(s2)} / 纯汉字 {han}(门槛 {STORY['min_chars']},目标 {STORY['target_chars']})")
    if len(s2) < STORY["min_chars"]:
        W("Q1.1", f"字数 {len(s2)} 低于官方短篇线 {STORY['min_chars']}")

    # ---- Q1.2 禁字符 ----
    for ch in ["……", "——", "—", "–", "--", "…"]:
        if ch in s:
            ls = [i + 1 for i, l in enumerate(lines) if ch in l]
            H("Q1.2", f"禁字符 {ch!r} 出现 {len(ls)} 处(行 {ls[:5]})")

    # ---- Q1.3 段落形态 ----
    blanks = [i + 1 for i, l in enumerate(lines[:-1]) if l.strip() == "" ]
    if blanks:
        W("Q1.3", f"存在空行 {len(blanks)} 处(行 {blanks[:8]}),平台要求相邻段落仅一个换行")
    indents = [i + 1 for i, l in enumerate(lines) if l[:1] in ("　", " ", "\t")]
    if indents:
        H("Q1.3", f"段落缩进 {len(indents)} 处(行 {indents[:8]})")

    def sent_count(p):
        return max(1, len([x for x in re.split(r"[。!?!?]", p) if x.strip()]))
    paras = [l for l in lines if l.strip() and not RE_SECTION.match(l) and not l.startswith("《")]
    long_ps = [(i + 1, sent_count(p), p[:30]) for i, p in enumerate(lines) if p.strip() and sent_count(p) > 3 and not RE_SECTION.match(p)]
    single = sum(1 for p in paras if sent_count(p) == 1)
    if paras:
        info.append(f"段落 {len(paras)} 个;独句段占比 {single/len(paras)*100:.0f}%(参考 ≥30%);单句成段峰值段见下")
    if long_ps:
        W("Q1.3", f"超过 3 句的段落 {len(long_ps)} 个(盐选硬规则:禁 4 句以上段落),行号/句数/开头:")
        for ln, c, head in long_ps[:10]:
            warn.append(f"    行{ln}({c}句):{head}…")

    # ---- Q1.4 Markdown 残留 ----
    md = []
    for i, l in enumerate(lines):
        if "**" in l or l.startswith("#") or l.startswith("- ") or l.startswith("---"):
            if not RE_SECTION.match(l):
                md.append(i + 1)
    if md:
        H("Q1.4", f"正文含 Markdown 标记(行 {md[:8]})")

    # ---- Q1.5 节标 ----
    secs = [(i + 1, int(RE_SECTION.match(l).group(1))) for i, l in enumerate(lines) if RE_SECTION.match(l)]
    nums = [n for _, n in secs]
    if nums != sorted(nums) or len(set(nums)) != len(nums):
        H("Q1.5", f"节标非单调/重复:{nums}")
    if nums and nums != list(range(1, len(nums) + 1)):
        W("Q1.5", f"节标有缺号:{nums}")

    # ---- Q1.6/1.7 引号与对话占比 ----
    if re.search(r"[“”‘’]", s):
        ls = [i + 1 for i, l in enumerate(lines) if re.search(r"[“”‘’]", l)]
        H("Q1.6", f"出现弯引号(禁用),行 {ls[:8]}")
    if s.count("「") != s.count("」"):
        H("Q1.6", f"「」不配对:{s.count('「')} vs {s.count('」')}")
    dial = sum(1 for p in paras if "「" in p)
    if paras:
        ratio = dial / len(paras) * 100
        info.append(f"对话段占比 {ratio:.0f}%(参考区间 40–50%)")
        if not (30 <= ratio <= 60):
            W("Q1.7", f"对话占比 {ratio:.0f}% 超出参考区间 30–60%")

    # ---- Q1.8 元信息词 ----
    for w in ["本章", "前文", "后文", "伏笔", "细纲", "读者"]:
        if w in s:
            H("Q1.8", f"元信息词「{w}」出现在正文")
    for m in re.finditer(r"第\d+章", s):
        H("Q1.8", f"元信息「{m.group(0)}」")

    # ---- Q1.9 频次门 ----
    for w, lim in STORY["freq"].items():
        c = s.count(w)
        note = {"像": "(含母题/词素时人工核减)", "一下": ""}.get(w, "")
        if c > lim:
            H("Q1.9", f"「{w}」{c} 处 > 上限 {lim} {note}")
        else:
            info.append(f"「{w}」{c}/{lim} ✓{note}")
    for pat in STORY["blacklist"]:
        ms = re.findall(pat, s)
        if ms:
            H("Q1.9", f"黑名单比喻 /{pat}/ 命中 {len(ms)} 次")
    excl = s.count("!") + s.count("!")
    if excl > 5:
        W("Q1.9", f"感叹号 {excl} 处(全篇参考 ≤5)")
    info.append(f"问号 {s.count('?') + s.count('?')} 处(仅记录)")
    # 口头禅候选:观察词 + 高频二字组
    cand = [(w, s.count(w)) for w in STORY["watch"] if s.count(w) > 10]
    if cand:
        W("Q1.9", "口头禅候选(>10 次,人工判母题/口头禅):" + ", ".join(f"{w}×{c}" for w, c in cand))
    grams = {}
    t = re.sub(r"\s", "", s)
    skip = set("的了着呢吗吧啊呀哦嘛么是在不了有我你他她它这那和与就都也被把把为对")
    for a, b in zip(t, t[1:]):
        if a in skip or b in skip or a in "「」《,。!?!?:;" or b in "「」《,。!?!?:;":
            continue
        grams[a + b] = grams.get(a + b, 0) + 1
    top = sorted(grams.items(), key=lambda x: -x[1])[:12]
    info.append("高频二字组 TOP12(母题/口头禅候选,人工判):" + ", ".join(f"{g}×{c}" for g, c in top))

    # ---- Q1.10 F1 时间状态机(输出待人工核,不硬判) ----
    anchors, last, sec_now = [], None, "导语"
    for i, l in enumerate(lines):
        m = RE_SECTION.match(l)
        if m:
            sec_now = f"节{m.group(1)}"
            continue
        if RE_GENERIC.search(l):
            continue
        for t, raw, inq in parse_line_times(l):
            anchors.append((i + 1, sec_now, t, raw, inq))
    seq = [a for a in anchors if not a[4]]
    info.append(f"时间锚点 {len(anchors)} 个(叙述 {len(seq)} / 对话内 {len(anchors) - len(seq)},对话内不参与排序)")
    # v1.1:只在同一节内做前后比较(节边界=场景跳转,跨节必然"跳时间",比较只会产生假报)
    norm = []
    prev_sec, prev = None, None
    for a in seq:
        t = a[2]
        if a[1] != prev_sec:
            prev_sec, prev = a[1], None
        if prev is None:
            norm.append((a, t))
        else:
            cands = [t, t + 1440, t - 1440]
            best = min(cands, key=lambda x: abs(x - prev))
            norm.append((a, best))
            if best < prev - 20:
                W("Q1.10", f"疑似时间倒流(待人工核):{a[1]} 行{a[0]}「{a[3]}」晚于前锚点,请对照时间轴台账")
        prev = norm[-1][1]
    info.append("全部锚点清单(人工抽查用):")
    for ln, sn, t, raw, inq in anchors:
        hh, mm = divmod(t, 60)
        info.append(f"    {sn} 行{ln} {raw}({hh:02d}:{mm:02d}{'/对话' if inq else ''})")

    # ---- Q1.11 硬数字台账交叉 ----
    for label, variants, least in STORY["ledger"]:
        c = sum(s.count(v) for v in variants)
        if c == 0:
            H("Q1.11", f"硬数字「{label}」未在正文出现(失踪)")
        elif c < least:
            W("Q1.11", f"硬数字「{label}」仅 {c} 处(预期 ≥{least})")
        else:
            info.append(f"硬数字「{label}」×{c} ✓")

    # ---- Q1.12 人名一致性 ----
    for name, least in STORY["names"].items():
        c = s.count(name)
        if c == 0:
            H("Q1.12", f"角色「{name}」0 次出现(失踪)")
        elif c < least:
            W("Q1.12", f"角色「{name}」仅 {c} 次(<{least},人工核)")
        else:
            info.append(f"人名「{name}」×{c} ✓")

    return hard, warn, info

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("file")
    ap.add_argument("--report", default=None)
    args = ap.parse_args()
    hard, warn, info = qc(args.file)
    L = ["# L1 机械门质检报告", "", f"- 对象:`{args.file}`", ""]
    L.append(f"**结论:{'✗ 未过(硬门 ' + str(len(hard)) + ' 项)' if hard else '✓ 通过'};⚠ 待人工核 {len(warn)} 项**")
    L += ["", "## ✗ 硬门未过(必修)"] + ([f"- {h}" for h in hard] if hard else ["- 无"])
    L += ["", "## ⚠ 待人工核(逐条裁决后进 L2)"] + ([f"- {w}" for w in warn] if warn else ["- 无"])
    L += ["", "## ℹ 信息(记录,不阻断)"] + [f"- {i}" for i in info]
    out = "\n".join(L) + "\n"
    print(out)
    if args.report:
        io.open(args.report, "w", encoding="utf-8").write(out)
        print(f"[报告已写入 {args.report}]")
    sys.exit(1 if hard else 0)

if __name__ == "__main__":
    main()
