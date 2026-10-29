/**
 * 公历 ↔ 农历换算（1900 – 2100）。
 *
 * 数据源为社区通行的压缩历表（每年一个 hex：高 17 位为 12/13 个月的大小月
 * 位 + 闰月长度位，低 4 位为闰月月份，0 表示无闰月），基准日
 * 1900-01-31 = 农历 1900 年正月初一。表数据与换算算法均不依赖运行环境的
 * 时区：所有日期差都通过「UTC 正午」天数序号计算，避免了夏令时导致的
 * ±1 天漂移；输出仍是本地时区的时间戳（与
 * `sn-datetime-picker-view-utils` 的 startOfDay / fromParts 约定一致）。
 *
 * 纯函数（AGENTS.md §27）：不修改入参、无副作用、幂等。
 *
 * 供 `sn-datetime-picker-view`（农历滚筒）与 `sn-calendar-view`
 * （农历显示，additive，见 AGENTS.md §112.3a）共用。
 */

/** 1900–2100 年压缩历表（标准社区数据，索引 0 = 1900 年）。 */
const LUNAR_INFO: readonly number[] = [
  0x04bd8, 0x04ae0, 0x0a570, 0x054d5, 0x0d260, 0x0d950, 0x16554, 0x056a0, 0x09ad0, 0x055d2,
  0x04ae0, 0x0a5b6, 0x0a4d0, 0x0d250, 0x1d255, 0x0b540, 0x0d6a0, 0x0ada2, 0x095b0, 0x14977,
  0x04970, 0x0a4b0, 0x0b4b5, 0x06a50, 0x06d40, 0x1ab54, 0x02b60, 0x09570, 0x052f2, 0x04970,
  0x06566, 0x0d4a0, 0x0ea50, 0x06e95, 0x05ad0, 0x02b60, 0x186e3, 0x092e0, 0x1c8d7, 0x0c950,
  0x0d4a0, 0x1d8a6, 0x0b550, 0x056a0, 0x1a5b4, 0x025d0, 0x092d0, 0x0d2b2, 0x0a950, 0x0b557,
  0x06ca0, 0x0b550, 0x15355, 0x04da0, 0x0a5b0, 0x14573, 0x052b0, 0x0a9a8, 0x0e950, 0x06aa0,
  0x0aea6, 0x0ab50, 0x04b60, 0x0aae4, 0x0a570, 0x05260, 0x0f263, 0x0d950, 0x05b57, 0x056a0,
  0x096d0, 0x04dd5, 0x04ad0, 0x0a4d0, 0x0d4d4, 0x0d250, 0x0d558, 0x0b540, 0x0b6a0, 0x195a6,
  0x095b0, 0x049b0, 0x0a974, 0x0a4b0, 0x0b27a, 0x06a50, 0x06d40, 0x0af46, 0x0ab60, 0x09570,
  0x04af5, 0x04970, 0x064b0, 0x074a3, 0x0ea50, 0x06b58, 0x05ac0, 0x0ab60, 0x096d5, 0x092e0,
  0x0c960, 0x0d954, 0x0d4a0, 0x0da50, 0x07552, 0x056a0, 0x0abb7, 0x025d0, 0x092d0, 0x0cab5,
  0x0a950, 0x0b4a0, 0x0baa4, 0x0ad50, 0x055d9, 0x04ba0, 0x0a5b0, 0x15176, 0x052b0, 0x0a930,
  0x07954, 0x06aa0, 0x0ad50, 0x05b52, 0x04b60, 0x0a6e6, 0x0a4e0, 0x0d260, 0x0ea65, 0x0d530,
  0x05aa0, 0x076a3, 0x096d0, 0x04afb, 0x04ad0, 0x0a4d0, 0x1d0b6, 0x0d250, 0x0d520, 0x0dd45,
  0x0b5a0, 0x056d0, 0x055b2, 0x049b0, 0x0a577, 0x0a4b0, 0x0aa50, 0x1b255, 0x06d20, 0x0ada0,
  0x14b63, 0x09370, 0x049f8, 0x04970, 0x064b0, 0x168a6, 0x0ea50, 0x06b20, 0x1a6c4, 0x0aae0,
  0x0a2e0, 0x0d2e3, 0x0c960, 0x0d557, 0x0d4a0, 0x0da50, 0x05d55, 0x056a0, 0x0a6d0, 0x055d4,
  0x052d0, 0x0a9b8, 0x0a950, 0x0b4a0, 0x0b6a6, 0x0ad50, 0x055a0, 0x0aba4, 0x0a5b0, 0x052b0,
  0x0b273, 0x06930, 0x07337, 0x06aa0, 0x0ad50, 0x14b55, 0x04b60, 0x0a570, 0x054e4, 0x0d160,
  0x0e968, 0x0d520, 0x0daa0, 0x16aa6, 0x056d0, 0x04ae0, 0x0a9d4, 0x0a2d0, 0x0d150, 0x0f252,
  0x0d520,
];

