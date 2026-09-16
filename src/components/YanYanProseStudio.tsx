import React, { useState } from 'react';
import { 
  OutlineData, 
  YanYanLead, 
  ChapterSection 
} from '../types';
import { 
  Feather, 
  Sparkles, 
  Loader2, 
  Copy, 
  Check, 
  ShieldCheck, 
  SplitSquareVertical, 
  Zap, 
  HelpCircle,
  Clock,
  ArrowRight,
  AlertTriangle
} from 'lucide-react';

interface YanYanProseStudioProps {
  outline: OutlineData;
  leadData: YanYanLead;
  onChangeLead: (lead: YanYanLead) => void;
  chapters: ChapterSection[];
  onChangeChapters: (chaps: ChapterSection[]) => void;
  onGoToInspector: (text: string) => void;
}

export const YanYanProseStudio: React.FC<YanYanProseStudioProps> = ({
  outline,
  leadData,
  onChangeLead,
  chapters,
  onChangeChapters,
  onGoToInspector
}) => {
  const [activeTab, setActiveTab] = useState<'lead' | 'chapter'>('lead');
  const [selectedSceneIndex, setSelectedSceneIndex] = useState<number>(0);
  const [isGeneratingLead, setIsGeneratingLead] = useState(false);
  const [isGeneratingProse, setIsGeneratingProse] = useState(false);
  const [hasHeartbreakSwitch, setHasHeartbreakSwitch] = useState(false);
  const [isPaywallCutoff, setIsPaywallCutoff] = useState(false);
  const [copiedSection, setCopiedSection] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Lead character count
  const leadCharCount = leadData.leadText.replace(/\s+/g, '').length;

  const handleGenerateLead = async () => {
    setIsGeneratingLead(true);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/generate-lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          logline: outline.logline,
          contract: outline.storyContract,
          firstScene: outline.scenes[0] || {},
          styleNotes: `${outline.params.genre}题材，目标情绪：${outline.params.targetEmotion}`
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || '生成导语失败');

      onChangeLead(data);
    } catch (err: any) {
      setErrorMsg(err.message || '生成导语异常');
    } finally {
      setIsGeneratingLead(false);
    }
  };

  const handleGenerateChapterProse = async () => {
    const scene = outline.scenes[selectedSceneIndex];
    if (!scene) {
      setErrorMsg('请选择有效的场景');
      return;
    }

    setIsGeneratingProse(true);
    setErrorMsg(null);

    const prevContent = chapters.length > 0 ? chapters[chapters.length - 1].content : leadData.leadText;

    try {
      const res = await fetch('/api/generate-prose', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          outlineContext: {
            title: outline.title,
            logline: outline.logline,
            storyContract: outline.storyContract,
            characters: outline.characters
          },
          currentScene: scene,
          previousText: prevContent,
          hasHeartbreakSwitch,
          isPaywallScene: isPaywallCutoff
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || '正文生成失败');

      // Add or update chapter section
      const existingIdx = chapters.findIndex(c => c.sectionNumber === selectedSceneIndex + 1);
      const newSection: ChapterSection = {
        id: 'sec_' + (selectedSceneIndex + 1),
        sectionNumber: selectedSceneIndex + 1,
        title: `${scene.actName} · ${scene.locationAndTime}`,
        sceneRefIds: [scene.id],
        content: data.content,
        wordCount: data.wordCount,
        hasHeartbreakSwitch,
        hasPaywallCutoff: isPaywallCutoff
      };

      if (existingIdx >= 0) {
        const updated = [...chapters];
        updated[existingIdx] = newSection;
        onChangeChapters(updated);
      } else {
        onChangeChapters([...chapters, newSection]);
      }
    } catch (err: any) {
      setErrorMsg(err.message || '生成正文异常');
    } finally {
      setIsGeneratingProse(false);
    }
  };

  const handleCopy = (text: string, tag: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(tag);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  return (
    <div id="yanyan-prose-studio-root" className="space-y-6">
      
      {/* Top Banner with Tabs */}
      <div className="bg-white rounded-xl border border-stone-200 p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-100 pb-4 mb-4">
          <div>
            <div className="flex items-center space-x-2">
              <div className="p-1.5 rounded-lg bg-amber-50 text-amber-700">
                <Feather className="w-5 h-5" />
              </div>
              <h2 className="text-lg font-bold text-stone-900 font-serif-sc">
                盐言故事正文创作（知乎体落纸）
              </h2>
            </div>
            <p className="text-xs text-stone-500 mt-1">
              情绪宁烈不温 · 第一人称在场叙述 · 「」对话与权力博弈 · 情绪外化接具体物件 · 严禁「……」「——」
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setActiveTab('lead')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'lead'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              ① 导语打磨器 (150–220字)
            </button>
            <button
              onClick={() => setActiveTab('chapter')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'chapter'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              ② 逐节正文撰写 ({chapters.length}节已写)
            </button>
          </div>
        </div>

        {errorMsg && (
          <div className="mb-3 p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-700 flex items-center space-x-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* TAB 1: Lead */}
        {activeTab === 'lead' && (
          <div className="space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-amber-50/50 p-4 rounded-xl border border-amber-200/60">
              <div>
                <span className="font-bold text-amber-950 text-xs font-serif-sc block">
                  导语四维骨架 + 黄金三角心法
                </span>
                <p className="text-[11px] text-amber-800 mt-0.5">
                  编辑一天审数百篇，导语决定生死。一句一段，必须包含不可替代具体物件、信息差与留白钩子，严禁纯惨！
                </p>
              </div>

              <button
                id="generate-lead-btn"
                onClick={handleGenerateLead}
                disabled={isGeneratingLead}
                className="flex items-center space-x-1.5 bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white px-3.5 py-2 rounded-lg text-xs font-medium shrink-0 transition-all shadow-xs"
              >
                {isGeneratingLead ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>打磨中...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>基于大纲生成 / 刷新导语</span>
                  </>
                )}
              </button>
            </div>

            {/* Lead Breakdown Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 bg-stone-50 rounded-lg border border-stone-200">
                <span className="font-bold text-stone-700 block mb-1">
                  1. 起因与核心冲突
                </span>
                <p className="text-stone-800 text-[11px] leading-relaxed">
                  {leadData.cause ? `${leadData.cause} ｜ ${leadData.conflict}` : '一击即中的悲剧源头与不可退步的绝境。'}
                </p>
              </div>

              <div className="p-3 bg-stone-50 rounded-lg border border-stone-200">
                <span className="font-bold text-stone-700 block mb-1">
                  2. 人设底色与具体物件 (黄金三角)
                </span>
                <p className="text-stone-800 text-[11px] leading-relaxed">
                  {leadData.personaBottom ? `${leadData.personaBottom} (物件: ${leadData.specificObject})` : '清醒有后手，不是纯惨；附带可截图物件。'}
                </p>
              </div>

              <div className="p-3 bg-stone-50 rounded-lg border border-stone-200">
                <span className="font-bold text-stone-700 block mb-1">
                  3. 信息差与留白钩子
                </span>
                <p className="text-stone-800 text-[11px] leading-relaxed">
                  {leadData.informationGap ? `${leadData.informationGap} ｜ 钩子: ${leadData.reversalHook}` : '读者知道而施害者不知的致命底牌。'}
                </p>
              </div>
            </div>

            {/* Lead Text Area */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center space-x-2">
                  <label className="text-xs font-bold text-stone-900 font-serif-sc">
                    导语正文（一句一段 · 纯正知乎体）
                  </label>
                  <span className={`text-xs px-2 py-0.2 rounded font-mono ${
                    leadCharCount >= 150 && leadCharCount <= 220
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold'
                      : 'bg-amber-50 text-amber-800 border border-amber-200'
                  }`}>
                    字数: {leadCharCount} 字 {leadCharCount >= 150 && leadCharCount <= 220 ? '(✓黄金区间150–220)' : '(建议150–220字)'}
                  </span>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleCopy(leadData.leadText, 'lead')}
                    className="flex items-center space-x-1 text-xs text-stone-600 hover:text-stone-900 px-2 py-1 rounded bg-stone-100"
                  >
                    {copiedSection === 'lead' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedSection === 'lead' ? '已复制' : '复制导语'}</span>
                  </button>
                  <button
                    onClick={() => onGoToInspector(leadData.leadText)}
                    className="flex items-center space-x-1 text-xs text-amber-700 hover:text-amber-900 px-2 py-1 rounded bg-amber-50 border border-amber-200"
                  >
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>去AI腔审查</span>
                  </button>
                </div>
              </div>

              <textarea
                id="lead-text-input"
                rows={6}
                value={leadData.leadText}
                onChange={(e) => onChangeLead({ ...leadData, leadText: e.target.value })}
                className="w-full bg-stone-50 border border-stone-200 rounded-xl p-4 text-xs sm:text-sm leading-loose text-stone-900 font-serif-sc focus:ring-2 focus:ring-amber-500 shadow-inner"
              />
            </div>
          </div>
        )}

        {/* TAB 2: Chapter Prose */}
        {activeTab === 'chapter' && (
          <div className="space-y-5">
            {/* Scene Selector and Controls */}
            <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 text-xs space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center space-x-2">
                  <label className="font-bold text-stone-800">
                    选择对应场景施工图:
                  </label>
                  <select
                    aria-label="选择场景施工图"
                    value={selectedSceneIndex}
                    onChange={(e) => setSelectedSceneIndex(Number(e.target.value))}
                    className="bg-white border border-stone-200 rounded-lg p-1.5 font-medium text-stone-800"
                  >
                    {outline.scenes.map((sc, i) => (
                      <option key={sc.id || i} value={i}>
                        第 {i + 1} 场 · {sc.actName} ({sc.locationAndTime})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center space-x-3">
                  <label className="flex items-center space-x-1.5 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={hasHeartbreakSwitch}
                      onChange={(e) => setHasHeartbreakSwitch(e.target.checked)}
                      className="rounded text-amber-600 focus:ring-amber-500"
                    />
                    <span className="text-stone-700 font-medium">心死定格句</span>
                  </label>

                  <label className="flex items-center space-x-1.5 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={isPaywallCutoff}
                      onChange={(e) => setIsPaywallCutoff(e.target.checked)}
                      className="rounded text-amber-600 focus:ring-amber-500"
                    />
                    <span className="text-stone-700 font-medium">付费点卡位</span>
                  </label>

                  <button
                    id="generate-chapter-prose-btn"
                    onClick={handleGenerateChapterProse}
                    disabled={isGeneratingProse}
                    className="flex items-center space-x-1.5 bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white px-3.5 py-1.5 rounded-lg font-medium shadow-xs transition-all"
                  >
                    {isGeneratingProse ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>写稿中...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>AI 写本节正文</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Selected Scene Context Box */}
              {outline.scenes[selectedSceneIndex] && (
                <div className="p-2.5 bg-white rounded-lg border border-stone-200/80 text-[11px] text-stone-600 grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <div>
                    <strong className="text-stone-800">事件: </strong>
                    {outline.scenes[selectedSceneIndex].whatHappens}
                  </div>
                  <div>
                    <strong className="text-stone-800">状态变动: </strong>
                    {outline.scenes[selectedSceneIndex].statusChange}
                  </div>
                  <div>
                    <strong className="text-stone-800">因果与钩子: </strong>
                    {outline.scenes[selectedSceneIndex].causality} ｜ {outline.scenes[selectedSceneIndex].hookOrResolution}
                  </div>
                </div>
              )}
            </div>

            {/* Existing Chapters List & Editor */}
            <div className="space-y-4">
              {chapters.length === 0 ? (
                <div className="text-center py-12 border-2 border-dashed border-stone-200 rounded-xl">
                  <Feather className="w-8 h-8 text-stone-300 mx-auto mb-2" />
                  <p className="text-xs text-stone-500">
                    尚未撰写章节正文。点击上方「AI 写本节正文」或在此输入第一场正文。
                  </p>
                </div>
              ) : (
                chapters.map((chap, idx) => (
                  <div key={chap.id || idx} className="bg-stone-50/70 border border-stone-200 rounded-xl p-4 shadow-sm space-y-2.5">
                    <div className="flex items-center justify-between border-b border-stone-200/60 pb-2">
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-stone-900 font-serif-sc text-sm">
                          {chap.sectionNumber}. {chap.title}
                        </span>
                        <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-white border border-stone-200 text-stone-600">
                          {chap.wordCount} 字
                        </span>
                        {chap.hasHeartbreakSwitch && (
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-rose-50 text-rose-700 border border-rose-200">
                            已含心死定格句
                          </span>
                        )}
                        {chap.hasPaywallCutoff && (
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-100 text-amber-800 border border-amber-300 font-semibold">
                            付费点卡脖子断点
                          </span>
                        )}
                      </div>

                      <div className="flex items-center space-x-2 text-xs">
                        <button
                          onClick={() => handleCopy(chap.content, chap.id)}
                          className="flex items-center space-x-1 text-stone-600 hover:text-stone-900 px-2 py-1 rounded bg-white border border-stone-200"
                        >
                          {copiedSection === chap.id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                          <span>{copiedSection === chap.id ? '已复制' : '复制'}</span>
                        </button>
                        <button
                          onClick={() => onGoToInspector(chap.content)}
                          className="flex items-center space-x-1 text-amber-700 hover:text-amber-900 px-2.5 py-1 rounded bg-amber-50 border border-amber-200"
                        >
                          <ShieldCheck className="w-3.5 h-3.5" />
                          <span>去AI腔自查</span>
                        </button>
                      </div>
                    </div>

                    <textarea
                      rows={8}
                      value={chap.content}
                      onChange={(e) => {
                        const next = [...chapters];
                        next[idx].content = e.target.value;
                        next[idx].wordCount = e.target.value.replace(/\s+/g, '').length;
                        onChangeChapters(next);
                      }}
                      className="w-full bg-white border border-stone-200 rounded-lg p-3 text-xs sm:text-sm leading-relaxed text-stone-800 font-serif-sc focus:ring-1 focus:ring-amber-500"
                    />
                  </div>
                ))
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
