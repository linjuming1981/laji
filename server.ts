import express from 'express';
import cors from 'cors';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Lazy init Gemini SDK
let aiClient: GoogleGenAI | null = null;
function getGenAI(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    aiClient = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }
  return aiClient;
}

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    hasGeminiKey: Boolean(process.env.GEMINI_API_KEY),
    model: 'gemini-3.8-flash'
  });
});

// Endpoint: Generate Full Outline based on 短片小说大纲skill.md
app.post('/api/generate-outline', async (req, res) => {
  const { form, targetLength, targetEmotion, genre, pov, endingTone, strategy, premise } = req.body;

  if (!premise) {
    return res.status(400).json({ error: '请提供一句话灵感或故事核心想法' });
  }

  const ai = getGenAI();
  if (!ai) {
    return res.status(503).json({
      error: 'GEMINI_API_KEY 未配置。请在系统环境变量或设置中配置 GEMINI_API_KEY。',
      requiresKey: true
    });
  }

  const prompt = `你是一名严格遵循《短片/短篇大纲Skill》的专业叙事结构师。你的产出只有大纲施工图，绝不写正文对白。
请基于以下输入参数，生成一套精简、聚焦、可执行的大纲四件套：

【输入参数】
- 原始灵感/素材: ${premise}
- 形态与体量: ${form === 'novel' ? '短篇小说' : form === 'film' ? '单条短片' : '微短剧'}（目标体量：${targetLength || '8000-12000字'}）
- 目标情绪: ${targetEmotion || '反转震撼'}
- 题材方向: ${genre || '悬疑反转'}
- 视角人称: ${pov || '第一人称「我」'}
- 结局气质: ${endingTone || '闭环'}
- 叙述策略: ${strategy || '戏剧性反讽（读者交底）'}

【硬性编写规范 - 必须完全遵循】
1. 一句话锁定 (Logline): 公式必须为「异常设定 + 日常人物/职业 + 核心冲突 + 情绪落点」，并确认有具体人和麻烦。
2. 故事契约 (不超过300字):
   - 主角想要什么（目标，必须具体可判定成败）
   - 最大阻碍是什么（主动对抗）
   - 主角为什么不能退出（引擎，退得掉就没有张力）
   - 每一轮对抗改变什么（权力/信息/关系/资源/代价至少一项）
   - 最终结果与情绪落点
   - 主题一句话
3. 人设速写: 最多3-4人，超员必须合并。每人1句速写、想要什么、在故事里的功能。
4. 骨架五段 (全段合计不超过500字):
   ① 钩子 (5-10%): 首个事件必须在开篇10%内发生
   ② 冲突建立 (20-25%): 主角目标显形+阻力现身
   ③ 转折 / 二次打击 (25-30%): 认知翻转或情况恶化，由前文因果导出，不天降
   ④ 高潮 (25-30%): 主角主动做出生死/道德抉择并付出代价
   ⑤ 钉子 / 余味 (5-10%): 闭环或强留白，元素前文有铺垫
5. 场景卡列表 (5-12张，绝不能少于5张或超过12张):
   固定必须包含：所属段, 场景(地点/时段), 发生什么(谁做了具体什么动作), 状态变化(信息/权力/关系/资源至少一项改变), 因果连接(必须用「因此」或「但是」连接，严禁纯「然后」), 出场角色, 钩子/收束。如果是短片/短剧，附带时长估算与视觉化动作。
6. 贯穿物件 (1-2件): 登记第1次、第2次、第3次出现的含义。
7. 质量门评估 (A1-A7, B1-B6, C1-C8, C9): 逐条标记 passed: true/false 并附短评。
8. 连续性台账:
   - timeline: 场次、第几天、时刻、备注
   - numbers: 人物年龄、年份、金额/数字、出现场次
   - hooks: 埋下的钩子、埋设场次、兑现场次、状态（已兑现/留白）

请以纯 JSON 格式返回，不要包含 markdown 代码块反引号外的废话：
{
  "title": "作品暂定标题",
  "logline": "一句话故事线",
  "storyContract": {
    "goal": "...",
    "obstacle": "...",
    "engine": "...",
    "changePerRound": "...",
    "finalOutcome": "...",
    "theme": "..."
  },
  "characters": [
    { "id": "c1", "name": "...", "oneLineBio": "...", "desire": "...", "functionInStory": "..." }
  ],
  "synopsis": "一段200-400字的故事完整摘要",
  "skeleton": [
    { "actNumber": 1, "actName": "① 钩子", "percentage": "10%", "description": "...", "checkpoint": "..." },
    { "actNumber": 2, "actName": "② 冲突建立", "percentage": "20%", "description": "...", "checkpoint": "..." },
    { "actNumber": 3, "actName": "③ 转折 / 二次打击", "percentage": "25%", "description": "...", "checkpoint": "..." },
    { "actNumber": 4, "actName": "④ 高潮", "percentage": "35%", "description": "...", "checkpoint": "..." },
    { "actNumber": 5, "actName": "⑤ 钉子 / 余味", "percentage": "10%", "description": "...", "checkpoint": "..." }
  ],
  "scenes": [
    {
      "id": "s1",
      "sceneNumber": 1,
      "actName": "① 钩子",
      "locationAndTime": "地点与时段",
      "whatHappens": "发生什么具体动作",
      "statusChange": "状态变化",
      "causality": "因此 / 但是...",
      "charactersPresent": "出场角色",
      "hookOrResolution": "钩子/收束",
      "filmDuration": "可选秒数",
      "filmVisualBeat": "可选视觉可拍性"
    }
  ],
  "recurringObjects": [
    { "name": "物件名", "app1": "...", "app2": "...", "app3": "..." }
  ],
  "qualityGates": [
    { "code": "A1", "category": "A类 结构门", "name": "一句话故事线含人+麻烦", "description": "...", "passed": true, "notes": "..." }
  ],
  "ledgers": {
    "timeline": [{ "scene": 1, "day": "第1天", "time": "23:00", "note": "..." }],
    "numbers": [{ "item": "主角年龄", "value": "28岁", "scenes": "第1场" }],
    "hooks": [{ "hook": "...", "plantedScene": "第1场", "redeemedScene": "第5场", "status": "已兑现" }]
  }
}`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      }
    });

    const responseText = response.text || '{}';
    const parsed = JSON.parse(responseText);
    parsed.params = { form, targetLength, targetEmotion, genre, pov, endingTone, strategy, premise };
    res.json(parsed);
  } catch (err: any) {
    console.error('Gemini outline generation error:', err);
    res.status(500).json({ error: '生成大纲失败: ' + (err.message || '未知错误') });
  }
});

