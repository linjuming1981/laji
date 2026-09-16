import React from 'react';
import { BookOpen, Sparkles, Stethoscope, Feather, ShieldAlert, Download, FileText, CheckCircle2 } from 'lucide-react';
import { PRESET_IDEAS } from '../data/presets';
import { OutlineData } from '../types';

interface NavbarProps {
  activeTab: 'outline' | 'diagnosis' | 'prose' | 'inspector' | 'guide';
  onSelectTab: (tab: 'outline' | 'diagnosis' | 'prose' | 'inspector' | 'guide') => void;
  hasGeminiKey: boolean;
  onLoadPreset: (outline: OutlineData) => void;
  onExportMarkdown: () => void;
  currentTitle: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onSelectTab,
  hasGeminiKey,
  onLoadPreset,
  onExportMarkdown,
  currentTitle
}) => {
  return (
    <header id="main-header" className="sticky top-0 z-40 bg-stone-900 text-stone-100 border-b border-stone-800 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        
        {/* Brand */}
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-lg bg-amber-600 flex items-center justify-center text-white font-serif-sc font-bold text-lg shadow-inner">
            盐
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-base font-semibold tracking-tight text-stone-100 font-serif-sc">
                短篇小说与微短剧创作工坊
              </h1>
              <span className="text-xs px-2 py-0.5 rounded bg-stone-800 text-amber-300 font-mono border border-stone-700">
                v1.0
              </span>
            </div>
            <p className="text-xs text-stone-400 hidden sm:block">
              盐言故事写作Skill · 短片大纲四件套 · 质量门与去AI腔引擎
            </p>
          </div>
        </div>

        {/* Preset & Actions */}
        <div className="flex items-center space-x-3">
          {/* Preset dropdown */}
          <div className="relative inline-block text-left">
            <select
              id="preset-loader-select"
              aria-label="载入范例灵感"
              className="text-xs bg-stone-800 text-stone-300 border border-stone-700 rounded-md px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-amber-500 cursor-pointer"
              onChange={(e) => {
                const found = PRESET_IDEAS.find(p => p.id === e.target.value);
                if (found) onLoadPreset(found.fullOutline);
              }}
              defaultValue=""
            >
              <option value="" disabled>✦ 载入范例预设</option>
              {PRESET_IDEAS.map(p => (
                <option key={p.id} value={p.id}>
                  {p.title} ({p.badge})
                </option>
              ))}
            </select>
          </div>

          {/* Export button */}
          <button
            id="export-markdown-btn"
            onClick={onExportMarkdown}
            className="flex items-center space-x-1.5 text-xs bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700 rounded-md px-3 py-1.5 transition-colors"
            title="导出当前作品为完整 Markdown"
          >
            <Download className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">导出文档</span>
          </button>

          {/* Key status */}
          <div className="flex items-center space-x-1 text-xs px-2.5 py-1 rounded bg-stone-800/80 border border-stone-700 text-stone-400">
            <span className={`w-2 h-2 rounded-full ${hasGeminiKey ? 'bg-emerald-400' : 'bg-amber-400 animate-pulse'}`} />
            <span className="font-mono text-[11px] hidden md:inline">
              {hasGeminiKey ? 'Gemini 3.8 就绪' : '本地规则模式'}
            </span>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-stone-950 border-t border-stone-800/80 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex space-x-1 sm:space-x-2 overflow-x-auto py-1">
          <button
            id="tab-outline-btn"
            onClick={() => onSelectTab('outline')}
            className={`flex items-center space-x-2 px-3 py-2 rounded-md text-xs font-medium transition-all whitespace-nowrap ${
              activeTab === 'outline'
                ? 'bg-amber-600/20 text-amber-300 border border-amber-500/40'
                : 'text-stone-400 hover:text-stone-200 hover:bg-stone-900'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>大纲工坊 (四件套)</span>
          </button>

          <button
            id="tab-diagnosis-btn"
            onClick={() => onSelectTab('diagnosis')}
            className={`flex items-center space-x-2 px-3 py-2 rounded-md text-xs font-medium transition-all whitespace-nowrap ${
              activeTab === 'diagnosis'
                ? 'bg-amber-600/20 text-amber-300 border border-amber-500/40'
                : 'text-stone-400 hover:text-stone-200 hover:bg-stone-900'
            }`}
          >
            <Stethoscope className="w-3.5 h-3.5" />
            <span>大纲体检模式 (质量门)</span>
          </button>

          <button
            id="tab-prose-btn"
            onClick={() => onSelectTab('prose')}
            className={`flex items-center space-x-2 px-3 py-2 rounded-md text-xs font-medium transition-all whitespace-nowrap ${
              activeTab === 'prose'
                ? 'bg-amber-600/20 text-amber-300 border border-amber-500/40'
                : 'text-stone-400 hover:text-stone-200 hover:bg-stone-900'
            }`}
          >
            <Feather className="w-3.5 h-3.5" />
            <span>盐言正文撰写 (知乎体)</span>
          </button>

          <button
            id="tab-inspector-btn"
            onClick={() => onSelectTab('inspector')}
            className={`flex items-center space-x-2 px-3 py-2 rounded-md text-xs font-medium transition-all whitespace-nowrap ${
              activeTab === 'inspector'
                ? 'bg-amber-600/20 text-amber-300 border border-amber-500/40'
                : 'text-stone-400 hover:text-stone-200 hover:bg-stone-900'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>去AI腔 & 连续性审查</span>
          </button>

          <button
            id="tab-guide-btn"
            onClick={() => onSelectTab('guide')}
            className={`flex items-center space-x-2 px-3 py-2 rounded-md text-xs font-medium transition-all whitespace-nowrap ${
              activeTab === 'guide'
                ? 'bg-amber-600/20 text-amber-300 border border-amber-500/40'
                : 'text-stone-400 hover:text-stone-200 hover:bg-stone-900'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>写作心法速查</span>
          </button>
        </div>
      </div>
    </header>
  );
};