/** 表覆盖的第一年（1900）。 */
export const LUNAR_START_YEAR = 1900;
/** 表覆盖的最后一年（2100）。 */
export const LUNAR_END_YEAR = 2100;

/** 农历月份名（1 = 正月，11 = 冬月，12 = 腊月）。 */
export const LUNAR_MONTH_NAMES: readonly string[] = [
  '正月',
  '二月',
  '三月',
  '四月',
  '五月',
  '六月',
  '七月',
  '八月',
  '九月',
  '十月',
  '冬月',
  '腊月',
];

/** 农历日名（索引 0 = 初一）。 */
export const LUNAR_DAY_NAMES: readonly string[] = [
  '初一',
  '初二',
  '初三',
  '初四',
  '初五',
  '初六',
  '初七',
  '初八',
  '初九',
  '初十',
  '十一',
  '十二',
  '十三',
  '十四',
  '十五',
  '十六',
  '十七',
  '十八',
  '十九',
  '二十',
  '廿一',
  '廿二',
  '廿三',
  '廿四',
  '廿五',
  '廿六',
  '廿七',
  '廿八',
  '廿九',
  '三十',
];

const LUNAR_STEMS: readonly string[] = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
const LUNAR_BRANCHES: readonly string[] = [
  '子',
  '丑',
  '寅',
  '卯',
  '辰',
  '巳',
  '午',
  '未',
  '申',
  '酉',
  '戌',
  '亥',
];

/** 基准日：农历 1900 年正月初一 = 公历 1900-01-31（UTC 正午天数序号）。 */
const LUNAR_BASE_DAY = Date.UTC(1900, 0, 31, 12) / 86400000;

const DAY_MS = 86400000;

/** 本地某天的 UTC 正午天数序号（免时区/夏令时干扰）。 */
function localDayNumber(year: number, month: number, day: number): number {
  return Date.UTC(year, month - 1, day, 12) / DAY_MS;
}

/** `year` 年的历表条目；越界返回 `undefined`。 */
function infoOf(year: number): number | undefined {
  return LUNAR_INFO[year - LUNAR_START_YEAR];
}

/** `year` 年的闰月月份（0 = 无闰月）。 */
export function lunarLeapMonth(year: number): number {
  const info = infoOf(year);
  return info === undefined ? 0 : info & 0xf;
}

/** `year` 年闰月的天数（无闰月为 0；闰月 29 或 30 天）。 */
export function lunarLeapDays(year: number): number {
  const info = infoOf(year);
  if (info === undefined || (info & 0xf) === 0) return 0;
  return (info & 0x10000) !== 0 ? 30 : 29;
}

/** `year` 年农历 `month`（1–12）月的天数（29 或 30）。 */
export function lunarMonthDays(year: number, month: number): number {
  const info = infoOf(year);
  if (info === undefined) return 29;
  return (info & (0x10000 >> month)) !== 0 ? 30 : 29;
}

/** `year` 年农历全年天数（353–385）。 */
export function lunarYearDays(year: number): number {
  const info = infoOf(year);
  if (info === undefined) return 0;
  let sum = 348;
  for (let bit = 0x8000; bit > 0x8; bit >>= 1) {
    if ((info & bit) !== 0) sum += 1;
  }
  return sum + lunarLeapDays(year);
}

/** 农历月名（含闰月前缀），如 `正月` / `冬月` / `闰二月`。 */
export function lunarMonthName(month: number, isLeap = false): string {
  const name = LUNAR_MONTH_NAMES[month - 1] ?? '';
  return isLeap ? `闰${name}` : name;
}

/** 农历日名，如 `初一` / `十五` / `三十`。 */
export function lunarDayName(day: number): string {
  return LUNAR_DAY_NAMES[day - 1] ?? '';
}

/** 干支纪年名，如 2024 → `甲辰`。 */
export function lunarYearStemBranch(year: number): string {
  const stem = LUNAR_STEMS[(year - 4) % 10] ?? '';
  const branch = LUNAR_BRANCHES[(year - 4) % 12] ?? '';
  return `${stem}${branch}`;
}

/** 农历年展示名，如 2024 → `甲辰年`。 */
export function lunarYearName(year: number): string {
  return `${lunarYearStemBranch(year)}年`;
}

