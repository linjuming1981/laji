#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""正文v2.md 体检脚本（v2.1 规则口径）

用法：python3 正文v2校验.py
只读不写。检查项对应 `盐言故事短篇小说正文写作skill.md` 第 7 / 11 / 12 节。
"""
import io
import re
import sys

PATH = '正文v2.md'
TJ = re.compile(r'[\u4e00-\u9fff]')


def han(s):
    return len(TJ.findall(s))


def main():
    lines = io.open(PATH, encoding='utf-8').read().split('\n')
    while lines and lines[-1] == '':
        lines.pop()

    print('=' * 64)
    print('正文v2.md 体检')
    print('=' * 64)

    # 分节
    secs = []          # [(编号, [行...])]
    cur = ('导语', [])
    for ln in lines:
        if re.fullmatch(r'\d+\.', ln.strip()):
            secs.append(cur)
            cur = (ln.strip(), [])
        else:
            cur[1].append(ln)
    secs.append(cur)
    secs = [(n, ls) for n, ls in secs if any(x.strip() for x in ls)]

    print('\n【一】字数')
    total = 0
    for n, ls in secs:
        c = han('\n'.join(ls))
        total += c
        if n == '导语':
            print('   %-6s %5d' % ('导语', c))
    print('   %-6s %5d' % ('合计', total))
    print('   小节数 %d（不含导语）' % (len(secs) - 1))

    # 付费点：卡5 末尾那句
    pay = '「你今天开什么车来的。」'
    joined = []
    for i, ln in enumerate(lines):
        joined.append(ln)
        if ln.strip() == pay:
            break
    free = han('\n'.join(joined))
    print('   免费段（到付费点那句为止）= %d；付费段 = %d' % (free, total - free))

    # 标点红线
    text = '\n'.join(lines)
    print('\n【二】标点与排版红线（应全为 0）')
    pats = {
        '半角双引号 "': text.count('"'),
        "半角单引号 '": text.count("'"),
        '省略号 ……': text.count('……'),
        '省略号 ...': text.count('...'),
        '破折号 ——': text.count('——'),
        '单破折号 —': text.count('—'),
        '双连字符 --': text.count('--'),
        '全角空格缩进': len(re.findall(r'^[　]+', text, re.M)),
        'Markdown 加粗': text.count('**'),
        '章回元信息': len(re.findall(r'第[一二三四五六七八九十\d]+章|本章|前文|后文|伏笔|读者|上一章', text)),
    }
    for k, v in pats.items():
        print('   %-14s %s' % (k, 'OK' if v == 0 else '✗ %d' % v))

    # 空行 / 行形态
    blank = sum(1 for x in lines[1:-1] if x.strip() == '')
    print('   空行            %s' % ('OK' if blank == 0 else '✗ %d' % blank))
    q = text.count('「')
    q2 = text.count('」')
    print('   「」配对        %s（%d / %d）' % ('OK' if q == q2 else '✗', q, q2))
    bad_q = [i + 1 for i, x in enumerate(lines) if x.count('「') != x.count('」')]
    print('   单行引号不成对  %s' % ('OK' if not bad_q else '✗ 行 %s' % bad_q[:8]))

    # 行长与短行
    lens = [han(x) for x in lines if x.strip()]
    lens.sort()
    longest = max((han(x), x[:26]) for x in lines if x.strip())
    short = sum(1 for v in lens if v <= 12) / float(len(lens))
    print('\n【三】段落形态')
    print('   最长行 %d 字：%s' % longest)
    print('   ≤12 字短行占比 %.0f%%（目标 40–55%%，长短交错）' % (short * 100))
    print('   平均行长 %.1f 字' % (sum(lens) / float(len(lens))))

    # 对话占比
    print('\n【四】对话占比（按行首「」统计）')
    dl = []
    for n, ls in secs:
        body = [x for x in ls if x.strip()]
        if not body:
            continue
        d = sum(1 for x in body if x.strip().startswith('「'))
        dl.append((n, d, len(body), d / float(len(body)) * 100))
    for n, d, t, p in dl:
        print('   %-6s %2d/%-3d %5.0f%%' % (n, d, t, p))
    all_body = [x for x in lines if x.strip()]
    dall = sum(1 for x in all_body if x.strip().startswith('「'))
    print('   全篇 %d/%d = %.0f%%' % (dall, len(all_body), dall / float(len(all_body)) * 100))
    hot = [n for n, d, t, p in dl if p >= 70 and t >= 6]
    print('   对话≥70%% 的小节：%s' % (hot if hot else '无'))

    # 频次
    print('\n【五】频次与口头禅')
    freq = {
        '像/像是/不像': len(re.findall(r'像', text)),
        '眼': len(re.findall(r'眼', text)),
        '手（不含手机）': len(re.findall(r'手(?!机)', text)),
        '心': len(re.findall(r'心', text)),
        '膝盖': len(re.findall(r'膝盖', text)),
        '一下': len(re.findall(r'一下', text)),
        '就是': len(re.findall(r'就是', text)),
        '那种': len(re.findall(r'那种', text)),
    }
    for k, v in freq.items():
        lim = 10 if k.startswith('像') else (5 if k in ('眼', '心', '膝盖') else 12)
        flag = 'OK' if v <= lim else '✗'
        print('   %-12s %3d（上限 %d）%s' % (k, v, lim, flag))

    # 禁用比喻
    print('\n【六】AI 腔黑名单')
    black = ['命运的齿轮', '如潮水', '仿佛春风', '心猛地一沉', '眼眶泛红', '不由得',
             '一丝', '涌上心头', '仿佛整个世界', '抽空', '这一刻', '不禁', '仿佛']
    hit = [(b, text.count(b)) for b in black if text.count(b)]
    print('   %s' % ('OK' if not hit else '✗ %s' % hit))

    # 规则口径
    print('\n【七】v2.2 规则口径（不该出现的老设定）')
    bad = ['老花镜', '透明', '越用越薄', '糊的', '凉透', '二十分钟', '壳先落地', '手背上的灰',
           '饼干盒', '铁盒', '现金', '纸币', '厚度']
    hit2 = [(b, text.count(b)) for b in bad if text.count(b)]
    print('   %s' % ('OK' if not hit2 else '✗ %s' % hit2))
    for k in ['三分钟', '三次', '葫芦']:
        print('   %-6s 出现 %d 次' % (k, text.count(k)))

    return 0


if __name__ == '__main__':
    sys.exit(main())
