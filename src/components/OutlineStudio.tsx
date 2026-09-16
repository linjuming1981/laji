import React, { useState } from 'react';
import { 
  OutlineData, 
  StoryForm, 
  EmotionTarget, 
  EndingTone, 
  NarrativeStrategy,
  SceneCard 
} from '../types';
import { 
  Sparkles, 
  HelpCircle, 
  CheckCircle2, 
  XCircle, 
  Plus, 
  Trash2, 
  Layers, 
  Clock, 
  Hash, 
  Anchor,
  Send,
  Loader2,
  AlertTriangle,
  ArrowRight
} from 'lucide-react';

interface OutlineStudioProps {
  outline: OutlineData;
  onChangeOutline: (newOutline: OutlineData) => void;
  onProceedToProse: () => void;
}

export const OutlineStudio: React.FC<OutlineStudioProps> = ({
  outline,
  onChangeOutline,
  onProceedToProse
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [genError, setGenError] = useState<string | null>(null);
  const [activeSubView, setActiveSubView] = useState<'overview' | 'contract' | 'skeleton' | 'scenes' | 'gates' | 'ledgers'>('overview');
  const [sceneViewMode, setSceneViewMode] = useState<'cards' | 'table'>('table');

  const handleParamChange = (field: string, val: any) => {
    onChangeOutline({
      ...outline,
      params: {
        ...outline.params,
        [field]: val
      }
    });
  };

  const handleGenerateOutline = async () => {
    if (!outline.params.premise.trim()) {
      setGenError('请输入一句话故事灵感');
      return;
    }

    setIsGenerating(true);
    setGenError(null);

    try {
      const res = await fetch('/api/generate-outline', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(outline.params)
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || '生成失败');
      }

      onChangeOutline(data);
    } catch (err: any) {
      setGenError(err.message || '网络连接或模型响应异常');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div id="outline-studio-root" className="space-y-6">
      
      {/* Top Header & Generator Panel */}
      <div className="bg-white rounded-xl border border-stone-200 p-5 sm:p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-100 pb-5 mb-5">
          <div>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-800 border border-amber-200/60 mb-2">
              Step 0 收参数 ⛔ 缺了不开工
            </span>
            <h2 className="text-xl font-bold text-stone-900 font-serif-sc">
              短篇叙事施工图大纲工坊
            </h2>
            <p className="text-xs text-stone-500 mt-1">
              情绪先行、一句话锁定、骨架先拍板再写细节，产出故事契约、骨架五段、场景卡列表、质量门报告四件套。
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <button
              id="generate-outline-action-btn"
              onClick={handleGenerateOutline}
              disabled={isGenerating}
              className="flex items-center space-x-2 bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white px-4 py-2.5 rounded-lg text-xs font-medium shadow-sm transition-all"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>叙事结构师规划中...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>一键生成 / 重构大纲四件套</span>
                </>
              )}
            </button>

            <button
              id="go-to-prose-btn"
              onClick={onProceedToProse}
              className="flex items-center space-x-1.5 bg-stone-900 hover:bg-stone-800 text-stone-100 px-4 py-2.5 rounded-lg text-xs font-medium shadow-sm transition-all"
            >
              <span>进入正文写作</span>
              <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
            </button>
          </div>
        </div>

        {genError && (
          <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-700 flex items-start space-x-2">
            <AlertTriangle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">{genError}</p>
              <p className="text-[11px] text-red-600 mt-0.5">
                若因未配置 GEMINI_API_KEY，可在右上角「载入范例预设」立即体验完整现成大纲！
              </p>
            </div>
          </div>
        )}

        {/* Input Parameters Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div>
            <label className="block font-medium text-stone-700 mb-1">
              形态与体量 <span className="text-red-500">*必问</span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              <select
                aria-label="故事形态"
                value={outline.params.form}
                onChange={(e) => handleParamChange('form', e.target.value as StoryForm)}
                className="w-full bg-stone-50 border border-stone-200 rounded-lg p-2 focus:ring-1 focus:ring-amber-500"
              >
                <option value="novel">短篇小说</option>
                <option value="film">单条短片</option>
                <option value="drama">微短剧</option>
              </select>
              <input
                type="text"
                aria-label="目标体量字数"
                value={outline.params.targetLength}
                onChange={(e) => handleParamChange('targetLength', e.target.value)}
                placeholder="例如: 8000-12000字"
                className="w-full bg-stone-50 border border-stone-200 rounded-lg p-2 focus:ring-1 focus:ring-amber-500"
              />
            </div>
          </div>

          <div>
            <label className="block font-medium text-stone-700 mb-1">
              目标情绪 <span className="text-red-500">*核心落点</span>
            </label>
            <select
              aria-label="目标情绪"
              value={outline.params.targetEmotion}
              onChange={(e) => handleParamChange('targetEmotion', e.target.value as EmotionTarget)}
              className="w-full bg-stone-50 border border-stone-200 rounded-lg p-2 focus:ring-1 focus:ring-amber-500 font-medium text-stone-800"
            >
              <option value="反转震撼">反转震撼（全篇为主揭示蓄力，误导假线索）</option>
              <option value="爽感释放">爽感释放（打脸逆袭复仇，爽点密、当场兑现）</option>
              <option value="意难平">意难平（高潮给差一点，结尾不给补偿）</option>
              <option value="细思极恐">细思极恐（关键信息留在细节画面，不点破）</option>
              <option value="治愈温暖">治愈温暖（冲突可小但代价真）</option>
              <option value="共鸣感动">共鸣感动（冲突取自日常，忌奇观化）</option>
            </select>
          </div>

          <div>
            <label className="block font-medium text-stone-700 mb-1">
              题材方向 & 视角
            </label>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                aria-label="题材方向"
                value={outline.params.genre}
                onChange={(e) => handleParamChange('genre', e.target.value)}
                placeholder="题材 (如: 悬疑/职场)"
                className="w-full bg-stone-50 border border-stone-200 rounded-lg p-2 focus:ring-1 focus:ring-amber-500"
              />
              <select
                aria-label="视角人称"
                value={outline.params.pov}
                onChange={(e) => handleParamChange('pov', e.target.value)}
                className="w-full bg-stone-50 border border-stone-200 rounded-lg p-2 focus:ring-1 focus:ring-amber-500"
              >
                <option value="第一人称「我」">第一人称「我」</option>
                <option value="第三人称限知">第三人称限知</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-medium text-stone-700 mb-1">
              叙述策略 & 结局气质
            </label>
            <div className="grid grid-cols-2 gap-2">
              <select
                aria-label="叙述策略"
                value={outline.params.strategy}
                onChange={(e) => handleParamChange('strategy', e.target.value as NarrativeStrategy)}
                className="w-full bg-stone-50 border border-stone-200 rounded-lg p-2 focus:ring-1 focus:ring-amber-500"
              >
                <option value="戏剧性反讽（读者交底）">戏剧反讽（交底张力高）</option>
                <option value="叙述性诡计（读者隐瞒）">叙述诡计（全知瞒到尾）</option>
              </select>
              <select
                aria-label="结局气质"
                value={outline.params.endingTone}
                onChange={(e) => handleParamChange('endingTone', e.target.value as EndingTone)}
                className="w-full bg-stone-50 border border-stone-200 rounded-lg p-2 focus:ring-1 focus:ring-amber-500"
              >
                <option value="闭环">闭环</option>
                <option value="反转">反转</option>
                <option value="意难平">意难平</option>
                <option value="开放">开放</option>
                <option value="治愈">治愈</option>
              </select>
            </div>
          </div>

          {/* Full Premise */}
          <div className="sm:col-span-2 lg:col-span-4">
            <label className="block font-medium text-stone-700 mb-1">
              一句话灵感 / 原始材料 / 核心设定 <span className="text-red-500">*必填</span>
            </label>
            <textarea
              id="premise-input-textarea"
              rows={2}
              value={outline.params.premise}
              onChange={(e) => handleParamChange('premise', e.target.value)}
              placeholder="例如：外卖员发现自己每天少一小时，而超时的订单会死人... 或粘贴一段原始故事梗概"
              className="w-full bg-stone-50 border border-stone-200 rounded-lg p-2.5 text-xs focus:ring-1 focus:ring-amber-500"
            />
          </div>
        </div>
      </div>

      {/* Sub-Navigation */}
      <div className="flex items-center space-x-2 border-b border-stone-200 pb-2 text-xs overflow-x-auto">
        <button
          onClick={() => setActiveSubView('overview')}
          className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
            activeSubView === 'overview'
              ? 'bg-amber-100 text-amber-900 border border-amber-300'
              : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          一句话锁定 (Logline) 与 摘要
        </button>
        <button
          onClick={() => setActiveSubView('contract')}
          className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
            activeSubView === 'contract'
              ? 'bg-amber-100 text-amber-900 border border-amber-300'
              : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          故事契约与人设 (≤4人)
        </button>
        <button
          onClick={() => setActiveSubView('skeleton')}
          className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
            activeSubView === 'skeleton'
              ? 'bg-amber-100 text-amber-900 border border-amber-300'
              : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          骨架五段 (拍板门)
        </button>
        <button
          onClick={() => setActiveSubView('scenes')}
          className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
            activeSubView === 'scenes'
              ? 'bg-amber-100 text-amber-900 border border-amber-300'
              : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          场景卡列表 ({outline.scenes.length}张)
        </button>
        <button
          onClick={() => setActiveSubView('gates')}
          className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
            activeSubView === 'gates'
              ? 'bg-amber-100 text-amber-900 border border-amber-300'
              : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          质量门自检报告 (A/B/C)
        </button>
        <button
          onClick={() => setActiveSubView('ledgers')}
          className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
            activeSubView === 'ledgers'
              ? 'bg-amber-100 text-amber-900 border border-amber-300'
              : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          连续性台账 (时间/数字/钩子)
        </button>
      </div>

      {/* Sub-Views Content */}

      {/* 1. Overview & Logline */}
      {activeSubView === 'overview' && (
        <div className="space-y-6">
          {/* Step 1 Logline card */}
          <div className="bg-amber-50/70 border border-amber-200/80 rounded-xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                <h3 className="text-sm font-bold text-amber-950 font-serif-sc tracking-wide">
                  Step 1 一句话锁定 (Logline) ⛔
                </h3>
              </div>
              <span className="text-[11px] font-mono text-amber-800 bg-amber-100 px-2 py-0.5 rounded border border-amber-300">
                公式: 异常设定 + 日常人物/职业 + 核心冲突 + 情绪落点
              </span>
            </div>

            <textarea
              id="logline-textarea"
              rows={2}
              value={outline.logline}
              onChange={(e) => onChangeOutline({ ...outline, logline: e.target.value })}
              className="w-full bg-white border border-amber-200 rounded-lg p-3 text-sm font-medium text-stone-900 focus:ring-2 focus:ring-amber-500 leading-relaxed"
            />

            {/* Self-check checklist */}
            <div className="mt-3 pt-3 border-t border-amber-200/60 grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-amber-900">
              <div className="flex items-center space-x-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-700" />
                <span>去掉异常设定，故事还能成立吗？</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-700" />
                <span>包含具体的「人」和「麻烦」</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-700" />
                <span>读完能立刻让人想追问「然后呢」</span>
              </div>
            </div>
          </div>

          {/* Synopsis */}
          <div className="bg-white border border-stone-200 rounded-xl p-5 shadow-sm">
            <h3 className="text-sm font-bold text-stone-900 font-serif-sc mb-2">
              故事摘要 (200–400字)
            </h3>
            <textarea
              rows={4}
              value={outline.synopsis}
              onChange={(e) => onChangeOutline({ ...outline, synopsis: e.target.value })}
              className="w-full bg-stone-50 border border-stone-200 rounded-lg p-3 text-xs leading-relaxed text-stone-800 focus:ring-1 focus:ring-amber-500"
            />
          </div>

          {/* Title & Metadata */}
          <div className="bg-white border border-stone-200 rounded-xl p-5 shadow-sm">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  作品暂定标题
                </label>
                <input
                  type="text"
                  value={outline.title}
                  onChange={(e) => onChangeOutline({ ...outline, title: e.target.value })}
                  className="w-full bg-stone-50 border border-stone-200 rounded-lg p-2.5 text-sm font-serif-sc font-bold text-stone-900 focus:ring-1 focus:ring-amber-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  贯穿物件 (1–2 件，首尾呼应)
                </label>
                <div className="space-y-1.5">
                  {outline.recurringObjects.map((item, idx) => (
                    <div key={idx} className="p-2 rounded bg-stone-50 border border-stone-200 text-xs flex justify-between items-center">
                      <span className="font-semibold text-stone-800 font-serif-sc">{item.name}</span>
                      <span className="text-stone-500 text-[11px] truncate max-w-[240px]">{item.app1}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. Story Contract & Characters */}
      {activeSubView === 'contract' && (
        <div className="space-y-6">
          {/* Story contract */}
          <div className="bg-white border border-stone-200 rounded-xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4 border-b border-stone-100 pb-3">
              <div>
                <h3 className="text-sm font-bold text-stone-900 font-serif-sc">
                  Step 2 故事契约（核心三要素 + 引擎）
                </h3>
                <p className="text-xs text-stone-500">
                  整份大纲里唯一允许设定之处。退得掉的故事没有张力！
                </p>
              </div>
              <span className="text-xs text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                不超过300字
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-3 bg-stone-50 rounded-lg border border-stone-200">
                <span className="font-bold text-stone-800 block mb-1">
                  ① 主角想要什么（目标，必须具体可判定成败）
                </span>
                <textarea
                  rows={2}
                  value={outline.storyContract.goal}
                  onChange={(e) => onChangeOutline({
                    ...outline,
                    storyContract: { ...outline.storyContract, goal: e.target.value }
                  })}
                  className="w-full bg-white border border-stone-200 rounded p-2 text-stone-800"
                />
              </div>

              <div className="p-3 bg-stone-50 rounded-lg border border-stone-200">
                <span className="font-bold text-stone-800 block mb-1">
                  ② 最大阻碍是什么（冲突，必须是主动对抗而非环境不便）
                </span>
                <textarea
                  rows={2}
                  value={outline.storyContract.obstacle}
                  onChange={(e) => onChangeOutline({
                    ...outline,
                    storyContract: { ...outline.storyContract, obstacle: e.target.value }
                  })}
                  className="w-full bg-white border border-stone-200 rounded p-2 text-stone-800"
                />
              </div>

              <div className="p-3 bg-red-50/50 rounded-lg border border-red-200">
                <span className="font-bold text-red-900 block mb-1">
                  ③ 主角为什么不能退出（引擎，退得掉就没有张力）
                </span>
                <textarea
                  rows={2}
                  value={outline.storyContract.engine}
                  onChange={(e) => onChangeOutline({
                    ...outline,
                    storyContract: { ...outline.storyContract, engine: e.target.value }
                  })}
                  className="w-full bg-white border border-red-200 rounded p-2 text-stone-800"
                />
              </div>

              <div className="p-3 bg-stone-50 rounded-lg border border-stone-200">
                <span className="font-bold text-stone-800 block mb-1">
                  ④ 每一轮对抗改变什么（权力/信息/关系/资源/代价）
                </span>
                <textarea
                  rows={2}
                  value={outline.storyContract.changePerRound}
                  onChange={(e) => onChangeOutline({
                    ...outline,
                    storyContract: { ...outline.storyContract, changePerRound: e.target.value }
                  })}
                  className="w-full bg-white border border-stone-200 rounded p-2 text-stone-800"
                />
              </div>

              <div className="p-3 bg-stone-50 rounded-lg border border-stone-200 md:col-span-2">
                <span className="font-bold text-stone-800 block mb-1">
                  ⑤ 最终结果与情绪落点
                </span>
                <textarea
                  rows={2}
                  value={outline.storyContract.finalOutcome}
                  onChange={(e) => onChangeOutline({
                    ...outline,
                    storyContract: { ...outline.storyContract, finalOutcome: e.target.value }
                  })}
                  className="w-full bg-white border border-stone-200 rounded p-2 text-stone-800"
                />
              </div>
            </div>
          </div>

          {/* Character sketches */}
          <div className="bg-white border border-stone-200 rounded-xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4 border-b border-stone-100 pb-3">
              <div>
                <h3 className="text-sm font-bold text-stone-900 font-serif-sc">
                  人设速写（每人1句，最多4人硬约束）
                </h3>
                <p className="text-xs text-stone-500">
                  超了就合人：功能重复的角色合成一张脸。功能性角色用标签（如「医生」）不占名额。
                </p>
              </div>
              <span className="text-xs font-mono text-stone-600 bg-stone-100 px-2 py-0.5 rounded">
                当前: {outline.characters.length}/4
              </span>
            </div>

            <div className="space-y-3">
              {outline.characters.map((char, idx) => (
                <div key={char.id || idx} className="p-3 bg-stone-50 border border-stone-200 rounded-lg text-xs grid grid-cols-1 sm:grid-cols-4 gap-2 items-center">
                  <div>
                    <span className="text-stone-400 font-mono mr-1">#{idx + 1}</span>
                    <input
                      type="text"
                      value={char.name}
                      onChange={(e) => {
                        const next = [...outline.characters];
                        next[idx].name = e.target.value;
                        onChangeOutline({ ...outline, characters: next });
                      }}
                      placeholder="姓名/称呼"
                      className="font-bold text-stone-900 bg-white border border-stone-200 rounded px-2 py-1"
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      value={char.oneLineBio}
                      onChange={(e) => {
                        const next = [...outline.characters];
                        next[idx].oneLineBio = e.target.value;
                        onChangeOutline({ ...outline, characters: next });
                      }}
                      placeholder="一句话人设"
                      className="w-full bg-white border border-stone-200 rounded px-2 py-1"
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      value={char.desire}
                      onChange={(e) => {
                        const next = [...outline.characters];
                        next[idx].desire = e.target.value;
                        onChangeOutline({ ...outline, characters: next });
                      }}
                      placeholder="想要什么"
                      className="w-full bg-white border border-stone-200 rounded px-2 py-1"
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={char.functionInStory}
                      onChange={(e) => {
                        const next = [...outline.characters];
                        next[idx].functionInStory = e.target.value;
                        onChangeOutline({ ...outline, characters: next });
                      }}
                      placeholder="故事功能"
                      className="w-full bg-white border border-stone-200 rounded px-2 py-1"
                    />
                    {outline.characters.length > 2 && (
                      <button
                        onClick={() => {
                          const next = outline.characters.filter((_, i) => i !== idx);
                          onChangeOutline({ ...outline, characters: next });
                        }}
                        className="text-stone-400 hover:text-red-600 p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 3. Skeleton 5 Acts */}
      {activeSubView === 'skeleton' && (
        <div className="bg-white border border-stone-200 rounded-xl p-5 shadow-sm space-y-4">
          <div className="border-b border-stone-100 pb-3 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-stone-900 font-serif-sc">
                Step 3 骨架五段 ⛔ 拍板门
              </h3>
              <p className="text-xs text-stone-500">
                万能短篇骨架（合计不超过500字）。拍板三件事：砍了什么、主角最后做了什么选择、大转折落在哪一段。
              </p>
            </div>
            <span className="text-xs text-amber-800 bg-amber-100 px-2 py-0.5 rounded border border-amber-300">
              拍板确认后方可写场景卡
            </span>
          </div>

          <div className="space-y-3">
            {outline.skeleton.map((act, idx) => (
              <div key={idx} className="p-4 rounded-lg bg-stone-50 border border-stone-200 text-xs">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-stone-900 font-serif-sc text-sm">
                      {act.actName}
                    </span>
                    <span className="text-stone-500 bg-white px-2 py-0.5 rounded border border-stone-200 font-mono">
                      篇幅占比: {act.percentage}
                    </span>
                  </div>
                  <span className="text-amber-800 text-[11px] bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                    检查点: {act.checkpoint}
                  </span>
                </div>
                <textarea
                  rows={2}
                  value={act.description}
                  onChange={(e) => {
                    const next = [...outline.skeleton];
                    next[idx].description = e.target.value;
                    onChangeOutline({ ...outline, skeleton: next });
                  }}
                  className="w-full bg-white border border-stone-200 rounded-lg p-2.5 text-stone-800 focus:ring-1 focus:ring-amber-500 leading-relaxed"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. Scene Cards */}
      {activeSubView === 'scenes' && (
        <div className="space-y-4">
          <div className="bg-white border border-stone-200 rounded-xl p-4 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-sm font-bold text-stone-900 font-serif-sc">
                  Step 4 场景卡列表（5–12张，写满即停）
                </h3>
                <span className={`text-xs px-2 py-0.5 rounded font-mono ${
                  outline.scenes.length >= 5 && outline.scenes.length <= 12
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : 'bg-red-50 text-red-700 border border-red-200'
                }`}>
                  当前: {outline.scenes.length} 张卡 {outline.scenes.length < 5 ? '(太少<5)' : outline.scenes.length > 12 ? '(太多>12)' : '✓合规'}
                </span>
              </div>
              <p className="text-xs text-stone-500 mt-0.5">
                每张卡必须有「状态变化」和「因此/但是」因果连接。严禁纯「然后」流水账。
              </p>
            </div>

            <div className="flex items-center space-x-2 text-xs">
              <div className="bg-stone-100 p-0.5 rounded-lg border border-stone-200 flex">
                <button
                  onClick={() => setSceneViewMode('table')}
                  className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                    sceneViewMode === 'table' ? 'bg-white shadow-xs text-stone-900' : 'text-stone-500'
                  }`}
                >
                  表格视图
                </button>
                <button
                  onClick={() => setSceneViewMode('cards')}
                  className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                    sceneViewMode === 'cards' ? 'bg-white shadow-xs text-stone-900' : 'text-stone-500'
                  }`}
                >
                  卡片视图
                </button>
              </div>

              <button
                onClick={() => {
                  if (outline.scenes.length >= 12) {
                    alert('短篇场景上限为 12 张，超额请合并现有场景');
                    return;
                  }
                  const newCard: SceneCard = {
                    id: 's' + (outline.scenes.length + 1),
                    sceneNumber: outline.scenes.length + 1,
                    actName: '③ 转折 / 二次打击',
                    locationAndTime: '新场景地点 / 时段',
                    whatHappens: '具体发生了什么事件',
                    statusChange: '信息/权力/关系发生了一项改变',
                    causality: '因此...',
                    charactersPresent: '主角',
                    hookOrResolution: '钩子或悬念'
                  };
                  onChangeOutline({ ...outline, scenes: [...outline.scenes, newCard] });
                }}
                className="flex items-center space-x-1 bg-stone-900 text-stone-100 px-3 py-1.5 rounded-lg hover:bg-stone-800"
              >
                <Plus className="w-3.5 h-3.5 text-amber-400" />
                <span>追加场景卡</span>
              </button>
            </div>
          </div>

          {/* Table View */}
          {sceneViewMode === 'table' ? (
            <div className="bg-white border border-stone-200 rounded-xl overflow-x-auto shadow-sm">
              <table className="w-full text-left text-xs border-collapse min-w-[900px]">
                <thead>
                  <tr className="bg-stone-100 border-b border-stone-200 text-stone-700 font-semibold">
                    <th className="p-2.5 w-12 text-center">#</th>
                    <th className="p-2.5 w-24">所属段</th>
                    <th className="p-2.5 w-32">场景(地点/时段)</th>
                    <th className="p-2.5 w-56">发生什么(具体动作)</th>
                    <th className="p-2.5 w-44">状态变化</th>
                    <th className="p-2.5 w-36">因果连接 (因此/但是)</th>
                    <th className="p-2.5 w-28">出场角色</th>
                    <th className="p-2.5 w-40">钩子/收束</th>
                    <th className="p-2.5 w-10"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-200">
                  {outline.scenes.map((scene, idx) => (
                    <tr key={scene.id || idx} className="hover:bg-stone-50/80 transition-colors">
                      <td className="p-2 text-center font-mono font-bold text-stone-500">
                        {idx + 1}
                      </td>
                      <td className="p-2 font-medium text-stone-900">
                        <select
                          value={scene.actName}
                          onChange={(e) => {
                            const next = [...outline.scenes];
                            next[idx].actName = e.target.value;
                            onChangeOutline({ ...outline, scenes: next });
                          }}
                          className="bg-transparent border-b border-transparent hover:border-stone-300 w-full"
                        >
                          <option value="① 钩子">① 钩子</option>
                          <option value="② 冲突建立">② 冲突建立</option>
                          <option value="③ 转折 / 二次打击">③ 转折</option>
                          <option value="④ 高潮">④ 高潮</option>
                          <option value="⑤ 钉子 / 余味">⑤ 余味</option>
                        </select>
                      </td>
                      <td className="p-2">
                        <textarea
                          rows={2}
                          value={scene.locationAndTime}
                          onChange={(e) => {
                            const next = [...outline.scenes];
                            next[idx].locationAndTime = e.target.value;
                            onChangeOutline({ ...outline, scenes: next });
                          }}
                          className="w-full bg-stone-50 border border-stone-200 rounded p-1 text-[11px]"
                        />
                      </td>
                      <td className="p-2">
                        <textarea
                          rows={3}
                          value={scene.whatHappens}
                          onChange={(e) => {
                            const next = [...outline.scenes];
                            next[idx].whatHappens = e.target.value;
                            onChangeOutline({ ...outline, scenes: next });
                          }}
                          className="w-full bg-stone-50 border border-stone-200 rounded p-1 text-[11px]"
                        />
                      </td>
                      <td className="p-2">
                        <textarea
                          rows={2}
                          value={scene.statusChange}
                          onChange={(e) => {
                            const next = [...outline.scenes];
                            next[idx].statusChange = e.target.value;
                            onChangeOutline({ ...outline, scenes: next });
                          }}
                          className="w-full bg-stone-50 border border-stone-200 rounded p-1 text-[11px]"
                        />
                      </td>
                      <td className="p-2">
                        <textarea
                          rows={2}
                          value={scene.causality}
                          onChange={(e) => {
                            const next = [...outline.scenes];
                            next[idx].causality = e.target.value;
                            onChangeOutline({ ...outline, scenes: next });
                          }}
                          className="w-full bg-stone-50 border border-stone-200 rounded p-1 text-[11px] font-mono text-amber-900"
                        />
                      </td>
                      <td className="p-2">
                        <input
                          type="text"
                          value={scene.charactersPresent}
                          onChange={(e) => {
                            const next = [...outline.scenes];
                            next[idx].charactersPresent = e.target.value;
                            onChangeOutline({ ...outline, scenes: next });
                          }}
                          className="w-full bg-stone-50 border border-stone-200 rounded p-1 text-[11px]"
                        />
                      </td>
                      <td className="p-2">
                        <textarea
                          rows={2}
                          value={scene.hookOrResolution}
                          onChange={(e) => {
                            const next = [...outline.scenes];
                            next[idx].hookOrResolution = e.target.value;
                            onChangeOutline({ ...outline, scenes: next });
                          }}
                          className="w-full bg-stone-50 border border-stone-200 rounded p-1 text-[11px]"
                        />
                      </td>
                      <td className="p-2 text-center">
                        <button
                          onClick={() => {
                            const next = outline.scenes.filter((_, i) => i !== idx);
                            onChangeOutline({ ...outline, scenes: next });
                          }}
                          className="text-stone-300 hover:text-red-600"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            /* Cards View */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {outline.scenes.map((scene, idx) => (
                <div key={scene.id || idx} className="bg-white border border-stone-200 rounded-xl p-4 shadow-sm text-xs space-y-2.5">
                  <div className="flex items-center justify-between border-b border-stone-100 pb-2">
                    <span className="font-bold font-serif-sc text-stone-900">
                      场景 #{idx + 1} · {scene.actName}
                    </span>
                    <span className="text-stone-500 font-mono text-[11px]">
                      {scene.locationAndTime}
                    </span>
                  </div>

                  <div>
                    <span className="text-stone-500 font-medium block mb-0.5">发生什么:</span>
                    <p className="text-stone-800 leading-relaxed bg-stone-50 p-2 rounded border border-stone-200/60">
                      {scene.whatHappens}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="p-2 rounded bg-amber-50/60 border border-amber-200/50">
                      <span className="text-amber-900 font-semibold block text-[11px]">状态变化:</span>
                      <p className="text-amber-950 text-[11px] mt-0.5">{scene.statusChange}</p>
                    </div>
                    <div className="p-2 rounded bg-blue-50/60 border border-blue-200/50">
                      <span className="text-blue-900 font-semibold block text-[11px]">因果连接:</span>
                      <p className="text-blue-950 text-[11px] mt-0.5">{scene.causality}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-stone-100 text-[11px] text-stone-500">
                    <span>出场: {scene.charactersPresent}</span>
                    <span className="text-amber-700 truncate max-w-[140px]">{scene.hookOrResolution}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 5. Quality Gates */}
      {activeSubView === 'gates' && (
        <div className="bg-white border border-stone-200 rounded-xl p-5 shadow-sm space-y-4">
          <div className="border-b border-stone-100 pb-3 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-stone-900 font-serif-sc">
                Step 5 质量门报告 ⛔ 不能跳（A/B/C 三类逐条检查）
              </h3>
              <p className="text-xs text-stone-500">
                硬门（A、B全部 + C1/C8/C9）：未过即阻断交付；软门（C2–C7）：需引证据说明。
              </p>
            </div>
            <div className="flex items-center space-x-2 text-xs">
              <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded font-medium">
                通过: {outline.qualityGates.filter(g => g.passed).length}
              </span>
              <span className="px-2.5 py-1 bg-stone-100 text-stone-600 border border-stone-200 rounded font-medium">
                总检查项: {outline.qualityGates.length}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            {outline.qualityGates.map((gate, idx) => (
              <div
                key={gate.code || idx}
                className={`p-3 rounded-lg border flex items-start space-x-2.5 ${
                  gate.passed
                    ? 'bg-stone-50/70 border-stone-200 text-stone-800'
                    : 'bg-red-50/70 border-red-200 text-red-900'
                }`}
              >
                <div className="mt-0.5 shrink-0">
                  {gate.passed ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <XCircle className="w-4 h-4 text-red-600" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono font-bold text-stone-900">{gate.code}</span>
                    <span className="font-semibold">{gate.name}</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-stone-200 text-stone-700">
                      {gate.category}
                    </span>
                  </div>
                  <p className="text-[11px] text-stone-600 mt-1">
                    {gate.description}
                  </p>
                  {gate.notes && (
                    <p className="text-[11px] text-amber-800 bg-amber-50 p-1.5 rounded mt-1.5 border border-amber-200">
                      诊断依据: {gate.notes}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 6. Continuous Ledgers */}
      {activeSubView === 'ledgers' && (
        <div className="space-y-4">
          <div className="bg-white border border-stone-200 rounded-xl p-5 shadow-sm">
            <h3 className="text-sm font-bold text-stone-900 font-serif-sc mb-1">
              C9 连续性台账（正文预防针）
            </h3>
            <p className="text-xs text-stone-500 mb-4">
              正文写到第七节时，你绝记不清第二节写的主角是四十八岁还是四十二岁。大纲阶段建台账是预防，正文阶段改是伤筋动骨。
            </p>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 text-xs">
              {/* Timeline */}
              <div className="bg-stone-50 p-3.5 rounded-lg border border-stone-200">
                <div className="flex items-center space-x-1.5 font-bold text-stone-800 mb-2 font-serif-sc">
                  <Clock className="w-3.5 h-3.5 text-amber-600" />
                  <span>① 时间轴表 (时序单调性)</span>
                </div>
                <div className="space-y-1.5">
                  {outline.ledgers.timeline.map((t, idx) => (
                    <div key={idx} className="bg-white p-2 rounded border border-stone-200 flex justify-between">
                      <span className="font-mono text-stone-700">场次 #{t.scene}</span>
                      <span className="text-amber-800 font-semibold">{t.day} {t.time}</span>
                      <span className="text-stone-500 text-[11px] truncate max-w-[90px]">{t.note}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Numbers */}
              <div className="bg-stone-50 p-3.5 rounded-lg border border-stone-200">
                <div className="flex items-center space-x-1.5 font-bold text-stone-800 mb-2 font-serif-sc">
                  <Hash className="w-3.5 h-3.5 text-amber-600" />
                  <span>② 硬数字台账 (一处一值)</span>
                </div>
                <div className="space-y-1.5">
                  {outline.ledgers.numbers.map((n, idx) => (
                    <div key={idx} className="bg-white p-2 rounded border border-stone-200 flex justify-between">
                      <span className="text-stone-800">{n.item}</span>
                      <span className="font-mono font-bold text-amber-700">{n.value}</span>
                      <span className="text-stone-400 text-[11px]">{n.scenes}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Hooks */}
              <div className="bg-stone-50 p-3.5 rounded-lg border border-stone-200">
                <div className="flex items-center space-x-1.5 font-bold text-stone-800 mb-2 font-serif-sc">
                  <Anchor className="w-3.5 h-3.5 text-amber-600" />
                  <span>③ 钩子欠条表 (写下即欠)</span>
                </div>
                <div className="space-y-1.5">
                  {outline.ledgers.hooks.map((h, idx) => (
                    <div key={idx} className="bg-white p-2 rounded border border-stone-200 space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-stone-900 truncate max-w-[170px]">{h.hook}</span>
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                          {h.status}
                        </span>
                      </div>
                      <div className="text-[11px] text-stone-500 flex justify-between">
                        <span>埋设: {h.plantedScene}</span>
                        <span>兑现: {h.redeemedScene}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