/** 农历日期部件。 */
export interface LunarParts {
  /** 农历年（公历年数字，如 2025 = 乙巳年）。 */
  year: number;
  /** 农历月 1–12。 */
  month: number;
  /** 农历日 1–30。 */
  day: number;
  /** 是否闰月。 */
  isLeap: boolean;
}

/** 农历某月的天数（按闰月区分）。 */
export function lunarMonthLength(year: number, month: number, isLeap: boolean): number {
  if (isLeap) return lunarLeapDays(year);
  return lunarMonthDays(year, month);
}

/**
 * 公历时间戳 → 农历部件。
 *
 * `timestamp` 的年月日按**本地时区**读取；超出表范围（1900–2100）时按边界
 * 年夹取，保证调用方总能拿到可渲染的部件。
 */
export function solarToLunar(timestamp: number): LunarParts {
  const d = new Date(timestamp);
  let offset = localDayNumber(d.getFullYear(), d.getMonth() + 1, d.getDate()) - LUNAR_BASE_DAY;

  let year = LUNAR_START_YEAR;
  for (; year < LUNAR_END_YEAR; year += 1) {
    const days = lunarYearDays(year);
    if (days === 0) break;
    if (offset < days) break;
    offset -= days;
  }

  const leap = lunarLeapMonth(year);
  let month = 0;
  let isLeap = false;
  let day = Math.max(offset, 0) + 1;
  let slot = 0;
  let regular = 1;
  while (regular <= 12) {
    slot += 1;
    const atLeap = leap > 0 && slot === leap + 1;
    const len = atLeap ? lunarLeapDays(year) : lunarMonthDays(year, regular);
    if (offset < len) {
      // 闰月槽位命中的是「闰 regular-1 月」，月份号要回退到 leap 本身。
      month = atLeap ? leap : regular;
      isLeap = atLeap;
      day = offset + 1;
      break;
    }
    offset -= len;
    if (!atLeap) regular += 1;
  }
  // 走完 12 个月仍未命中（越界日期）：夹到腊月最后一天。
  if (month === 0) {
    month = 12;
    isLeap = false;
    day = lunarMonthDays(year, 12);
  }
  return { year, month, day, isLeap };
}

/**
 * 农历部件 → 公历本地零点时间戳。
 *
 * 闰月参数不合法（该年没有对应闰月）或 `day` 超出月长时按月末夹取，
 * 保证总是返回有效日期。
 */
export function lunarToSolar(parts: LunarParts): number {
  const year = Math.min(Math.max(parts.year, LUNAR_START_YEAR), LUNAR_END_YEAR);
  const leap = lunarLeapMonth(year);
  const isLeap = parts.isLeap && leap === parts.month;
  const month = Math.min(Math.max(parts.month, 1), 12);
  const monthLen = isLeap ? lunarLeapDays(year) : lunarMonthDays(year, month);
  const day = Math.min(Math.max(parts.day, 1), monthLen);

  let offset = 0;
  for (let y = LUNAR_START_YEAR; y < year; y += 1) offset += lunarYearDays(y);

  // 目标月在其农历年内的槽位序数（闰月占独立槽位，跟在同名平月后）。
  const ordinal = leap > 0 && (isLeap || month > leap) ? month + 1 : month;
  let slot = 1;
  let regular = 1;
  while (slot < ordinal) {
    const atLeap = leap > 0 && slot === leap + 1;
    offset += atLeap ? lunarLeapDays(year) : lunarMonthDays(year, regular);
    if (!atLeap) regular += 1;
    slot += 1;
  }

  const totalDays = offset + day - 1;
  const solarDay = LUNAR_BASE_DAY + totalDays;
  // 从 UTC 正午天数序号还原为本地零点（日期分量稳定）。
  const utc = new Date(solarDay * DAY_MS);
  return new Date(utc.getUTCFullYear(), utc.getUTCMonth(), utc.getUTCDate()).getTime();
}

/** 农历时间戳的中文串，如 `乙巳年十月十二`（闰月带 `闰` 前缀）。 */
export function formatLunar(timestamp: number): string {
  const lunar = solarToLunar(timestamp);
  return `${lunarYearName(lunar.year)}${lunarMonthName(lunar.month, lunar.isLeap)}${lunarDayName(lunar.day)}`;
}

/**
 * 日历格子的农历角标：初一显示月名（如 `正月` / `闰六月`），其余显示日名。
 */
export function lunarDayLabel(timestamp: number): string {
  const lunar = solarToLunar(timestamp);
  return lunar.day === 1
    ? lunarMonthName(lunar.month, lunar.isLeap)
    : lunarDayName(lunar.day);
}
