import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { OutlineStudio } from './components/OutlineStudio';
import { OutlineDiagnosis } from './components/OutlineDiagnosis';
import { YanYanProseStudio } from './components/YanYanProseStudio';
import { AntiAiInspector } from './components/AntiAiInspector';
import { MethodologyGuide } from './components/MethodologyGuide';
import { INITIAL_OUTLINE, INITIAL_LEAD, INITIAL_CHAPTERS, PRESET_IDEAS } from './data/presets';
import { OutlineData, YanYanLead, ChapterSection } from './types';

export function App() {
  const [activeTab, setActiveTab] = useState<'outline' | 'diagnosis' | 'prose' | 'inspector' | 'guide'>('outline');
  const [hasGeminiKey, setHasGeminiKey] = useState<boolean>(false);
  
  // Local state initialized with fallback or local storage
  const [outline, setOutline] = useState<OutlineData>(() => {
    const saved = localStorage.getItem('yanyan_outline_data');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.title && parsed.title !== '超时外卖') {
          return parsed;
        }
      } catch (e) { /* ignore */ }
    }
    return INITIAL_OUTLINE;
  });

  const [leadData, setLeadData] = useState<YanYanLead>(() => {
    const saved = localStorage.getItem('yanyan_lead_data');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.leadText && !parsed.leadText.includes('林周')) {
          return parsed;
        }
      } catch (e) { /* ignore */ }
    }
    return INITIAL_LEAD;
  });

  const [chapters, setChapters] = useState<ChapterSection[]>(() => {
    const saved = localStorage.getItem('yanyan_chapters_data');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0 && !parsed[0].content.includes('林周')) {
          return parsed;
        }
      } catch (e) { /* ignore */ }
    }
    return INITIAL_CHAPTERS;
  });

  const [inspectorText, setInspectorText] = useState<string>('');

  // Check health / gemini key
  useEffect(() => {
    fetch('/api/health')
      .then(res => res.json())
      .then(data => {
        if (data && data.hasGeminiKey) {
          setHasGeminiKey(true);
        }
      })
      .catch(() => {
        // Fallback: local mode
      });
  }, []);

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem('yanyan_outline_data', JSON.stringify(outline));
    } catch (e) { /* ignore */ }
  }, [outline]);

  useEffect(() => {
    try {
      localStorage.setItem('yanyan_lead_data', JSON.stringify(leadData));
    } catch (e) { /* ignore */ }
  }, [leadData]);

  useEffect(() => {
    try {
      localStorage.setItem('yanyan_chapters_data', JSON.stringify(chapters));
    } catch (e) { /* ignore */ }
  }, [chapters]);

  // Load a preset
  const handleLoadPreset = (presetOutline: OutlineData) => {
    setOutline(presetOutline);
    // Find matching lead if any
    const foundPreset = PRESET_IDEAS.find(p => p.fullOutline.title === presetOutline.title);
    if (foundPreset) {
      setLeadData(foundPreset.lead);
      setChapters(foundPreset.chapters);
    }
  };

  // Jump from prose/lead to inspector
  const handleGoToInspector = (text: string) => {
    setInspectorText(text);
    setActiveTab('inspector');
  };

  // Export full story project as Markdown
  const handleExportMarkdown = () => {
    const md = `# 《${outline.title || '无题短篇'}》
形态：${outline.params.form === 'novel' ? '短篇小说' : outline.params.form === 'film' ? '单条短片' : '微短剧'} ｜ 体量：${outline.params.targetLength} ｜ 目标情绪：${outline.params.targetEmotion}
题材：${outline.params.genre} ｜ 叙述视角：${outline.params.pov} ｜ 策略：${outline.params.strategy}

---

## 【第一部分：大纲四件套施工图】

### 1. 一句话锁定 (Logline)
${outline.logline}

### 2. 故事契约
- **主角想要什么 (目标)**：${outline.storyContract.goal}
- **最大阻碍 (冲突)**：${outline.storyContract.obstacle}
- **为什么不能退出 (引擎)**：${outline.storyContract.engine}
- **每轮对抗改变**：${outline.storyContract.changePerRound}
- **最终结果与情绪落点**：${outline.storyContract.finalOutcome}
- **主题**：${outline.storyContract.theme}

### 3. 人设速写 (≤4人)
${outline.characters.map((c, i) => `- **${c.name}**：${c.oneLineBio} ｜ 欲望：${c.desire} ｜ 故事功能：${c.functionInStory}`).join('\n')}

### 4. 骨架五段
${outline.skeleton.map(s => `- **${s.actName}** (${s.percentage})：${s.description} 【检查点：${s.checkpoint}】`).join('\n')}

### 5. 场景卡施工表 (${outline.scenes.length}张)
| # | 所属段 | 场景(地点/时段) | 发生什么(具体动作) | 状态变化 | 因果连接 | 出场角色 | 钩子/收束 |
|---|---|---|---|---|---|---|---|
${outline.scenes.map((sc, i) => `| ${i + 1} | ${sc.actName} | ${sc.locationAndTime} | ${sc.whatHappens} | ${sc.statusChange} | ${sc.causality} | ${sc.charactersPresent} | ${sc.hookOrResolution} |`).join('\n')}

### 6. 贯穿物件
${outline.recurringObjects.map(o => `- **${o.name}**：① ${o.app1} ｜ ② ${o.app2} ｜ ③ ${o.app3}`).join('\n')}

---

## 【第二部分：盐选正文】

### 导语 (一句一段 · 150-220字)
${leadData.leadText}

${chapters.map((ch, i) => `
### 第${i + 1}节：${ch.title}
${ch.content}
`).join('\n')}
`;

    const blob = new Blob([md], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${outline.title || '故事作品'}-完整大纲与正文.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-[#fcfbf9] text-stone-900 flex flex-col selection:bg-amber-200">
      
      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        hasGeminiKey={hasGeminiKey}
        onLoadPreset={handleLoadPreset}
        onExportMarkdown={handleExportMarkdown}
        currentTitle={outline.title}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6">
        {activeTab === 'outline' && (
          <OutlineStudio
            outline={outline}
            onChangeOutline={setOutline}
            onProceedToProse={() => setActiveTab('prose')}
          />
        )}

        {activeTab === 'diagnosis' && (
          <OutlineDiagnosis
            currentOutline={outline}
          />
        )}

        {activeTab === 'prose' && (
          <YanYanProseStudio
            outline={outline}
            leadData={leadData}
            onChangeLead={setLeadData}
            chapters={chapters}
            onChangeChapters={setChapters}
            onGoToInspector={handleGoToInspector}
          />
        )}

        {activeTab === 'inspector' && (
          <AntiAiInspector
            initialText={inspectorText || leadData.leadText}
            onApplyPolishedText={(t) => setInspectorText(t)}
          />
        )}

        {activeTab === 'guide' && (
          <MethodologyGuide />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-stone-200 bg-white py-4 text-center text-xs text-stone-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="font-serif-sc">
            知乎盐选 · 盐言故事短篇小说正文写作 & 短片大纲施工法
          </p>
          <p className="text-[11px] text-stone-400">
            21道质量门 · 四维骨架导语 · 第一人称双轨腔调 · 去AI腔黑名单
          </p>
        </div>
      </footer>

    </div>
  );
}

export default App;
