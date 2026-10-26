/**
 * zh-CN locale — the built-in default for @snui/vue-web (naive-ui style).
 *
 * Structure is grouped by component namespace. `zhCN` values are exactly the
 * strings the components rendered before i18n existed, so the default
 * rendering stays byte-identical to the pre-locale behavior (backward
 * compatibility). Strings that were hardcoded English keep those exact
 * strings here for the same reason.
 *
 * Conventions:
 *   - `{name}` / `{accept}` / `{y}` / `{m}` / `{total}` / `{page}` /
 *     `{title}` / `{count}` placeholders are filled by the component
 *     (`String.replace`), never by the locale author.
 *   - A custom locale may omit whole namespaces; every namespace it DOES
 *     provide must be complete (see `use-locale.ts` for the merge contract).
 */

/** Shared strings used by several components. */
export interface SnCommonLocale {
  /** Close affordance `aria-label` (dialog / alert / tag / notification…). */
  close: string;
}

/** Localized strings for SnUpload. */
export interface SnUploadLocale {
  /** Status label for a `pending` entry. */
  pending: string;
  /** Status label for an `uploading` entry. */
  uploading: string;
  /** Status label for a `done` entry. */
  done: string;
  /** Status label for an `error` entry. */
  error: string;
  /** Compact trigger button text. */
  clickToUpload: string;
  /** Drop-area (`dragger`) title. */
  draggerTitle: string;
  /** Drop-area hint, rendered before the accept suffix. */
  draggerHint: string;
  /** Accept suffix (`{accept}` is replaced with the `accept` attribute). */
  draggerHintAccept: string;
  /** Hidden native file input `aria-label`. */
  inputAriaLabel: string;
  /** Compact trigger button `aria-label`. */
  triggerAriaLabel: string;
  /** Drop-area button `aria-label`. */
  draggerAriaLabel: string;
  /** Preview affordance `aria-label` (`{name}` = file name). */
  previewAriaLabel: string;
  /** Remove affordance `aria-label` (`{name}` = file name). */
  removeAriaLabel: string;
  /** Determinate progress bar `aria-label` (`{name}` = file name). */
  uploadingAriaLabel: string;
}

/** Localized strings for SnLog. */
export interface SnLogLocale {
  /** Loading indicator label. */
  loading: string;
}

/** Localized strings for the internal SnVideoControls bar + SnVideoPreview. */
export interface SnVideoControlsLocale {
  /** Play button action label (announced before playing). */
  play: string;
  /** Pause button action label (announced while playing). */
  pause: string;
  /** Mute button action label (announced while unmuted). */
  mute: string;
  /** Unmute button action label (announced while muted). */
  unmute: string;
  /** Fullscreen button action label (announced while windowed). */
  fullscreen: string;
  /** Exit-fullscreen button action label (announced while fullscreen). */
  exitFullscreen: string;
  /** Control-bar toolbar `aria-label`. */
  toolbar: string;
  /** Timeline range input `aria-label`. */
  timeline: string;
  /** Play overlay button `aria-label`. */
  playVideo: string;
  /** Zoom / preview overlay button `aria-label`. */
  zoomIn: string;
}

/** Localized strings for SnDatePicker. */
export interface SnDatePickerLocale {
  /** Panel weekday header labels — Monday-first (project grid convention). */
  weekdays: readonly string[];
  /** Month cell labels (`1月` … `12月` in zhCN). */
  months: readonly string[];
  /** Panel header title, `{y}` / `{m}` are year / month placeholders. */
  monthTitle: string;
  /** Year anchor header title, `{y}` is the year placeholder. */
  yearTitle: string;
  /** Single-input placeholder. */
  placeholder: string;
  /** Range start placeholder. */
  rangeStartPlaceholder: string;
  /** Range end placeholder. */
  rangeEndPlaceholder: string;
  /** Range separator rendered between the two inputs. */
  to: string;
  /** Datetime range: start time column label. */
  startTime: string;
  /** Datetime range: end time column label. */
  endTime: string;
  /** Datetime range confirm button. */
  confirm: string;
  /** Hour column `aria-label`. */
  hour: string;
  /** Minute column `aria-label`. */
  minute: string;
  /** Second column `aria-label`. */
  second: string;
}

