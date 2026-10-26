/**
 * @snui/vue-web locales — public i18n entry.
 *
 * Public API (naive-ui style):
 *   - `SnLocale` — the locale contract (interface-first, AGENTS.md §13)
 *   - `zhCN` / `enUS` — built-in complete locales
 *
 * `useLocale` and `SN_LOCALE_KEY` are internal: components consume them
 * directly, hosts configure language through `<SnConfigProvider :locale>`.
 */

export type {
  SnLocale,
  SnCommonLocale,
  SnUploadLocale,
  SnLogLocale,
  SnVideoControlsLocale,
  SnDatePickerLocale,
  SnPaginationLocale,
  SnCalendarLocale,
  SnTransferLocale,
  SnDataTableLocale,
  SnTreeLocale,
  SnEmptyLocale,
  SnQrCodeLocale,
  SnHeatmapLocale,
  SnBackTopLocale,
  SnDrawerLocale,
  SnAvatarGroupLocale,
  SnPopconfirmLocale,
} from './zh-cn';
export { zhCN } from './zh-cn';
export { enUS } from './en-us';