// Endpoint: Diagnose Existing Outline (体检模式)
app.post('/api/diagnose-outline', async (req, res) => {
  const { outlineText } = req.body;
  if (!outlineText || outlineText.trim().length < 50) {
    return res.status(400).json({ error: '请提供至少50字的大纲文本进行体检诊断' });
  }

  const ai = getGenAI();
  if (!ai) {
    return res.status(503).json({
      error: 'GEMINI_API_KEY 未配置。请在系统环境变量或设置中配置 GEMINI_API_KEY。',
      requiresKey: true
    });
  }

  const prompt = `你是《短片/短篇大纲Skill》的特聘大纲体检主诊医师。
用户贴进了一份已有大纲，请你对其做深度【体检诊断】。
规则：
1. 不要顺手替用户重写，把病灶摆出来看。
2. 逐条评判 A类结构门 (A1-A7)、B类因果门 (B1-B6)、C类兑现门 (C1-C9)、以及叙述策略冲突自查（信息差方向是否反转冲突）。
3. 重点查找：进入是否太慢（首事件是否拖沓）、主角目标是否不可判定、是否随时能退出、高潮是否靠他人搭救或机械降神、场景是否空转、是否纯「然后」流水账、结尾是否天降、是否有成段引号对白。
4. 每道不通过的门，明确给出：病灶（问题是什么）、证据（引用大纲原文句子）、最小修复动作（改动最小能达标的方案）。

用户大纲原文如下：
"""
${outlineText}
"""

请以纯 JSON 格式返回：
{
  "summary": "总体诊断结论（100-200字，说明主要结构优劣与核心风险）",
  "passedCount": 15,
  "failedCount": 6,
  "gates": [
    {
      "code": "A1",
      "category": "A类 结构门",
      "name": "一句话故事线含人+麻烦",
      "passed": true,
      "diagnosis": "病灶说明（如果未通过）",
      "evidence": "引用的原句或'未提及'",
      "fixAction": "建议的最小修复动作"
    }
  ],
  "topIssues": [
    {
      "severity": "P0" | "P1" | "P2",
      "title": "核心问题标题",
      "description": "详细阐述",
      "recommendation": "修复建议"
    }
  ]
}`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: { responseMimeType: 'application/json' }
    });

    const parsed = JSON.parse(response.text || '{}');
    res.json(parsed);
  } catch (err: any) {
    console.error('Diagnosis error:', err);
    res.status(500).json({ error: '体检分析失败: ' + (err.message || '未知错误') });
  }
});