/** Localized strings for SnPagination (also consumed by SnDataTable). */
export interface SnPaginationLocale {
  /** Total counter text, `{total}` is the item count placeholder. */
  total: string;
  /** Previous-page button `aria-label`. */
  prevPage: string;
  /** Next-page button `aria-label`. */
  nextPage: string;
  /** Simple-mode input status, `{total}` is the page count. */
  currentPageStatus: string;
  /** Page-number button `aria-label`, `{page}` is the page number. */
  page: string;
  /** Jump input `aria-label`. */
  jumpAriaLabel: string;
  /** Per-page size select `aria-label`. */
  perPage: string;
  /** `<nav>` `aria-label`. */
  navigationAriaLabel: string;
  /** Jumper input visible label. */
  jumpLabel: string;
  /** Suffix after the page-size number (`{size} 条/页`). */
  itemsPerPage: string;
}

/** Localized strings for SnCalendar. */
export interface SnCalendarLocale {
  /** Header title, `{y}` / `{m}` are year / month placeholders. */
  monthTitle: string;
  /** Weekday labels shown in the first grid row — Monday-first. */
  weekdays: readonly string[];
  /** "Previous month" nav button `aria-label`. */
  prevMonth: string;
  /** "Next month" nav button `aria-label`. */
  nextMonth: string;
  /** The dates grid `aria-label`. */
  gridLabel: string;
  /** "Today" action button label. */
  today: string;
}

/** Localized strings for SnTransfer. */
export interface SnTransferLocale {
  /** Select-all checkbox `aria-label`, `{title}` is the panel title. */
  selectAll: string;
  /** Filter input placeholder. */
  searchPlaceholder: string;
  /** Source filter input `aria-label`. */
  filterSource: string;
  /** Target filter input `aria-label`. */
  filterTarget: string;
  /** Move-selected-right button `aria-label`. */
  moveSelectedRight: string;
  /** Move-all-right button `aria-label`. */
  moveAllRight: string;
  /** Move-selected-left button `aria-label`. */
  moveSelectedLeft: string;
  /** Move-all-left button `aria-label`. */
  moveAllLeft: string;
}

/** Localized strings for SnDataTable (pagination reuses SnPaginationLocale). */
export interface SnDataTableLocale {
  /** Filter confirm button. */
  confirm: string;
  /** Filter reset button. */
  reset: string;
}

/** Localized strings for SnTree. */
export interface SnTreeLocale {
  /** Expanded row toggle `aria-label`. */
  collapse: string;
  /** Collapsed row toggle `aria-label`. */
  expand: string;
}

/** Shared empty-state description (SnTree / SnDataTable default slots). */
export interface SnEmptyLocale {
  /** Default empty description. */
  description: string;
}

/** Localized strings for SnQrCode. */
export interface SnQrCodeLocale {
  /** Download action `title` / `aria-label`. */
  download: string;
}

/** Localized strings for SnHeatmap. */
export interface SnHeatmapLocale {
  /** Leading indicator text (low end). */
  less: string;
  /** Trailing indicator text (high end). */
  more: string;
}

/** Localized strings for SnBackTop. */
export interface SnBackTopLocale {
  /** The button `aria-label`. */
  backToTop: string;
}

/** Localized strings for SnDrawer. */
export interface SnDrawerLocale {
  /** Vertical drawer drag handle `aria-label`. */
  resizeVertical: string;
  /** Horizontal drawer drag handle `aria-label`. */
  resizeHorizontal: string;
}

/** Localized strings for SnAvatarGroup. */
export interface SnAvatarGroupLocale {
  /** Overflow indicator `aria-label`, `{count}` is the hidden avatar count. */
  rest: string;
}

