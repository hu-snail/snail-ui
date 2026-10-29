/**
 * sn-lunar unit tests — 公历 ↔ 农历换算。
 *
 * 断言锚点全部是公开历法事实（春节 / 中秋 / 端午 / 闰月首日），
 * 不依赖任何第三方日期库（AGENTS.md §57）。
 */

import { describe, it, expect } from 'vitest';
import {
  solarToLunar,
  lunarToSolar,
  formatLunar,
  lunarDayLabel,
  lunarYearName,
  lunarMonthName,
  lunarLeapMonth,
  lunarMonthLength,
  LUNAR_START_YEAR,
  LUNAR_END_YEAR,
} from './sn-lunar';

/** 本地零点时间戳。 */
const local = (year: number, month: number, day: number): number =>
  new Date(year, month - 1, day).getTime();

describe('sn-lunar', () => {
  describe('solarToLunar', () => {
    it('should map the 1900 base day to 庚子年正月初一', () => {
      const lunar = solarToLunar(local(1900, 1, 31));
      expect(lunar).toEqual({ year: 1900, month: 1, day: 1, isLeap: false });
      expect(lunarYearName(1900)).toBe('庚子年');
    });

    it('should map Chinese New Year 2024 to 甲辰年正月初一', () => {
      expect(solarToLunar(local(2024, 2, 10))).toEqual({
        year: 2024,
        month: 1,
        day: 1,
        isLeap: false,
      });
    });

    it('should map Chinese New Year 2025 to 乙巳年正月初一', () => {
      expect(solarToLunar(local(2025, 1, 29))).toEqual({
        year: 2025,
        month: 1,
        day: 1,
        isLeap: false,
      });
    });

    it('should map Chinese New Year 2026 to 丙午年正月初一', () => {
      expect(solarToLunar(local(2026, 2, 17)).year).toBe(2026);
      expect(solarToLunar(local(2026, 2, 17)).month).toBe(1);
      expect(solarToLunar(local(2026, 2, 17)).day).toBe(1);
    });

    it('should map Mid-Autumn 2024 to 八月十五', () => {
      const lunar = solarToLunar(local(2024, 9, 17));
      expect(lunar.month).toBe(8);
      expect(lunar.day).toBe(15);
      expect(lunar.isLeap).toBe(false);
    });

    it('should map Duanwu 2025 to 五月初五', () => {
      const lunar = solarToLunar(local(2025, 5, 31));
      expect(lunar.month).toBe(5);
      expect(lunar.day).toBe(5);
    });

    it('should detect the 2023 leap second month', () => {
      expect(lunarLeapMonth(2023)).toBe(2);
      const lunar = solarToLunar(local(2023, 3, 22));
      expect(lunar.isLeap).toBe(true);
      expect(lunar.month).toBe(2);
      expect(lunar.day).toBe(1);
    });

    it('should detect the 2025 leap sixth month', () => {
      expect(lunarLeapMonth(2025)).toBe(6);
      const lunar = solarToLunar(local(2025, 7, 25));
      expect(lunar.isLeap).toBe(true);
      expect(lunar.month).toBe(6);
      expect(lunar.day).toBe(1);
    });
  });

  describe('lunarToSolar', () => {
    it('should map 正月初一 back to Chinese New Year dates', () => {
      expect(lunarToSolar({ year: 2024, month: 1, day: 1, isLeap: false })).toBe(
        local(2024, 2, 10),
      );
      expect(lunarToSolar({ year: 2025, month: 1, day: 1, isLeap: false })).toBe(
        local(2025, 1, 29),
      );
      expect(lunarToSolar({ year: 2026, month: 1, day: 1, isLeap: false })).toBe(
        local(2026, 2, 17),
      );
    });

    it('should map the 2025 leap sixth month after the regular sixth month', () => {
      // 乙巳年闰六月初一 = 2025-07-25；六月初一 = 2025-06-25（早 30 天）。
      expect(lunarToSolar({ year: 2025, month: 6, day: 1, isLeap: true })).toBe(local(2025, 7, 25));
      expect(lunarToSolar({ year: 2025, month: 6, day: 1, isLeap: false })).toBe(
        local(2025, 6, 25),
      );
    });

    it('should keep the leap flag harmless when the year has no leap month', () => {
      expect(lunarToSolar({ year: 2024, month: 8, day: 15, isLeap: true })).toBe(local(2024, 9, 17));
    });

    it('should clamp a day beyond the month length to the month end', () => {
      // 按实际月长动态验证：请求「月末 + 1 天」应夹回月末。
      const monthLen = lunarMonthLength(2025, 10, false);
      expect(monthLen === 29 || monthLen === 30).toBe(true);
      const ts = lunarToSolar({ year: 2025, month: 10, day: monthLen + 1, isLeap: false });
      const lunar = solarToLunar(ts);
      expect(lunar.month).toBe(10);
      expect(lunar.day).toBe(monthLen);
    });

    it('should round-trip a span of dates through solar → lunar → solar', () => {
      // 每 11 天采样，覆盖大小月、闰月与跨年边界。
      let ts = local(2023, 1, 1);
      const end = local(2027, 12, 31);
      while (ts <= end) {
        const back = lunarToSolar(solarToLunar(ts));
        expect(new Date(back).toDateString()).toBe(new Date(ts).toDateString());
        ts += 11 * 86400000;
      }
    });
  });

  describe('labels', () => {
    it('should format the lunar date like 乙巳年十月十二', () => {
      expect(formatLunar(local(2025, 12, 1))).toBe('乙巳年十月十二');
    });

    it('should prefix a leap month with 闰', () => {
      expect(lunarMonthName(6, true)).toBe('闰六月');
      expect(lunarMonthName(11, false)).toBe('冬月');
      expect(lunarMonthName(12, false)).toBe('腊月');
    });

    it('should show the month name on 初一 and the day name otherwise', () => {
      expect(lunarDayLabel(local(2025, 1, 29))).toBe('正月');
      expect(lunarDayLabel(local(2025, 1, 30))).toBe('初二');
      expect(lunarDayLabel(local(2024, 9, 17))).toBe('十五');
      expect(lunarDayLabel(local(2025, 7, 25))).toBe('闰六月');
    });
  });

  describe('table bounds', () => {
    it('should cover 1900–2100', () => {
      expect(LUNAR_START_YEAR).toBe(1900);
      expect(LUNAR_END_YEAR).toBe(2100);
      // 边界外不崩溃，夹到表边界年。
      const before = solarToLunar(local(1899, 1, 1));
      const after = solarToLunar(local(2101, 1, 1));
      expect(before.year).toBeGreaterThanOrEqual(1900);
      expect(after.year).toBeLessThanOrEqual(2100);
    });
  });
});
