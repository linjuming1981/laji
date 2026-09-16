import React, { useState, useEffect } from 'react';
import { runProseAudit, autoSanitizeText } from '../utils/auditUtils';
import { AuditMetric } from '../types';
import { 
  ShieldAlert, 
  CheckCircle2, 
  AlertTriangle, 
  Wand2, 
  Sparkles, 
  Loader2, 
  Copy, 
  Check, 
  Flame, 
  Search,
  CheckCheck
} from 'lucide-react';

interface AntiAiInspectorProps {
  initialText?: string;
  onApplyPolishedText?: (text: string) => void;
}

export const AntiAiInspector: React.FC<AntiAiInspectorProps> = ({
  initialText = '',
  onApplyPolishedText
}) => {
  const [textToInspect, setTextToInspect] = useState(initialText);
  const [auditResult, setAuditResult] = useState<AuditMetric>(() => runProseAudit(initialText));
  const [isPolishing, setIsPolishing] = useState(false);
  const [polishMessage, setPolishMessage] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (initialText) {
      setTextToInspect(initialText);
      setAuditResult(runProseAudit(initialText));
    }
  }, [initialText]);

  const handleTextChange = (val: string) => {
    setTextToInspect(val);
    setAuditResult(runProseAudit(val));
  };

  const handleQuickSanitize = () => {
    const sanitized = autoSanitizeText(textToInspect);
    handleTextChange(sanitized);
    setPolishMessage('已自动完成标点规范清洗、引号替换为「」与常见比喻降维！');
    setTimeout(() => setPolishMessage(null), 3000);
  };

  const handleAiPolish = async () => {
    if (!textToInspect.trim()) return;

    setIsPolishing(true);
    setPolishMessage(null);

    try {
      const flagged = [
        ...auditResult.bannedMetaphors.map(m => `禁用比喻: ${m.word}`),
        ...auditResult.bannedPunctuation.map(p => `违规标点: ${p.mark}`),
        ...(auditResult.quotationCheck.doubleQuotesCount > 0 ? ['包含双引号，需全部替换为「」独立成行'] : [])
      ];

      const res = await fetch('/api/rewrite-ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          originalText: textToInspect,
          flaggedIssues: flagged
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'AI润色失败');

      if (data.polishedText) {
        handleTextChange(data.polishedText);
        setPolishMessage('AI 润色精修完成！已强化身体物件触感与短句节奏。');
      }
    } catch (err: any) {
      setPolishMessage('润色异常: ' + err.message);
    } finally {
      setIsPolishing(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(textToInspect);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const totalViolations = 
    auditResult.bannedMetaphors.reduce((acc, b) => acc + b.count, 0) +
    auditResult.bannedPunctuation.reduce((acc, p) => acc + p.count, 0) +
    auditResult.quotationCheck.doubleQuotesCount;

  return (
    <div id="anti-ai-inspector-root" className="space-y-6">
      
      {/* Header */}
      <div className="bg-white rounded-xl border border-stone-200 p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-100 pb-4 mb-4">
          <div>
            <div className="flex items-center space-x-2">
              <div className="p-1.5 rounded-lg bg-amber-50 text-amber-700">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <h2 className="text-lg font-bold text-stone-900 font-serif-sc">
                去 AI 腔与格式连续性审查台
              </h2>
            </div>
            <p className="text-xs text-stone-500 mt-1">
              黑名单逐条扫描 · 标点红线拦截 · 「」对话体与双引号转换 · 身体部位与「像」频次监控
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <button
              id="quick-sanitize-btn"
              onClick={handleQuickSanitize}
              className="flex items-center space-x-1.5 text-xs bg-stone-100 hover:bg-stone-200 text-stone-700 px-3 py-2 rounded-lg font-medium transition-colors"
            >
              <Wand2 className="w-3.5 h-3.5 text-amber-600" />
              <span>一键规则清洗 (标点+引号)</span>
            </button>

            <button
              id="ai-polish-btn"
              onClick={handleAiPolish}
              disabled={isPolishing}
              className="flex items-center space-x-1.5 text-xs bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white px-3.5 py-2 rounded-lg font-medium transition-all shadow-xs"
            >
              {isPolishing ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>AI润色精修中...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>AI 去AI腔润色重写</span>
                </>
              )}
            </button>

            <button
              id="copy-text-btn"
              onClick={handleCopy}
              className="flex items-center space-x-1 text-xs bg-stone-900 text-stone-100 px-3 py-2 rounded-lg font-medium hover:bg-stone-800 transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? '已复制' : '复制文本'}</span>
            </button>
          </div>
        </div>

        {polishMessage && (
          <div className="mb-4 p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{polishMessage}</span>
          </div>
        )}

        {/* Real-time Metric Cards Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3 mb-4 text-xs">
          <div className={`p-3 rounded-lg border ${
            totalViolations === 0
              ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900'
              : 'bg-red-50/70 border-red-200 text-red-900'
          }`}>
            <span className="text-[11px] font-medium block text-stone-500">硬违规总计</span>
            <div className="flex items-center space-x-1 mt-1">
              {totalViolations === 0 ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <AlertTriangle className="w-4 h-4 text-red-600" />}
              <span className="text-base font-bold font-mono">{totalViolations} 处</span>
            </div>
          </div>

          <div className="p-3 bg-stone-50 rounded-lg border border-stone-200 text-stone-700">
            <span className="text-[11px] font-medium block text-stone-500">统计字数</span>
            <span className="text-base font-bold font-mono text-stone-900 mt-1 block">
              {auditResult.wordCount}
            </span>
          </div>

          <div className={`p-3 rounded-lg border ${
            auditResult.quotationCheck.doubleQuotesCount === 0
              ? 'bg-stone-50 border-stone-200 text-stone-700'
              : 'bg-amber-50 border-amber-200 text-amber-900'
          }`}>
            <span className="text-[11px] font-medium block text-stone-500">对话引号规范</span>
            <div className="mt-1 font-mono text-xs">
              <span>「」: {auditResult.quotationCheck.standardBracketsCount} </span>
              {auditResult.quotationCheck.doubleQuotesCount > 0 && (
                <span className="text-red-600 font-bold ml-1">
                  (双引号 {auditResult.quotationCheck.doubleQuotesCount} 处需改)
                </span>
              )}
            </div>
          </div>

          <div className={`p-3 rounded-lg border ${
            auditResult.simileCounts <= 10
              ? 'bg-stone-50 border-stone-200 text-stone-700'
              : 'bg-amber-50 border-amber-200 text-amber-900'
          }`}>
            <span className="text-[11px] font-medium block text-stone-500">「像/像是」频次</span>
            <span className="text-base font-bold font-mono mt-1 block">
              {auditResult.simileCounts} / ≤10上限
            </span>
          </div>

          <div className="p-3 bg-stone-50 rounded-lg border border-stone-200 text-stone-700">
            <span className="text-[11px] font-medium block text-stone-500">段落行数</span>
            <span className="text-base font-bold font-mono text-stone-900 mt-1 block">
              {auditResult.paragraphCount} 段
            </span>
          </div>

          <div className="p-3 bg-stone-50 rounded-lg border border-stone-200 text-stone-700">
            <span className="text-[11px] font-medium block text-stone-500">元信息违规 (第N章等)</span>
            <span className="text-base font-bold font-mono text-stone-900 mt-1 block">
              {auditResult.metaWords.length === 0 ? '0 ✓' : `${auditResult.metaWords.length} 处`}
            </span>
          </div>
        </div>

        {/* Text Area */}
        <textarea
          id="inspector-text-textarea"
          rows={12}
          value={textToInspect}
          onChange={(e) => handleTextChange(e.target.value)}
          placeholder="在此粘贴或输入需要自查与去AI腔的小说正文段落..."
          className="w-full bg-stone-50 border border-stone-200 rounded-xl p-4 text-xs sm:text-sm leading-relaxed text-stone-900 font-serif-sc focus:ring-1 focus:ring-amber-500 shadow-inner"
        />
      </div>

      {/* Violation Details Panels */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        
        {/* 1. Banned Metaphors */}
        <div className="bg-white rounded-xl border border-stone-200 p-4 shadow-sm space-y-3">
          <div className="flex items-center justify-between border-b border-stone-100 pb-2">
            <div className="flex items-center space-x-1.5 font-bold text-stone-900 font-serif-sc">
              <Flame className="w-4 h-4 text-red-500" />
              <span>禁用比喻黑名单雷达</span>
            </div>
            <span className="text-stone-500 font-mono text-[11px]">
              命中: {auditResult.bannedMetaphors.length} 类
            </span>
          </div>

          {auditResult.bannedMetaphors.length === 0 ? (
            <p className="text-emerald-700 bg-emerald-50 p-2.5 rounded-lg border border-emerald-200 flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>非常棒！未检出任何「命运的齿轮」「心猛地一沉」等禁用比喻。</span>
            </p>
          ) : (
            <div className="space-y-2">
              {auditResult.bannedMetaphors.map((item, idx) => (
                <div key={idx} className="p-2.5 rounded-lg bg-red-50/70 border border-red-200 text-red-900 flex items-center justify-between">
                  <div>
                    <strong className="font-bold">{item.word}</strong>
                    <span className="text-[11px] text-red-700 ml-2">
                      出现 {item.count} 次 (第 {item.lines.join(', ')} 行)
                    </span>
                  </div>
                  <span className="text-[10px] bg-white px-2 py-0.5 rounded border border-red-200 text-red-800">
                    必须替换为具体物件
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 2. Punctuation Redlines */}
        <div className="bg-white rounded-xl border border-stone-200 p-4 shadow-sm space-y-3">
          <div className="flex items-center justify-between border-b border-stone-100 pb-2">
            <div className="flex items-center space-x-1.5 font-bold text-stone-900 font-serif-sc">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              <span>标点红线拦截 (严禁 …… / —— / !!!)</span>
            </div>
            <span className="text-stone-500 font-mono text-[11px]">
              违规: {auditResult.bannedPunctuation.length} 项
            </span>
          </div>

          {auditResult.bannedPunctuation.length === 0 ? (
            <p className="text-emerald-700 bg-emerald-50 p-2.5 rounded-lg border border-emerald-200 flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>标点合规！正文无省略号、破折号或多重叹号，停顿由动作beat承担。</span>
            </p>
          ) : (
            <div className="space-y-2">
              {auditResult.bannedPunctuation.map((item, idx) => (
                <div key={idx} className="p-2.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 flex items-center justify-between">
                  <div>
                    <strong className="font-mono bg-white px-1.5 py-0.5 rounded border border-amber-300 mr-2">
                      {item.mark}
                    </strong>
                    <span className="text-[11px]">
                      违规 {item.count} 次 (第 {item.lines.join(', ')} 行)
                    </span>
                  </div>
                  <span className="text-[10px] text-amber-800">
                    改用逗号短句或动作停顿
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 3. Body Parts Frequency */}
        <div className="bg-white rounded-xl border border-stone-200 p-4 shadow-sm space-y-3">
          <div className="flex items-center justify-between border-b border-stone-100 pb-2">
            <span className="font-bold text-stone-900 font-serif-sc">
              身体部位描写频次 (全文单一五官 ≤ 5 次)
            </span>
            <span className="text-stone-400 text-[11px]">防机械重复</span>
          </div>

          <div className="grid grid-cols-4 gap-2">
            {Object.entries(auditResult.bodyPartCounts).map(([part, count]) => (
              <div key={part} className={`p-2 rounded border text-center ${
                count > 5 ? 'bg-red-50 border-red-200 text-red-900 font-bold' : 'bg-stone-50 border-stone-200 text-stone-700'
              }`}>
                <span className="text-[11px] block">{part}</span>
                <span className="font-mono text-sm">{count} 次</span>
              </div>
            ))}
          </div>
        </div>

        {/* 4. Habitual Words */}
        <div className="bg-white rounded-xl border border-stone-200 p-4 shadow-sm space-y-3">
          <div className="flex items-center justify-between border-b border-stone-100 pb-2">
            <span className="font-bold text-stone-900 font-serif-sc">
              口头禅高频词扫描 (全文 ≤ 10 次)
            </span>
            <span className="text-stone-400 text-[11px]">口头禅非母题</span>
          </div>

          <div className="grid grid-cols-4 gap-2">
            {Object.entries(auditResult.habitualWords).map(([word, count]) => (
              <div key={word} className={`p-2 rounded border text-center ${
                count > 10 ? 'bg-amber-50 border-amber-200 text-amber-900 font-bold' : 'bg-stone-50 border-stone-200 text-stone-700'
              }`}>
                <span className="text-[11px] block">{word}</span>
                <span className="font-mono text-sm">{count} 次</span>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
