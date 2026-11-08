/**
 * 首页「场景案例」版位注册表（home-cases.ts）的契约测试。
 *
 * 锁定：单一瀑布流结构、案例 id 唯一（SnWaterfall 以 vnode key 定位
 * 摆放，重复 id 会破坏瀑布流）、档位合法、色相派生确定且在值域内；
 * 卡头筛选分组合法（ai / core / media 均有卡）、编号唯一且确定、
 * badge 与底部 API 签名非空。
 */
import { describe, expect, it } from 'vitest';
import { caseHue, caseIndexLabels, HOME_CASE_GROUPS, homeCases } from './home-cases';

describe('home cases registry', () => {
  it('should keep case ids unique (waterfall keys)', () => {
    const ids = homeCases.map((c) => c.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('should keep the nine designed cards plus three extended scenes', () => {
    expect(homeCases.length).toBe(12);
  });

  it('should use a known size preset on every case', () => {
    for (const c of homeCases) {
      expect(c.size).toMatch(/^c\d{3}$/);
      expect([
        'c188',
        'c208',
        'c228',
        'c248',
        'c288',
        'c308',
        'c338',
        'c378',
        'c388',
        'c398',
        'c418',
        'c428',
      ]).toContain(c.size);
    }
  });

  it('should derive deterministic hues within 0–359', () => {
    for (const c of homeCases) {
      const hue = caseHue(c.id);
      expect(hue).toBe(caseHue(c.id)); // 确定性（同一 id 同一色相）
      expect(hue).toBeGreaterThanOrEqual(0);
      expect(hue).toBeLessThanOrEqual(359);
    }
  });

  it('should spread hues across the wheel (相邻案例颜色不同)', () => {
    const hues = homeCases.map((c) => caseHue(c.id));
    expect(new Set(hues).size).toBeGreaterThan(homeCases.length / 2);
  });

  it('should tag every case with a known filter group', () => {
    const groups = homeCases.map((c) => c.group);
    for (const g of groups) {
      expect(HOME_CASE_GROUPS).toContain(g);
    }
    // 每个筛选胶囊都得有卡，否则胶囊点开是空的
    expect(new Set(groups)).toEqual(new Set(HOME_CASE_GROUPS));
  });

  it('should derive unique and deterministic index labels', () => {
    const labels = homeCases.map((c) => caseIndexLabels[c.id]);
    expect(new Set(labels).size).toBe(labels.length);

    // AI 原生场景单独成序（AI #01…）
    const aiCases = homeCases.filter((c) => c.group === 'ai');
    expect(aiCases.length).toBeGreaterThan(0);
    expect(caseIndexLabels[aiCases[0].id]).toBe('AI #01');

    // 其余卡从 #01 起连续编号，且与 AI 编号不冲突
    const otherCases = homeCases.filter((c) => c.group !== 'ai');
    expect(caseIndexLabels[otherCases[0].id]).toBe('#01');
    expect(caseIndexLabels[otherCases.at(-1)!.id]).toBe(
      `#${String(otherCases.length).padStart(2, '0')}`,
    );
  });

  it('should give every case a badge tag and an api signature', () => {
    for (const c of homeCases) {
      expect(c.badge.trim().length).toBeGreaterThan(0);
      expect(c.api.trim().length).toBeGreaterThan(0);
    }
  });
});