/** Localized strings for SnPopconfirm. */
export interface SnPopconfirmLocale {
  /** Default cancel button label (prop `negative-text` overrides). */
  negativeText: string;
  /** Default confirm button label (prop `positive-text` overrides). */
  positiveText: string;
}

/**
 * Locale contract for @snui/vue-web — `zhCN` / `enUS` ship complete
 * translations; custom locales may omit whole namespaces (per-namespace
 * fallback to zhCN, see `use-locale.ts`).
 */
export interface SnLocale {
  /** Locale identifier, e.g. `'zh-CN'`. */
  name: string;
  /** Strings shared by several components. */
  Common: SnCommonLocale;
  /** SnUpload strings. */
  Upload: SnUploadLocale;
  /** SnLog strings. */
  Log: SnLogLocale;
  /** SnVideoControls / SnVideoPreview strings. */
  VideoControls: SnVideoControlsLocale;
  /** SnDatePicker strings. */
  DatePicker: SnDatePickerLocale;
  /** SnPagination strings. */
  Pagination: SnPaginationLocale;
  /** SnCalendar strings. */
  Calendar: SnCalendarLocale;
  /** SnTransfer strings. */
  Transfer: SnTransferLocale;
  /** SnDataTable strings. */
  DataTable: SnDataTableLocale;
  /** SnTree strings. */
  Tree: SnTreeLocale;
  /** Shared empty-state strings. */
  Empty: SnEmptyLocale;
  /** SnQrCode strings. */
  QrCode: SnQrCodeLocale;
  /** SnHeatmap strings. */
  Heatmap: SnHeatmapLocale;
  /** SnBackTop strings. */
  BackTop: SnBackTopLocale;
  /** SnDrawer strings. */
  Drawer: SnDrawerLocale;
  /** SnAvatarGroup strings. */
  AvatarGroup: SnAvatarGroupLocale;
  /** SnPopconfirm strings. */
  Popconfirm: SnPopconfirmLocale;
}

/** Built-in Chinese (Simplified) locale — values mirror the pre-locale UI. */
export const zhCN: SnLocale = {
  name: 'zh-CN',
  Common: {
    close: '关闭',
  },
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
    playVideo: '播放视频',
    zoomIn: '放大预览',
  },
  DatePicker: {
    weekdays: ['一', '二', '三', '四', '五', '六', '日'],
    months: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
    monthTitle: '{y}年{m}月',
    yearTitle: '{y}年',
    placeholder: '请选择日期',
    rangeStartPlaceholder: '开始日期',
    rangeEndPlaceholder: '结束日期',
    to: '至',
    startTime: '开始时间',
    endTime: '结束时间',
    confirm: '确认',
    hour: '小时',
    minute: '分钟',
    second: '秒',
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
    jumpLabel: '跳至',
    itemsPerPage: '条/页',
  },
  Calendar: {
    monthTitle: '{y}年{m}月',
    weekdays: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
    prevMonth: '上个月',
    nextMonth: '下个月',
    gridLabel: '日历',
    today: '今天',
  },
  Transfer: {
    selectAll: '全选 {title}',
    searchPlaceholder: '请搜索',
    filterSource: '过滤源列表',
    filterTarget: '过滤目标列表',
    moveSelectedRight: '右移选中项',
    moveAllRight: '全部右移',
    moveSelectedLeft: '左移选中项',
    moveAllLeft: '全部左移',
  },
  DataTable: {
    confirm: '确认',
    reset: '重置',
  },
  Tree: {
    collapse: '收起',
    expand: '展开',
  },
  Empty: {
    description: '无数据',
  },
  QrCode: {
    download: '下载二维码',
  },
  Heatmap: {
    less: '少',
    more: '多',
  },
  BackTop: {
    backToTop: '回到顶部',
  },
  Drawer: {
    resizeVertical: '拖拽调整高度',
    resizeHorizontal: '拖拽调整宽度',
  },
  AvatarGroup: {
    rest: '还有 {count} 个头像',
  },
  Popconfirm: {
    negativeText: '取消',
    positiveText: '确定',
  },
};
