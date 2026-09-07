# laji

一组用于**中文短篇小说 / 短片 / 微短剧**创作的 AI Skill 文档。
两份文件分工明确：一份管**结构**（大纲怎么搭），一份管**文字**（正文怎么落笔）。

## 文件说明

| 文件 | Skill 名 | 管什么 |
| --- | --- | --- |
| [`短片小说大纲skill.md`](短片小说大纲skill.md) | `short-form-outline` | 从一句话灵感产出大纲四件套：故事契约、骨架五段、场景卡列表、质量门报告。支持短篇小说（3k–20k 字）／单条短片（1–15 分钟）／微短剧（多集 × 1–3 分钟），另有「体检模式」给现成大纲做诊断。 |
| [`盐言故事短篇小说正文写作skill.md`](盐言故事短篇小说正文写作skill.md) | `yanyan-prose-write` | 大纲已定之后，怎么把字落到纸上：知乎体腔调、第一人称在场叙述、「」对话体、导语打磨、付费点落笔、排版硬约束、去 AI 腔黑名单、交付自查清单。 |

推荐流程：**先跑大纲 skill 拍板结构 → 再用正文 skill 逐场景写稿**。

## 使用方式

两份文件都带 YAML frontmatter（`name` / `description` / `triggers` / `allowed-tools`），可直接作为 skill 加载：

```bash
# Claude Code
cp *skill.md ~/.claude/skills/

# Codex / Cursor / 其他支持 skills 的环境
# 放进对应的 skills 目录，或直接作为 system prompt / 项目 AGENTS.md 片段引用
```

也可以完全不接工具，当作写作 checklist 手动对照使用。

## 约定

- 带 ⛔ 标记的小节是**硬约束**，不满足就别交付。
- 修改任一份 skill 时，注意两者的联动：大纲的结构假设会直接影响正文的写法。

## License

MIT
