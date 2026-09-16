import { AuditMetric } from '../types';
import { BANNED_METAPHORS, BANNED_PUNCTUATION, HABITUAL_WORDS } from '../data/rulesGuide';

export function runProseAudit(text: string): AuditMetric {
  const lines = text.split('\n');
  
  // 1. Banned metaphors
  const bannedMetaphors: AuditMetric['bannedMetaphors'] = [];
  for (const phrase of BANNED_METAPHORS) {
    const matchedLines: number[] = [];
    let totalCount = 0;
    lines.forEach((line, idx) => {
      let pos = 0;
      let lineHits = 0;
      while ((pos = line.indexOf(phrase, pos)) !== -1) {
        lineHits++;
        pos += phrase.length;
      }
      if (lineHits > 0) {
        matchedLines.push(idx + 1);
        totalCount += lineHits;
      }
    });
    if (totalCount > 0) {
      bannedMetaphors.push({ word: phrase, count: totalCount, lines: matchedLines });
    }
  }

  // 2. Banned punctuation
  const bannedPunctuation: AuditMetric['bannedPunctuation'] = [];
  for (const mark of BANNED_PUNCTUATION) {
    const matchedLines: number[] = [];
    let count = 0;
    lines.forEach((line, idx) => {
      let pos = 0;
      let lineHits = 0;
      while ((pos = line.indexOf(mark, pos)) !== -1) {
        lineHits++;
        pos += mark.length;
      }
      if (lineHits > 0) {
        matchedLines.push(idx + 1);
        count += lineHits;
      }
    });
    if (count > 0) {
      bannedPunctuation.push({ mark, count, lines: matchedLines });
    }
  }

  // 3. Body parts
  const bodyParts = ['手', '心', '眼睛', '眼眶', '膝盖', '嘴角', '嘴唇', '鼻头'];
  const bodyPartCounts: Record<string, number> = {};
  for (const part of bodyParts) {
    const regex = new RegExp(part, 'g');
    const matches = text.match(regex);
    bodyPartCounts[part] = matches ? matches.length : 0;
  }

  // 4. Similes
  const simileRegex = /(?:像|像是|不像)/g;
  const simileMatches = text.match(simileRegex);
  const simileCounts = simileMatches ? simileMatches.length : 0;

  // 5. Habitual words
  const habitualCounts: Record<string, number> = {};
  for (const word of HABITUAL_WORDS) {
    const regex = new RegExp(word, 'g');
    const matches = text.match(regex);
    habitualCounts[word] = matches ? matches.length : 0;
  }

  // 6. Meta words
  const metaTokens = ['第.*章', '本章', '前文', '后文', '伏笔', '细纲', '读者', '作者'];
  const metaWords: AuditMetric['metaWords'] = [];
  for (const token of metaTokens) {
    const regex = new RegExp(token, 'g');
    const matches = text.match(regex);
    if (matches && matches.length > 0) {
      metaWords.push({ word: token.replace('.*', 'N'), count: matches.length });
    }
  }

  // 7. Quotes
  const standardQuotesMatch = text.match(/「.*?」/g);
  const doubleQuotesMatch = text.match(/"[^"]*"|“[^”]*”/g);

  const cleanChars = text.replace(/\s+/g, '');
  const paragraphs = text.split('\n').filter(p => p.trim().length > 0);

  return {
    bannedMetaphors,
    bannedPunctuation,
    bodyPartCounts,
    simileCounts,
    habitualWords: habitualCounts,
    metaWords,
    quotationCheck: {
      standardBracketsCount: standardQuotesMatch ? standardQuotesMatch.length : 0,
      doubleQuotesCount: doubleQuotesMatch ? doubleQuotesMatch.length : 0
    },
    wordCount: cleanChars.length,
    paragraphCount: paragraphs.length
  };
}

export function autoSanitizeText(text: string): string {
  let result = text;
  // Replace banned punctuation
  result = result.replace(/……/g, '。');
  result = result.replace(/——|—|--/g, '，');
  result = result.replace(/!{2,}/g, '！');
  result = result.replace(/\?{2,}/g, '？');

  // Replace double quotes with 「」
  result = result.replace(/[“"]/g, '「').replace(/[”"]/g, '」');

  // Replace some banned phrases with clean alternatives
  result = result.replace(/命运的齿轮/g, '事情的走向');
  result = result.replace(/如潮水般/g, '一阵接一阵');
  result = result.replace(/不由得/g, '直接');
  result = result.replace(/仿佛春风/g, '透着一丝暖意');
  result = result.replace(/心猛地一沉/g, '我手心立刻渗出了汗');
  result = result.replace(/眼眶泛红/g, '我鼻头一酸');
  result = result.replace(/像被抽空了力气/g, '我腿脚一软撞在桌沿上');
  result = result.replace(/指甲掐进掌心/g, '我攥紧了被汗浸湿的袖角');

  return result;
}