// Endpoint: Generate YanYan Lead-in (导语打磨)
app.post('/api/generate-lead', async (req, res) => {
  const { logline, contract, firstScene, styleNotes } = req.body;

  const ai = getGenAI();
  if (!ai) {
    return res.status(503).json({
      error: 'GEMINI_API_KEY 未配置。请在系统环境变量或设置中配置 GEMINI_API_KEY。',
      requiresKey: true
    });
  }

  const prompt = `你是一名知乎盐选签约短篇写手，严格执行《盐言故事短篇小说正文写作Skill》中的【导语】规范。
请为以下故事创作一段极致打磨的盐言故事导语：

【故事上下文】
- 一句话故事: ${logline || '暂无'}
- 故事契约: ${JSON.stringify(contract || {})}
- 第一场核心冲突: ${JSON.stringify(firstScene || {})}
- 额外风格要求: ${styleNotes || '情绪宁烈不温，直白共鸣'}

【导语硬约束 ⛔】
1. 长度严格控制在 150–220 字之间，不多不少。
2. 格式：一句一段！每个完整句独立成段，相邻段落仅一个换行符，无多余空行，无全角空格缩进。
3. 四维骨架完整闭环：
   - 起因：悲剧源头或荒诞开端
   - 核心冲突：被算计、被剥削、不可退缩的绝境
   - 人设底色：清醒、有底牌——不是纯惨！有后手才有追读欲
   - 情绪反转：钩子卡在最后半句，戛然而止
4. 黄金三角齐备：
   - 必须出现一件独特、可截图的具体物件（例如：代持协议、冷掉的排骨汤、带血的欠条、撕碎的B超单）
   - 一个信息差（读者知道、施害者不知道的底牌：「他不知道，我早已...」）
   - 一个留白钩子（最后半句吊住）
5. 严禁平铺背景、交代天气、抒情辞藻。
6. 严禁出现「导语」两个字。

请以纯 JSON 格式返回：
{
  "cause": "起因解析",
  "conflict": "核心冲突解析",
  "personaBottom": "人设底牌解析（为什么不是纯惨）",
  "reversalHook": "最后半句留白钩子解析",
  "specificObject": "具体物件名",
  "informationGap": "信息差说明",
  "leadText": "正文导语内容（150-220字，一句一段，换行隔开）",
  "charCount": 185
}`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: { responseMimeType: 'application/json' }
    });

    const parsed = JSON.parse(response.text || '{}');
    res.json(parsed);
  } catch (err: any) {
    console.error('Lead gen error:', err);
    res.status(500).json({ error: '导语生成失败: ' + (err.message || '未知错误') });
  }
});

