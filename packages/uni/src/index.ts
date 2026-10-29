/**
 * @snui/uni — uni-app multi-end UI component library.
 *
 * Public API surface (v0.2.0 — AUI-FOUND-003):
 *   - All components are auto-registered via easycom (no manual import needed)
 *   - This index.ts is the npm package entry point; explicit imports still work
 *
 * Per AGENTS.md §14, public API is explicit / stable / minimal / testable.
 */

// Named component exports (for explicit import usage outside easycom contexts).
//
// This barrel is the package public API surface (AGENTS.md §14). Every SFC
// under src/components is listed here in alphabetical order, so a consumer
// never has to guess whether a component is reachable from the package root.
// has to guess whether a component is reachable from the package root. easycom
// registration is unaffected — it resolves the SFC path directly.
export { default as SnActionSheet } from './components/sn-action-sheet/sn-action-sheet.vue';
export { default as SnAvatar } from './components/sn-avatar/sn-avatar.vue';
export { default as SnBacktop } from './components/sn-backtop/sn-backtop.vue';
export { default as SnBadge } from './components/sn-badge/sn-badge.vue';
export { default as SnBarcode } from './components/sn-barcode/sn-barcode.vue';
export { default as SnButton } from './components/sn-button/sn-button.vue';
export { default as SnCalendar } from './components/sn-calendar/sn-calendar.vue';
export { default as SnCalendarView } from './components/sn-calendar-view/sn-calendar-view.vue';
export { default as SnCard } from './components/sn-card/sn-card.vue';
export { default as SnCascader } from './components/sn-cascader/sn-cascader.vue';
export { default as SnCell } from './components/sn-cell/sn-cell.vue';
export { default as SnCellGroup } from './components/sn-cell/sn-cell-group.vue';
export { default as SnCheckbox } from './components/sn-checkbox/sn-checkbox.vue';
export { default as SnCheckboxGroup } from './components/sn-checkbox/sn-checkbox-group.vue';
export { default as SnCircle } from './components/sn-circle/sn-circle.vue';
export { default as SnCol } from './components/sn-layout/sn-col.vue';
export { default as SnCollapse } from './components/sn-collapse/sn-collapse.vue';
export { default as SnCollapseItem } from './components/sn-collapse/sn-collapse-item.vue';
export { default as SnConfigProvider } from './components/sn-config-provider/sn-config-provider.vue';
export { default as SnCountDown } from './components/sn-count-down/sn-count-down.vue';
export { default as SnCountTo } from './components/sn-count-to/sn-count-to.vue';
export { default as SnCurtain } from './components/sn-curtain/sn-curtain.vue';
export { default as SnDateStrip } from './components/sn-date-strip/sn-date-strip.vue';
export { default as SnDatetimePicker } from './components/sn-datetime-picker/sn-datetime-picker.vue';
export { default as SnDatetimePickerView } from './components/sn-datetime-picker-view/sn-datetime-picker-view.vue';
export { default as SnDialer } from './components/sn-dialer/sn-dialer.vue';
export { default as SnDialog } from './components/sn-dialog/sn-dialog.vue';
export { default as SnDivider } from './components/sn-divider/sn-divider.vue';
export { default as SnDropMenu } from './components/sn-drop-menu/sn-drop-menu.vue';
export { default as SnEmpty } from './components/sn-empty/sn-empty.vue';
export { default as SnFab } from './components/sn-fab/sn-fab.vue';
export { default as SnFitSwiper } from './components/sn-fit-swiper/sn-fit-swiper.vue';
export type {
  SnFitSwiperIndicator,
  SnFitSwiperPage,
} from './components/sn-fit-swiper/sn-fit-swiper.vue';
export { default as SnFloatingPanel } from './components/sn-floating-panel/sn-floating-panel.vue';
export { default as SnForm } from './components/sn-form/sn-form.vue';
export { default as SnFormItem } from './components/sn-form/sn-form-item.vue';
export { default as SnGap } from './components/sn-gap/sn-gap.vue';
export { default as SnGrid } from './components/sn-grid/sn-grid.vue';
export { default as SnGridItem } from './components/sn-grid/sn-grid-item.vue';
export { default as SnIcon } from './components/sn-icon/sn-icon.vue';
export { default as SnImagePreview } from './components/sn-image-preview/sn-image-preview.vue';
export { default as SnImg } from './components/sn-img/sn-img.vue';
export { default as SnImgCropper } from './components/sn-img-cropper/sn-img-cropper.vue';
export { default as SnIndexAnchor } from './components/sn-index-bar/sn-index-anchor.vue';
export { default as SnIndexBar } from './components/sn-index-bar/sn-index-bar.vue';
export { default as SnInput } from './components/sn-input/sn-input.vue';
export { default as SnInputNumber } from './components/sn-input-number/sn-input-number.vue';
export { default as SnKeyboard } from './components/sn-keyboard/sn-keyboard.vue';
export { default as SnLayout } from './components/sn-layout/sn-layout.vue';
export { default as SnLiquid } from './components/sn-liquid/sn-liquid.vue';
export { default as SnLoading } from './components/sn-loading/sn-loading.vue';
export { default as SnLoadmore } from './components/sn-loadmore/sn-loadmore.vue';
export { default as SnLucky } from './components/sn-lucky/sn-lucky.vue';
export { default as SnNavbar } from './components/sn-navbar/sn-navbar.vue';
export { default as SnNoticeBar } from './components/sn-notice-bar/sn-notice-bar.vue';
export { default as SnNotify } from './components/sn-notify/sn-notify.vue';
export { default as SnOverlay } from './components/sn-overlay/sn-overlay.vue';
export { default as SnPagination } from './components/sn-pagination/sn-pagination.vue';
export { default as SnPaging } from './components/sn-paging/sn-paging.vue';
export { default as SnPasswordInput } from './components/sn-password-input/sn-password-input.vue';
export { default as SnPicker } from './components/sn-picker/sn-picker.vue';
export { default as SnPickerView } from './components/sn-picker-view/sn-picker-view.vue';
export { default as SnPopover } from './components/sn-popover/sn-popover.vue';
export { default as SnPopup } from './components/sn-popup/sn-popup.vue';
export { default as SnProgress } from './components/sn-progress/sn-progress.vue';
export { default as SnQrCode } from './components/sn-qr-code/sn-qr-code.vue';
export { default as SnRadio } from './components/sn-radio/sn-radio.vue';
export { default as SnRadioGroup } from './components/sn-radio/sn-radio-group.vue';
export { default as SnRate } from './components/sn-rate/sn-rate.vue';
export { default as SnResize } from './components/sn-resize/sn-resize.vue';
export { default as SnRichText } from './components/sn-rich-text/sn-rich-text.vue';
export type {
  RichTextErrorEvent,
  RichTextHeading,
  RichTextImageClickEvent,
  RichTextImageLoadEvent,
  RichTextInstance,
  RichTextLinkClickEvent,
  RichTextLoadEvent,
  RichTextMediaEvent,
  RichTextMediaTimeUpdateEvent,
  RichTextScrollToAnchorOptions,
} from './components/sn-rich-text/sn-rich-text-types';
export { default as SnRootPortal } from './components/sn-root-portal/sn-root-portal.vue';
export { default as SnScratchcard } from './components/sn-scratchcard/sn-scratchcard.vue';
export { default as SnSearch } from './components/sn-search/sn-search.vue';
export { default as SnSegmented } from './components/sn-segmented/sn-segmented.vue';
export { default as SnSelectPicker } from './components/sn-select-picker/sn-select-picker.vue';
export { default as SnSidebar } from './components/sn-sidebar/sn-sidebar.vue';
export { default as SnSidebarItem } from './components/sn-sidebar/sn-sidebar-item.vue';
export { default as SnSignature } from './components/sn-signature/sn-signature.vue';
export { default as SnSkeleton } from './components/sn-skeleton/sn-skeleton.vue';
export { default as SnSlider } from './components/sn-slider/sn-slider.vue';
export { default as SnSlideVerify } from './components/sn-slide-verify/sn-slide-verify.vue';
export { default as SnSortButton } from './components/sn-sort-button/sn-sort-button.vue';
export { default as SnStep } from './components/sn-steps/sn-step.vue';
export { default as SnSteps } from './components/sn-steps/sn-steps.vue';
export { default as SnSticky } from './components/sn-sticky/sn-sticky.vue';
export { default as SnSwipeAction } from './components/sn-swipe-action/sn-swipe-action.vue';
export { default as SnSwiper } from './components/sn-swiper/sn-swiper.vue';
export { default as SnSwitch } from './components/sn-switch/sn-switch.vue';
export { default as SnTab } from './components/sn-tabs/sn-tab.vue';
export { default as SnTabbar } from './components/sn-tabbar/sn-tabbar.vue';
export { default as SnTabbarItem } from './components/sn-tabbar/sn-tabbar-item.vue';
export { default as SnTable } from './components/sn-table/sn-table.vue';
export { default as SnTableColumn } from './components/sn-table/sn-table-column.vue';
export { default as SnTabs } from './components/sn-tabs/sn-tabs.vue';
export { default as SnTag } from './components/sn-tag/sn-tag.vue';
export { default as SnText } from './components/sn-text/sn-text.vue';
export { default as SnTextarea } from './components/sn-textarea/sn-textarea.vue';
export { default as SnToast } from './components/sn-toast/sn-toast.vue';
export { default as SnTooltip } from './components/sn-tooltip/sn-tooltip.vue';
export { default as SnTour } from './components/sn-tour/sn-tour.vue';
export { default as SnTransition } from './components/sn-transition/sn-transition.vue';
export { default as SnTyping } from './components/sn-typing/sn-typing.vue';
export { default as SnUpload } from './components/sn-upload/sn-upload.vue';
export { default as SnVideoPreview } from './components/sn-video-preview/sn-video-preview.vue';
export { default as SnWatermark } from './components/sn-watermark/sn-watermark.vue';
export type {
  FormRule,
  FormRules,
  FormContext,
  FormItemHandle,
} from './components/sn-form/sn-form-types';

