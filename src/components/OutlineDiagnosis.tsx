import React, { useState } from 'react';
import { Stethoscope, CheckCircle2, XCircle, AlertTriangle, ArrowRight, Loader2, Clipboard, Sparkles } from 'lucide-react';
import { OutlineData } from '../types';

interface OutlineDiagnosisProps {
  currentOutline: OutlineData;
  onApplyDiagnosis?: (fixedOutline: any) => void;
}

export const OutlineDiagnosis: React.FC<OutlineDiagnosisProps> = ({ currentOutline }) => {
  const [outlineInput, setOutlineInput] = useState('');
  const [isDiagnosing, setIsDiagnosing] = useState(false);
  const [diagnosisResult, setDiagnosisResult] = useState<any | null>(null);
  const [diagError, setDiagError] = useState<string | null>(null);

  const handleLoadCurrentOutline = () => {
    const formatted = `# ${currentOutline.title}
一句话: ${outline.logline || currentOutline.logline}
形态: ${currentOutline.params.form} (${currentOutline.params.targetLength}) ｜ 目标情绪: ${currentOutline.params.targetEmotion}

## 故事契约
- 目标: ${currentOutline.storyContract.goal}
- 阻碍: ${currentOutline.storyContract.obstacle}
- 退出引擎: ${currentOutline.storyContract.engine}
- 改变: ${currentOutline.storyContract.changePerRound}
- 结果: ${currentOutline.storyContract.finalOutcome}

## 骨架五段
${currentOutline.skeleton.map(s => `${s.actName} (${s.percentage}): ${s.description}`).join('\n')}

## 场景卡列表
${currentOutline.scenes.map((sc, i) => `#${i + 1} [${sc.actName}] ${sc.locationAndTime} | 发生: ${sc.whatHappens} | 状态变化: ${sc.statusChange} | 因果: ${sc.causality}`).join('\n')}
`;
    setOutlineInput(formatted);
  };

  const outline = currentOutline;

  const handleRunDiagnosis = async () => {
    if (!outlineInput.trim()) {
      setDiagError('请先粘贴或载入需要体检的大纲文本');
      return;
    }

    setIsDiagnosing(true);
    setDiagError(null);

    try {
      const res = await fetch('/api/diagnose-outline', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ outlineText: outlineInput })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || '体检诊断失败');
      }

      setDiagnosisResult(data);
    } catch (err: any) {
      setDiagError(err.message || '网络或服务异常');
    } finally {
      setIsDiagnosing(false);
    }
  };

  return (
    <div id="outline-diagnosis-root" className="space-y-6">
      <div className="bg-white rounded-xl border border-stone-200 p-5 sm:p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 pb-4 mb-4">
          <div>
            <div className="flex items-center space-x-2">
              <div className="p-1.5 rounded-lg bg-amber-50 text-amber-700">
                <Stethoscope className="w-5 h-5" />
              </div>
              <h2 className="text-lg font-bold text-stone-900 font-serif-sc">
                大纲体检模式（质量门诊断书）
              </h2>
            </div>
            <p className="text-xs text-stone-500 mt-1">
              贴一份现成大纲进来，只跑 21 道质量门与叙述策略冲突自查，输出：病灶 + 证据 + 最小修复动作。不擅自脑补重写。
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <button
              id="load-studio-outline-btn"
              onClick={handleLoadCurrentOutline}
              className="text-xs bg-stone-100 hover:bg-stone-200 text-stone-700 px-3 py-2 rounded-lg font-medium transition-colors"
            >
              载入大纲工坊当前内容
            </button>
            <button
              id="start-diagnosis-btn"
              onClick={handleRunDiagnosis}
              disabled={isDiagnosing}
              className="flex items-center space-x-2 bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white px-4 py-2 rounded-lg text-xs font-medium shadow-sm transition-all"
            >
              {isDiagnosing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>质量门排查中...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>执行 21 道门深度体检</span>
                </>
              )}
            </button>
          </div>
        </div>

        {diagError && (
          <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-700 flex items-center space-x-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{diagError}</span>
          </div>
        )}

        <textarea
          id="diagnosis-input-textarea"
          rows={7}
          value={outlineInput}
          onChange={(e) => setOutlineInput(e.target.value)}
          placeholder="在此粘贴任意已有故事大纲（包含一句话、故事契约、五段骨架或场景卡）..."
          className="w-full bg-stone-50 border border-stone-200 rounded-lg p-3 text-xs leading-relaxed text-stone-800 font-mono focus:ring-1 focus:ring-amber-500"
        />

        {/* Narrative Strategy check banner */}
        <div className="mt-3 p-3 bg-amber-50/60 rounded-lg border border-amber-200/70 text-xs text-amber-950">
          <span className="font-bold font-serif-sc block mb-1">
            ⚠ 叙述策略冲突三问（整份大纲重写的最大杀手）：
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px] text-amber-900">
            <div>1. 大纲要求叙述者对读者隐瞒他自己知道的事实吗？</div>
            <div>2. 目标形态是第一人称吗？</div>
            <div>3. 目标平台的正文引擎是内心独白吗？</div>
          </div>
          <p className="text-[11px] text-amber-800 mt-1">
            三个都是 = 阻断级冲突！第一人称无法全程说谎，务必改为「戏剧性反讽（读者交底）」以保持持续张力。
          </p>
        </div>
      </div>

      {/* Diagnosis Report Results */}
      {diagnosisResult && (
        <div className="bg-white rounded-xl border border-stone-200 p-5 sm:p-6 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 pb-4">
            <div>
              <h3 className="text-base font-bold text-stone-900 font-serif-sc">
                诊断结论报告单
              </h3>
              <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                {diagnosisResult.summary}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <span className="px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold">
                ✓ 通过: {diagnosisResult.passedCount}
              </span>
              <span className="px-3 py-1.5 rounded-lg bg-red-50 text-red-700 border border-red-200 text-xs font-bold">
                ✗ 违规/待修: {diagnosisResult.failedCount}
              </span>
            </div>
          </div>

          {/* Top Priority Issues */}
          {diagnosisResult.topIssues && diagnosisResult.topIssues.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-stone-700 uppercase tracking-wider">
                核心病灶排查清单 (按优先级排序)
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {diagnosisResult.topIssues.map((issue: any, idx: number) => (
                  <div key={idx} className="p-4 rounded-xl border border-red-200 bg-red-50/50 text-xs space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-red-950 font-serif-sc text-sm">
                        {issue.title}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-200 text-red-900">
                        {issue.severity || 'P0'}
                      </span>
                    </div>
                    <p className="text-red-900 leading-relaxed text-[11px]">
                      {issue.description}
                    </p>
                    <div className="mt-2 pt-2 border-t border-red-200/60 text-[11px] text-stone-800">
                      <span className="font-bold text-amber-800">推荐修复动作: </span>
                      {issue.recommendation}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* All Gates Checklist */}
          {diagnosisResult.gates && (
            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-bold text-stone-700 uppercase tracking-wider">
                21 道质量门逐项判定详情
              </h4>
              <div className="divide-y divide-stone-100 border border-stone-200 rounded-xl overflow-hidden">
                {diagnosisResult.gates.map((g: any, idx: number) => (
                  <div key={idx} className="p-3 text-xs flex items-start space-x-3 hover:bg-stone-50/80 transition-colors">
                    <div className="mt-0.5 shrink-0">
                      {g.passed ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <XCircle className="w-4 h-4 text-red-600" />
                      )}
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-mono font-bold text-stone-900">{g.code}</span>
                        <span className="font-medium text-stone-900">{g.name}</span>
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-stone-100 text-stone-600">
                          {g.category}
                        </span>
                      </div>
                      {!g.passed && (
                        <div className="space-y-1 mt-1 text-[11px]">
                          {g.diagnosis && (
                            <p className="text-red-700">
                              <strong className="font-medium">病灶: </strong>
                              {g.diagnosis}
                            </p>
                          )}
                          {g.evidence && (
                            <p className="text-stone-500 italic bg-stone-100/70 p-1.5 rounded">
                              证据原文: "{g.evidence}"
                            </p>
                          )}
                          {g.fixAction && (
                            <p className="text-amber-900 bg-amber-50 p-1.5 rounded border border-amber-200">
                              <strong className="font-medium">最小动作: </strong>
                              {g.fixAction}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
