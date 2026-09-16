#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
《神仙让我给他买拖鞋》合稿与校验

用法：  python3 合稿校验.py
输出：  正文-全篇.md（工作标题 + 12 场，小节号全篇连续重编）
        终端报告：字数、免费/付费段、标点红线、频次、硬数字、关键句锚点

为什么脚本化：分场写作时，跨场的账（硬数字、道具、称呼、频次）在单场里看不出来。
每次改动任一场，重跑一遍这个脚本，合稿与体检一起完成。
"""
import re
import sys
import pathlib

ROOT = pathlib.Path(__file__).resolve().parent
TITLE = "神仙让我给他买拖鞋"          # 工作标题，定稿前不改这个常量
OUT = ROOT / "正文-全篇.md"

# 场次顺序：卡11 是先写的，但它是第 11 场
SCENES = [
    "样稿-卡1-开篇.md", "样稿-卡2-买拖鞋.md", "样稿-卡3-跑车的日子.md", "样稿-卡4-会议室.md",
    "样稿-卡5-同学会.md", "样稿-卡6-KTV.md", "样稿-卡7-跑山.md", "样稿-卡8-车库.md",
    "样稿-卡9-路边摊.md", "样稿-卡10-被堵.md", "样稿-卡11-摩天轮.md", "样稿-卡12-送别.md",
]

# 付费点：卡5 中段，断在下面这一句
PAYLINE = "我张了张嘴，还没说话。"

HAN = re.compile(r"[\u4e00-\u9fff]")

def han(s):
    return len(HAN.findall(s))

def is_section(line):
    s = line.strip()
    return len(s) <= 4 and s.endswith(".") and s[:-1].isdigit()

# ---------- 合稿 ----------
def build():
    blocks, n = [], 0
    counts = []
    for f in SCENES:
        p = ROOT / f
        if not p.exists():
            print("缺文件：" + f, file=sys.stderr)
            sys.exit(1)
        text = p.read_text(encoding="utf-8")
        counts.append((f, han(text)))
        for line in text.split("\n"):
            if is_section(line):
                n += 1
                blocks.append("%d." % n)
            elif line.strip():
                blocks.append(line)
    body = "\n".join(blocks)
    OUT.write_text(TITLE + "\n" + body + "\n", encoding="utf-8")
    return body, counts, n

def main():
    body, counts, sections = build()
    total = han(body)
    free = han(body.split(PAYLINE)[0]) + han(PAYLINE)

    print("=" * 64)
    print("%s —— 合稿体检" % TITLE)
    print("=" * 64)
    print("\n【一】字数")
    for f, c in counts:
        print("   %-26s %5d" % (f, c))
    print("   %-26s %5d  （%d 小节，%d 行）" % ("合计", total, sections, len(body.split("\n"))))
    print("   免费段（到付费点）= %d 字；付费段 = %d 字" % (free, total - free))
    print("   规范：短篇 12,000–15,000；免费段 2,000–6,000")

    print("\n【二】标点红线（全部必须为 0，`—` 单破折号除外 —— 也应为 0）")
    punct = {"半角双引号 \"": body.count('"'), "半角单引号 '": body.count("'"),
             "……": body.count("……"), "——": body.count("——"),
             "—": body.count("—"), "--": body.count("--")}
    for k, v in punct.items():
        print("   %-16s %s" % (k, "OK" if v == 0 else "FAIL %d" % v))
    lq, rq = body.count("「"), body.count("」")
    print("   %-16s %d / %d  %s" % ("「」配对", lq, rq, "OK" if lq == rq else "FAIL"))
    blank = [i for i, l in enumerate(body.split("\n")) if not l.strip()]
    print("   %-16s %s" % ("空行", "OK" if not blank else "FAIL %d 处 %s" % (len(blank), blank[:5])))
    longest = max(body.split("\n"), key=len)
    print("   %-16s %d 字 %s" % ("最长行", len(longest), "OK" if len(longest) <= 45 else "FAIL"))

    print("\n【三】频次（skill 全文上限：像 ≤10、同一身体部位 ≤5）")
    for w, lim in [("像", 10), ("手", 5), ("心", 5), ("眼", 5), ("膝盖", 5)]:
        c = body.count(w)
        note = ""
        if w == "像":
            note = "（其中「头像」%d、「好像」%d 不是比喻）" % (body.count("头像"), body.count("好像"))
            eff = c - body.count("头像") - body.count("好像")
            flag = "OK" if eff <= lim else "超 %d" % (eff - lim)
            print("   %-6s %3d 有效 %3d  %s %s" % (w, c, eff, flag, note))
        elif w in ("手", "心", "眼"):
            note = "（「手机」%d、「眼镜/老花镜」%d 属道具名，不计部位描写）" % (
                body.count("手机"), body.count("眼镜") + body.count("老花镜"))
            print("   %-6s %3d  %s %s" % (w, c, "参考项", note))
        else:
            print("   %-6s %3d  %s" % (w, c, "OK" if c <= lim else "超 %d，按口头禅删" % (c - lim)))
    print("   节拍词（口语底色，逐场保留、只砍同型扎堆）：")
    print("     一下 %d（其中 烫了一下 %d、愣了一下 %d、笑了一下 %d、看了一眼 %d、没说话 %d）" % (
        body.count("一下"), body.count("烫了一下"), body.count("愣了一下"),
        body.count("笑了一下"), body.count("看了一眼"), body.count("没说话")))

    print("\n【四】硬数字（一处一值，跨场必须自洽）")
    nums = ["一万六千多", "一万八千二", "一万七千五百二", "六百八", "三十六块五",
            "十八万公里", "八百毫秒", "8 毫秒", "三块五", "四十三人", "四十七个人", "三千七"]
    for x in nums:
        print("   %-14s %d 次" % (x, body.count(x)))
    ok = (body.count("一万八千二") == 1 and body.count("一万七千五百二") == 1
          and body.count("六百八") == 1 and body.count("800 毫秒") == 0)
    print("   账目自洽（18,200 − 17,520 = 680）：%s" % ("OK" if ok else "CHECK"))

    print("\n【五】关键句锚点（分场写作时逐场核过的句子，合稿后必须还在）")
    anchors = [
        "「你有鞋吗。」", "「是它先挡我的。」", "「我下不去。」", "四十三人的群，二十七个人点了收到",
        "手机上的钱是数字，一划就没了。现金有厚度", "这根杆子怎么受得住的", "「真心给的算。」", "「合脚的。」",
        "你当这鞋带金的", "假的给出去，三天就散了", "我要是能造，我早给自己造双鞋了",
        "你倒水的时候在想别的", "「你也是糊的。」", "那道缝里没有灰", "土上有脚印了",
        "这是我这辈子最擅长的事", "「老夫记着。」",
        "稳，就是没魂", "窝囊费到账了吗", "「你老板画的饼」", "那老夫欠你一次",
        "不是恨。是没看见", "一个月四十五。这个我也算过", "「你是不敢去。」",
        "此人的技术恐怕在我之上", "没说谁", "是我的身体记住了",
        "「你还在做技术啊。」", "「挺好，稳定。」", "没变，是这桌上最重的一句话",
        "混得好基础，混得不好就不基础", PAYLINE, "那个报告出在我们医院", "「加一个。」", "下一场，唱歌",
        "生僻", "「这首我会。」", "一个管下雨的，唱歌像在述职", "「下雨的时候，底下没人鼓掌。」",
        "「站直了。」", "「帮老夫拿着。」", "「你以前不唱歌的。」", "「你喝的是雪碧。」",
        "老叟戏顽童", "它松了油门", "做完了我才知道我做完了", "「老夫今天把你的油钱也开出来了。」",
        "她一共说了四句", "是为了让我看", "十二年，我用了一秒钟。", "她没说出来", "绩效再核",
        "「要不要再来一次。」", "我说：回家。",
        "「这瓜皮是金子做的，还是这瓜子是金子做的。」", "「这梗我一天听八遍。」",
        "「你瞧瞧现在哪有瓜呀，这都是大棚的瓜。」", "她说得比我熟", "「我开水果摊的，能卖你生瓜蛋子。」",
        "「你是故意找茬是不是。你要不要吧。」", "吸铁石。", "脑子里装的都是台词", "「哥们儿，借一步说话。」",
        "萨日朗", "上班那双皮鞋", "「你快点。」",
        "「我恐高。」", "「你看，前面漆黑一片，什么也看不到。」", "「天亮了以后会很美的。」",
        "「我喜欢你。」", "「我知道。」", "「你讲得太慢了。」", "「她不算。她钱我先收的。」",
        "「天上走路不用鞋。」", "「这双留着。」", "「明年还我。」", "「这就是你们的天。」",
        "「敬自己一杯。」", "结果我只是把拖鞋摆正了。", "「老夫掐的。你不用谢。」",
        "「下次别挑高的地方。」", "一万七千五百二。少了六百八。", "延迟：8 毫秒。",
    ]
    miss = [a for a in anchors if a not in body]
    print("   锚点 %d 条，缺失 %d 条 %s" % (len(anchors), len(miss), miss if miss else "全部在位"))
    print("\n合稿已写出：%s" % OUT.name)

if __name__ == "__main__":
    main()
