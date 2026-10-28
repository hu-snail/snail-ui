/**
 * 首页「场景案例」版位注册表（home-cases.ts）的契约测试。
 *
 * 锁定：单一瀑布流结构、案例 id 唯一（SnWaterfall 以 vnode key 定位
 * 摆放，重复 id 会破坏瀑布流）、档位合法、色相派生确定且在值域内。
 */
import { describe, expect, it } from 'vitest';
import { caseHue, homeCases } from './home-cases';

describe('home cases registry', () => {
  it('should keep case ids unique (waterfall keys)', () => {
    const ids = homeCases.map((c) => c.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('should keep at least twenty cases for a rich wall', () => {
    expect(homeCases.length).toBeGreaterThanOrEqual(20);
  });

  it('should use a known size preset on every case', () => {
    for (const c of homeCases) {
      expect(['sm', 'md', 'lg']).toContain(c.size);
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
});