// Uni-end icon name registry (mirrors web-end API surface).
export {
  registerSnIcons,
  clearSnIcons,
  resolveIconByName,
} from './components/sn-icon/sn-icon-registry';
export type { IconData } from './components/sn-icon/sn-icon.vue';

// Built-in icon catalog — 111 common icons × 7 categories, with zh labels
// and search keywords. String-icon API source of truth for the showcase.
export {
  SN_ICON_CATALOG,
  SN_ICON_CATEGORY_LABELS,
  searchSnIconCatalog,
} from './components/sn-icon/sn-icon-catalog';
export type {
  SnIconCatalogEntry,
  SnIconCategory,
} from './components/sn-icon/sn-icon-catalog';

// Icon source resolution — string `icon` routing, custom providers, and
// the Iconify on-demand loader (configSnIcons({ iconify: false }) disables).
export {
  configSnIcons,
  registerSnIconProvider,
  getSnIconProvider,
  clearSnIconProviders,
  resolveSnIconStringSync,
  SN_ICON_CATALOG_SIZE,
  SnIconSourceError,
} from './components/sn-icon/sn-icon-providers';
export type {
  SnIconProvider,
  SnIconResolveContext,
  SnIconResolveResult,
  SnIconsConfig,
  SnIconSourceErrorCode,
} from './components/sn-icon/sn-icon-providers';
export {
  configSnIconify,
  clearSnIconifyCache,
  buildIconifySvgUrl,
} from './components/sn-icon/sn-icon-iconify';
export type { SnIconifyOptions } from './components/sn-icon/sn-icon-iconify';

// Shortcut icon data set — frozen `IconData` objects keyed by lucide
// icon name. Tree-shakeable: each named import is its own ESM module.
// Consumers add their own icons by extending sn-icon-set.ts (or by
// creating one-file-per-icon under `components/sn-icon/icons/`).
export {
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  ArrowLeft,
  Check,
  X,
  Plus,
  Minus,
  Search,
  Settings,
  User,
  Bell,
  Home,
  Heart,
  Star,
  Trash,
  Edit,
  Download,
  Upload,
  Menu,
  MoreHorizontal,
} from './components/sn-icon/sn-icon-set';

// Re-export token utilities for app-level theme overrides.
export { snCssVars, snVarName, auiVarName } from '@snui/tokens';
export type { SnCssVarsOptions } from '@snui/tokens';