// Endpoint: Generate Chapter Prose (盐言正文撰写)
app.post('/api/generate-prose', async (req, res) => {
  const { outlineContext, currentScene, previousText, hasHeartbreakSwitch, isPaywallScene } = req.body;

  const ai = getGenAI();
  if (!ai) {
    return res.status(503).json({
      error: 'GEMINI_API_KEY 未配置。请在系统环境变量或设置中配置 GEMINI_API_KEY。',
      requiresKey: true
    });
  }

  const prompt = `你是知乎盐选签约短篇顶尖作者，正文写作严格遵循《盐言故事短篇小说正文写作Skill》。
请根据场景施工图撰写本节正文（约1000–1800字）。

【场景施工图】
- 场景编号与段落: ${currentScene.actName} · 第${currentScene.sceneNumber}场
- 场景地点时段: ${currentScene.locationAndTime}
- 发生事件: ${currentScene.whatHappens}
- 状态变化: ${currentScene.statusChange}
- 因果关系: ${currentScene.causality}
- 出场人物: ${currentScene.charactersPresent}
- 钩子/收束: ${currentScene.hookOrResolution}
- 故事背景与主角契约: ${JSON.stringify(outlineContext || {})}
- 前情衔接提示: ${previousText ? previousText.slice(-300) : '这是正文开篇第一节'}
- 是否需要心死定格句: ${hasHeartbreakSwitch ? '是！本节撞破真相后必须出现单句成段的「那一刻，我的心彻底死了。」完成双轨腔调切换。' : '否'}
- 是否是付费点断点卡位: ${isPaywallScene ? '是！本节最后5句必须卡在卡脖子瞬间（巴掌将落/按键将按/底牌将亮未亮），绝不写出兑现结果，让读者欲罢不能！' : '否'}

【正文硬性纪律 ⛔ 违者退稿】
1. 人称：全程第一人称「我」在场叙述！跳出当下的评述必须是带情绪的主观审判或追读钩子，严禁中立作者讲解。
2. 对话格式与权力博弈：
   - 引号一律使用「」，严禁使用双引号 "" 或 “”！
   - 对话必须独立成行，不用大段「他说」「她冷笑道」标签，用动作beat代替。
   - 权力上位者话短冷静（≤10字），亮底牌；被压制方长句情绪化（≥20字）。
3. 情绪外化法则：情绪词（心如死灰、几欲作呕、鼻头一酸）后面必须紧接此刻手里/眼前独有的具体动作或物件（如：凉掉的排骨汤、攥紧的病历单）。严禁悬空的纯心理感叹！
4. 标点禁令：正文严禁出现任何省略号「……」和破折号「——」「—」「--」，停顿用短句逗号句号或换行动作替代！
5. 排版：短段为底色，一段1-3行，段间仅一个换行符，严禁Markdown标记（正文中禁止加粗、斜体、标题），禁止「第N章」「前文」等元信息词。
6. 去AI腔黑名单：严禁出现「命运的齿轮」「如潮水般」「仿佛春风」「心猛地一沉」「眼眶泛红」「不由得」「一丝X涌上心头」「像被抽空了力气」。
7. 疏密有致：打脸与高潮详写，过场赶路一两句带过，严禁通篇同字数三字句排列。

请直接输出正文文本，不要带任何前言废话。`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
    });

    const prose = response.text || '';
    res.json({ content: prose, wordCount: prose.replace(/\s+/g, '').length });
  } catch (err: any) {
    console.error('Prose gen error:', err);
    res.status(500).json({ error: '正文生成失败: ' + (err.message || '未知错误') });
  }
});

// Endpoint: AI Rewrite to Fix Flagged Anti-AI Issues
app.post('/api/rewrite-ai', async (req, res) => {
  const { originalText, flaggedIssues } = req.body;

  const ai = getGenAI();
  if (!ai) {
    return res.status(503).json({
      error: 'GEMINI_API_KEY 未配置。',
      requiresKey: true
    });
  }

  const prompt = `请协助润色以下知乎盐选小说段落，消除AI腔与格式违规：

【待修段落】
"""
${originalText}
"""

【违规点提示】
${JSON.stringify(flaggedIssues || [])}

【精修要求】
1. 彻底清除禁用比喻（命运的齿轮、如潮水般、心猛地一沉、不由得等），换成当场独有的具体物件或身体实感。
2. 将所有「……」和「——」替换为短促逗句、动作beat或句号。
3. 确保所有对话引号为「」，独立成行。
4. 削减口头禅（一下、就是、站在、那种）。
5. 保持第一人称「我」的凌厉爽利知乎体腔调。

请直接输出修整后的完整文本。`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
    });
    res.json({ polishedText: response.text || '' });
  } catch (err: any) {
    console.error('Rewrite error:', err);
    res.status(500).json({ error: 'AI润色失败: ' + (err.message || '未知错误') });
  }
});

// Vite middleware for development, or static files for production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*all', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
