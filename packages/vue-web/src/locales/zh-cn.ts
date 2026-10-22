/**
 * zh-CN locale — the built-in default for @snui/vue-web (naive-ui style).
 *
 * Structure is grouped by component namespace (`Upload` / `Log` /
 * `VideoControls` / `DatePicker` / `Pagination` / `Calendar`). `zhCN` values
 * are exactly the strings the components rendered before i18n existed, so
 * the default rendering stays byte-identical to the pre-locale behavior
 * (backward compatibility). Strings that were hardcoded English (upload
 * picker / trigger aria affordances) keep those exact strings here for the
 * same reason.
 *
 * Conventions:
 *   - `{name}` / `{accept}` / `{y}` / `{m}` / `{total}` placeholders are
 *     filled by the component (`String.replace`), never by the locale author.
 *   - A custom locale may omit whole namespaces; every namespace it DOES
 *     provide must be complete (see `use-locale.ts` for the merge contract).
 */

/** Localized strings for SnUpload. */
export interface SnUploadLocale {
  /** Status label for a `pending` entry. */
  pending: string
  /** Status label for an `uploading` entry. */
  uploading: string
  /** Status label for a `done` entry. */
  done: string
  /** Status label for an `error` entry. */
  error: string
  /** Compact trigger button text. */
  clickToUpload: string
  /** Drop-area (`dragger`) title. */
  draggerTitle: string
  /** Drop-area hint, rendered before the accept suffix. */
  draggerHint: string
  /** Accept suffix (`{accept}` is replaced with the `accept` attribute). */
  draggerHintAccept: string
  /** Hidden native file input `aria-label`. */
  inputAriaLabel: string
  /** Compact trigger button `aria-label`. */
  triggerAriaLabel: string
  /** Drop-area button `aria-label`. */
  draggerAriaLabel: string
  /** Preview affordance `aria-label` (`{name}` = file name). */
  previewAriaLabel: string
  /** Remove affordance `aria-label` (`{name}` = file name). */
  removeAriaLabel: string
  /** Determinate progress bar `aria-label` (`{name}` = file name). */
  uploadingAriaLabel: string
}

/** Localized strings for SnLog. */
export interface SnLogLocale {
  /** Loading indicator label. */
  loading: string
}

/** Localized strings for the internal SnVideoControls bar. */
export interface SnVideoControlsLocale {
  /** Play button action label (announced before playing). */
  play: string
  /** Pause button action label (announced while playing). */
  pause: string
  /** Mute button action label (announced while unmuted). */
  mute: string
  /** Unmute button action label (announced while muted). */
  unmute: string
  /** Fullscreen button action label (announced while windowed). */
  fullscreen: string
  /** Exit-fullscreen button action label (announced while fullscreen). */
  exitFullscreen: string
  /** Control-bar toolbar `aria-label`. */
  toolbar: string
  /** Timeline range input `aria-label`. */
  timeline: string
}

/** Localized strings for SnDatePicker. */
export interface SnDatePickerLocale {
  /** Panel weekday header labels — Monday-first (project grid convention). */
  weekdays: readonly string[]
  /** Month cell labels (`1月` … `12月` in zhCN). */
  months: readonly string[]
  /** Panel header title, `{y}` / `{m}` are year / month placeholders. */
  monthTitle: string
  /** Year anchor header title, `{y}` is the year placeholder. */
  yearTitle: string
  /** Single-input placeholder. */
  placeholder: string
  /** Range start placeholder. */
  rangeStartPlaceholder: string
  /** Range end placeholder. */
  rangeEndPlaceholder: string
}

/** Localized strings for SnPagination. */
export interface SnPaginationLocale {
  /** Total counter text, `{total}` is the item count placeholder. */
  total: string
  /** Previous-page button `aria-label`. */
  prevPage: string
  /** Next-page button `aria-label`. */
  nextPage: string
  /** Simple-mode input status, `{total}` is the page count. */
  currentPageStatus: string
  /** Page-number button `aria-label`, `{page}` is the page number. */
  page: string
  /** Jump input `aria-label`. */
  jumpAriaLabel: string
  /** Per-page size select `aria-label`. */
  perPage: string
  /** `<nav>` `aria-label`. */
  navigationAriaLabel: string
}

/** Localized strings for SnCalendar. */
export interface SnCalendarLocale {
  /** Header title, `{y}` / `{m}` are year / month placeholders. */
  monthTitle: string
  /** Weekday labels shown in the first grid row — Monday-first. */
  weekdays: readonly string[]
  /** "Previous month" nav button `aria-label`. */
  prevMonth: string
  /** "Next month" nav button `aria-label`. */
  nextMonth: string
  /** The dates grid `aria-label`. */
  gridLabel: string
  /** "Today" action button label. */
  today: string
}

/**
 * Locale contract for @snui/vue-web — `zhCN` / `enUS` ship complete
 * translations; custom locales may omit whole namespaces (per-namespace
 * fallback to zhCN, see `use-locale.ts`).
 */
export interface SnLocale {
  /** Locale identifier, e.g. `'zh-CN'`. */
  name: string
  /** SnUpload strings. */
  Upload: SnUploadLocale
  /** SnLog strings. */
  Log: SnLogLocale
  /** SnVideoControls strings. */
  VideoControls: SnVideoControlsLocale
  /** SnDatePicker strings. */
  DatePicker: SnDatePickerLocale
  /** SnPagination strings. */
  Pagination: SnPaginationLocale
  /** SnCalendar strings. */
  Calendar: SnCalendarLocale
}

/** Built-in Chinese (Simplified) locale — values mirror the pre-locale UI. */
export const zhCN: SnLocale = {
  name: 'zh-CN',
  Upload: {
    pending: '待上传',
    uploading: '上传中',
    done: '已完成',
    error: '失败',
    clickToUpload: '点击上传',
    draggerTitle: '点击或拖拽文件到此区域上传',
    draggerHint: '支持单个或批量上传',
    draggerHintAccept: '，仅接受 {accept}',
    inputAriaLabel: 'Choose files to upload',
    triggerAriaLabel: 'Upload files',
    draggerAriaLabel: 'Drag files here or click to upload',
    previewAriaLabel: 'Preview {name}',
    removeAriaLabel: 'Remove {name}',
    uploadingAriaLabel: 'Uploading {name}',
  },
  Log: {
    loading: '加载中',
  },
  VideoControls: {
    play: '播放',
    pause: '暂停',
    mute: '静音',
    unmute: '取消静音',
    fullscreen: '全屏',
    exitFullscreen: '退出全屏',
    toolbar: '播放控制',
    timeline: '播放进度',
  },
  DatePicker: {
    weekdays: ['一', '二', '三', '四', '五', '六', '日'],
    months: [
      '1月', '2月', '3月', '4月', '5月', '6月',
      '7月', '8月', '9月', '10月', '11月', '12月',
    ],
    monthTitle: '{y}年{m}月',
    yearTitle: '{y}年',
    placeholder: '请选择日期',
    rangeStartPlaceholder: '开始日期',
    rangeEndPlaceholder: '结束日期',
  },
  Pagination: {
    total: '共 {total} 条',
    prevPage: '上一页',
    nextPage: '下一页',
    currentPageStatus: '当前页码，共 {total} 页',
    page: '第 {page} 页',
    jumpAriaLabel: '跳页输入，输入页码后回车跳转',
    perPage: '每页条数',
    navigationAriaLabel: 'Pagination',
  },
  Calendar: {
    monthTitle: '{y}年{m}月',
    weekdays: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
    prevMonth: '上个月',
    nextMonth: '下个月',
    gridLabel: '日历',
    today: '今天',
  },
}
