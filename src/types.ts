export type StoryForm = 'novel' | 'film' | 'drama';

export type EmotionTarget = 
  | '意难平'
  | '反转震撼'
  | '爽感释放'
  | '细思极恐'
  | '治愈温暖'
  | '共鸣感动';

export type EndingTone = '闭环' | '意难平' | '反转' | '开放' | '治愈';

export type NarrativeStrategy = '戏剧性反讽（读者交底）' | '叙述性诡计（读者隐瞒）';

export interface OutlineParams {
  form: StoryForm;
  targetLength: string; // e.g. "8000-12000字" or "10分钟" or "10集x2分钟"
  targetEmotion: EmotionTarget;
  genre: string; // 悬疑 / 虐恋 / 复仇 / 职场 / 怪谈 / 现实
  pov: '第一人称「我」' | '第三人称限知';
  endingTone: EndingTone;
  strategy: NarrativeStrategy;
  premise: string; // 一句话灵感或原始材料
}

export interface StoryContract {
  goal: string; // 主角想要什么（具体可判定成败）
  obstacle: string; // 最大阻碍是什么（主动对抗）
  engine: string; // 为什么不能退出（高代价引擎）
  changePerRound: string; // 每一轮对抗改变什么（权力/信息/关系/资源/代价）
  finalOutcome: string; // 最终结果与情绪落点
  theme?: string; // 主题一句话
}

export interface CharacterItem {
  id: string;
  name: string;
  oneLineBio: string;
  desire: string;
  functionInStory: string;
}

export interface SkeletonAct {
  actNumber: number; // 1 to 5
  actName: string; // ①钩子, ②冲突建立, ③转折/二次打击, ④高潮, ⑤钉子/余味
  percentage: string;
  description: string;
  checkpoint: string;
}

export interface SceneCard {
  id: string;
  sceneNumber: number;
  actName: string; // 所属段
  locationAndTime: string; // 地点/时段
  whatHappens: string; // 发生什么（具体动作，谁做了什么）
  statusChange: string; // 状态变化（信息/权力/关系/资源/决定/读者理解）
  causality: string; // 因果连接（必须「因此」或「但是」）
  charactersPresent: string; // 出场角色
  hookOrResolution: string; // 钩子/收束
  filmDuration?: string; // 短片时长估算（秒）
  filmVisualBeat?: string; // 可拍性（看得见的动作/物件）
}

export interface QualityGateItem {
  code: string; // A1-A7, B1-B6, C1-C9
  category: 'A类 结构门' | 'B类 因果门' | 'C类 兑现门' | '冲突自查';
  name: string;
  description: string;
  passed: boolean;
  notes?: string;
  evidence?: string;
  actionRequired?: string;
}

export interface ContinuityLedgers {
  timeline: Array<{ scene: number; day: string; time: string; note: string }>;
  numbers: Array<{ item: string; value: string; scenes: string }>;
  hooks: Array<{ hook: string; plantedScene: string; redeemedScene: string; status: '已兑现' | '留白' | '未兑现' }>;
}

export interface OutlineData {
  title: string;
  params: OutlineParams;
  logline: string;
  storyContract: StoryContract;
  characters: CharacterItem[];
  synopsis: string;
  skeleton: SkeletonAct[];
  scenes: SceneCard[];
  recurringObjects: Array<{ name: string; app1: string; app2: string; app3: string }>;
  qualityGates: QualityGateItem[];
  ledgers: ContinuityLedgers;
}

export interface YanYanLead {
  cause: string; // 起因
  conflict: string; // 核心冲突
  personaBottom: string; // 人设底色（清醒、有底牌、不是纯惨）
  reversalHook: string; // 情绪反转（最后半句戛然而止）
  specificObject: string; // 黄金三角：具体物件
  informationGap: string; // 黄金三角：信息差
  leadText: string; // 最终150-220字导语
  charCount?: number;
}

export interface ChapterSection {
  id: string;
  sectionNumber: number;
  title: string;
  sceneRefIds: string[];
  content: string;
  wordCount: number;
  hasHeartbreakSwitch: boolean; // 是否包含心死定格句
  hasPaywallCutoff: boolean; // 是否是付费点卡位
}

export interface AuditMetric {
  bannedMetaphors: Array<{ word: string; count: number; lines: number[] }>;
  bannedPunctuation: Array<{ mark: string; count: number; lines: number[] }>;
  bodyPartCounts: Record<string, number>;
  simileCounts: number; // 像/像是/不像
  habitualWords: Record<string, number>; // 一下 / 就是 / 站在 / 那种
  metaWords: Array<{ word: string; count: number }>;
  quotationCheck: { standardBracketsCount: number; doubleQuotesCount: number };
  wordCount: number;
  paragraphCount: number;
}
