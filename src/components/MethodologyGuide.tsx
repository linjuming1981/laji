import React from 'react';
import { 
  YANYAN_RHYME, 
  YANYAN_CORE_GUIDES, 
  QUALITY_GATES_SPECS 
} from '../data/rulesGuide';
import { Sparkles, ScrollText, CheckCircle2, Bookmark, Flame, ShieldAlert, Award } from 'lucide-react';

export const MethodologyGuide: React.FC = () => {
  return (
    <div id="methodology-guide-root" className="space-y-6">
      
      {/* Shou Ge Rhyme Hero Card */}
      <div className="bg-stone-900 text-stone-100 rounded-xl p-6 shadow-sm border border-stone-800">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <div className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs">
              <ScrollText className="w-3.5 h-3.5" />
              <span>知乎盐选资深编辑口诀</span>
            </div>
            <h2 className="text-xl font-bold font-serif-sc tracking-wide text-amber-100">
              短篇小说创作心法 · 手哥打油诗
            </h2>
            <p className="text-xs text-stone-400 max-w-xl">
              篇幅一到三万字，主线贯穿支线明；通俗流畅口语化，反转悬念紧跟上。通读三遍，牢记在心。
            </p>
          </div>

          <div className="bg-stone-950/80 border border-amber-500/30 p-4 rounded-xl font-serif-sc text-sm sm:text-base leading-loose text-amber-200 text-center tracking-widest shadow-inner">
            {YANYAN_RHYME.split('\n').map((line, idx) => (
              <div key={idx}>{line}</div>
            ))}
          </div>
        </div>
      </div>

      {/* Core Principles Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {YANYAN_CORE_GUIDES.map((guide, idx) => (
          <div key={idx} className="bg-white rounded-xl border border-stone-200 p-5 shadow-sm space-y-3">
            <div className="flex items-center space-x-2 border-b border-stone-100 pb-2">
              <div className="w-6 h-6 rounded-md bg-amber-50 text-amber-800 font-bold text-xs flex items-center justify-center font-mono">
                0{idx + 1}
              </div>
              <h3 className="font-bold text-stone-900 font-serif-sc text-sm">
                {guide.title}
              </h3>
            </div>
            <ul className="space-y-1.5 text-xs text-stone-600 leading-relaxed">
              {guide.points.map((pt, pIdx) => (
                <li key={pIdx} className="flex items-start space-x-1.5">
                  <span className="text-amber-600 mt-1">•</span>
                  <span>{pt}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* 21 Quality Gates Comprehensive Reference */}
      <div className="bg-white rounded-xl border border-stone-200 p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-stone-100 pb-3">
          <div>
            <div className="flex items-center space-x-2">
              <div className="p-1.5 rounded-lg bg-amber-50 text-amber-700">
                <Award className="w-4 h-4" />
              </div>
              <h3 className="text-base font-bold text-stone-900 font-serif-sc">
                21 道质量门全景速查（A类结构门 · B类因果门 · C类兑现门）
              </h3>
            </div>
            <p className="text-xs text-stone-500 mt-1">
              硬门未过即阻断交付；软门需引证据说明。大纲阶段拦截90%烂尾与空转。
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
          {QUALITY_GATES_SPECS.map((gate) => (
            <div key={gate.code} className="p-3 rounded-lg bg-stone-50 border border-stone-200 space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-amber-900">{gate.code}</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-stone-200 text-stone-700">
                  {gate.cat}
                </span>
              </div>
              <div className="font-semibold text-stone-900 font-serif-sc">
                {gate.name}
              </div>
              <p className="text-[11px] text-stone-600 leading-normal">
                {gate.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Submission Roadmap & Channel Knowledge */}
      <div className="bg-stone-50 border border-stone-200 rounded-xl p-5 text-xs text-stone-700 space-y-3">
        <h3 className="font-bold text-stone-900 font-serif-sc text-sm flex items-center space-x-2">
          <Bookmark className="w-4 h-4 text-amber-600" />
          <span>知乎盐选专栏投稿通道与过稿潜规则</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-[11px] leading-relaxed">
          <div className="p-3 bg-white rounded-lg border border-stone-200">
            <strong className="text-stone-900 block mb-1">篇幅字数底线</strong>
            短篇单篇字数通常在 <strong>8000–15000 字</strong>。少于 6000 字基本无法成单本；前 2000 字为免费试读，必须出现首轮打脸或极致悬念反转。
          </div>
          <div className="p-3 bg-white rounded-lg border border-stone-200">
            <strong className="text-stone-900 block mb-1">知乎回答「挂卡绿通」</strong>
            最容易被编辑主动签约的方式：寻找高关注话题（如「有哪些反转到让你头皮发麻的故事？」「你在婚姻里发现过什么秘密？」），以回答形式发布导语+前两节，留白挂钩子，引发催更直接对接责编。
          </div>
          <div className="p-3 bg-white rounded-lg border border-stone-200">
            <strong className="text-stone-900 block mb-1">标题起名三要素</strong>
            知乎故事标题拒绝传统纯文艺抒情，必须包含「具体身份 + 意外举动 + 情感悬念」（例如：《我给前夫随了八毛钱白包后》《得知合伙人偷改配方那天，我买了一吨面粉》）。
          </div>
        </div>
      </div>

    </div>
  );
};
