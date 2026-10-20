/**
 * @snui/vue-web — Web-end UI component library for Vue 3.
 *
 * Public API surface (v0.2.0 — AUI-FOUND-003 / AUI-FOUND-004):
 *   - Named exports for each component (tree-shakeable)
 *   - Default export for full install (`app.use(SnUI)`)
 *   - `SnUIResolver` exposed via `./resolver` for unplugin-vue-components
 *
 * Per AGENTS.md §14, public API is explicit / stable / minimal / testable /
 * extensible. No internal helpers leak.
 */

export { default as SnButton } from './button/SnButton.vue'
export { default as SnAlert } from './alert/SnAlert.vue'
export { default as SnAffix } from './affix/SnAffix.vue'
export type { SnAffixScrollTarget } from './affix/SnAffix.vue'
export { default as SnAnchor } from './anchor/SnAnchor.vue'
export { default as SnAnchorLink } from './anchor/SnAnchorLink.vue'
export { default as SnBackTop } from './back-top/SnBackTop.vue'
export { default as SnCard } from './card/SnCard.vue'
export { default as SnCollapse } from './collapse/SnCollapse.vue'
export { default as SnCollapseItem } from './collapse/SnCollapseItem.vue'
export { default as SnConfigProvider } from './config-provider/SnConfigProvider.vue'
export { default as SnDivider } from './divider/SnDivider.vue'
export { default as SnForm } from './form/SnForm.vue'
export { default as SnFormItem } from './form/SnFormItem.vue'
export { default as SnGrid } from './grid/SnGrid.vue'
export { default as SnIcon } from './icon/SnIcon.vue'
export { default as SnInput } from './input/SnInput.vue'
export { default as SnCheckbox } from './checkbox/SnCheckbox.vue'
export { default as SnCheckboxGroup } from './checkbox/SnCheckboxGroup.vue'
export type { SnCheckboxValue, SnCheckboxGroupOption } from './checkbox/sn-checkbox-types'
export { default as SnRadio } from './radio/SnRadio.vue'
export { default as SnRadioButton } from './radio/SnRadioButton.vue'
export { default as SnRadioGroup } from './radio/SnRadioGroup.vue'
export type { SnRadioValue, SnRadioOption } from './radio/sn-radio-types'
export { default as SnSwitch } from './switch/SnSwitch.vue'
export { default as SnSlider } from './slider/SnSlider.vue'
export { default as SnRate } from './rate/SnRate.vue'
export { default as SnInputNumber } from './input-number/SnInputNumber.vue'
export { default as SnSelect } from './select/SnSelect.vue'
export { default as SnOption } from './select/SnOption.vue'
export type {
  SnSelectValue,
  SnSelectOptionInput,
  SnSelectLeafOption,
  SnSelectGroupOption,
  SnSelectFilter,
} from './select/sn-select-types'
export { default as SnAutoComplete } from './auto-complete/SnAutoComplete.vue'
export type {
  SnAutoCompleteOption,
  SnAutoCompleteRawOption,
  SnAutoCompleteGetShow,
} from './auto-complete/sn-auto-complete-types'
export { default as SnDynamicInput } from './dynamic-input/SnDynamicInput.vue'
export { default as SnDynamicTags } from './dynamic-tags/SnDynamicTags.vue'
export { default as SnTimePicker } from './time-picker/SnTimePicker.vue'
export type { SnTimePickerFormat } from './time-picker/sn-time-picker-types'
export { default as SnCascader } from './cascader/SnCascader.vue'
export type {
  SnCascaderValue,
  SnCascaderOptionInput,
  SnCascaderNode,
} from './cascader/sn-cascader-types'
export { default as SnTreeSelect } from './tree-select/SnTreeSelect.vue'
export type {
  SnTreeSelectValue,
  SnTreeSelectOptionInput,
  SnTreeSelectNode,
} from './tree-select/sn-tree-select-types'
export { default as SnMention } from './mention/SnMention.vue'
export type { SnMentionOption, SnMentionRawOption } from './mention/sn-mention-types'
export { default as SnUpload } from './upload/SnUpload.vue'
export type {
  SnUploadStatus,
  SnUploadListType,
  SnUploadFile,
  SnUploadCustomRequest,
  SnUploadBeforeUpload,
} from './upload/sn-upload-types'
export { default as SnDatePicker } from './date-picker/SnDatePicker.vue'
export type {
  SnDatePickerType,
  SnDateValue,
  SnDateRangeValue,
} from './date-picker/sn-date-picker-types'
export { default as SnColorPicker } from './color-picker/SnColorPicker.vue'
export type { SnColorPickerMode } from './color-picker/sn-color-picker-types'
export { default as SnText } from './text/SnText.vue'
export { default as SnTitle } from './text/SnTitle.vue'
export { default as SnParagraph } from './text/SnParagraph.vue'
export { default as SnAvatar } from './avatar/SnAvatar.vue'
export { default as SnTag } from './tag/SnTag.vue'
export { default as SnSpace } from './space/SnSpace.vue'
export { default as SnFlex } from './flex/SnFlex.vue'
export { default as SnLayout } from './layout/SnLayout.vue'
export { default as SnLayoutHeader } from './layout/SnLayoutHeader.vue'
export { default as SnLayoutContent } from './layout/SnLayoutContent.vue'
export { default as SnLayoutFooter } from './layout/SnLayoutFooter.vue'
export { default as SnLayoutSider } from './layout/SnLayoutSider.vue'
export type { SnLayoutPosition, SnLayoutStyleValue } from './layout/sn-layout-types'
export { default as SnSplitter } from './splitter/SnSplitter.vue'
export { default as SnSplitterPanel } from './splitter/SnSplitterPanel.vue'
export type { SnSplitterDirection } from './splitter/splitter-context'
export { default as SnDropdown } from './dropdown/SnDropdown.vue'
export type {
  SnDropdownOption,
  SnDropdownMenuNode,
  SnDropdownKey,
  SnDropdownPlacement,
  SnDropdownTrigger,
} from './dropdown/sn-dropdown-types'
export { default as SnLoading } from './loading/SnLoading.vue'
export { default as SnDialog } from './dialog/SnDialog.vue'
export type { SnDialogIconPlacement, SnDialogType } from './dialog/SnDialog.vue'
export { default as SnDrawer } from './drawer/SnDrawer.vue'
export type { SnDrawerPlacement } from './drawer/SnDrawer.vue'
export { default as SnDrawerContent } from './drawer/SnDrawerContent.vue'
export type { SnDrawerApi } from './drawer/drawer-context'
export { default as SnMenu } from './menu/SnMenu.vue'
export type { SnMenuOption } from './menu/SnMenu.vue'
export { default as SnSkeleton } from './skeleton/SnSkeleton.vue'
export { default as SnSteps } from './steps/SnSteps.vue'
export { default as SnStep } from './steps/SnStep.vue'
export { default as SnTabs } from './tabs/SnTabs.vue'
export { default as SnTabPane } from './tabs/SnTabPane.vue'
export { default as SnBreadcrumb } from './breadcrumb/SnBreadcrumb.vue'
export { default as SnBreadcrumbItem } from './breadcrumb/SnBreadcrumbItem.vue'
export { default as SnTooltip } from './tooltip/SnTooltip.vue'
export type { SnTooltipPlacement } from './tooltip/SnTooltip.vue'
export type {
  FormRule,
  FormRules,
  FormContext,
  FormItemHandle,
} from './form/sn-form-types'
export {
  registerSnIcons,
  clearSnIcons,
  resolveIconByName,
} from './icon/sn-icon-registry'
export type {
  IconComponent,
  IconComponentProps,
} from './icon/sn-icon-registry'

// Data Display 数据展示 — mirrors naive-ui's data-display category
// (batch AUI-WEB-DD-001..021, see dev-docs/SNUI-WBS-v3.1.md).
export { default as SnCalendar } from './calendar/SnCalendar.vue'
export { default as SnCarousel } from './carousel/SnCarousel.vue'
export { default as SnCarouselItem } from './carousel/SnCarouselItem.vue'
export type {
  CarouselArrowSlotProps,
  CarouselDotSlotProps,
} from './carousel/SnCarousel.vue'
export { default as SnCode } from './code/SnCode.vue'
export { default as SnComment } from './comment/SnComment.vue'
export type { SnCommentAlign } from './comment/SnComment.vue'
export { default as SnCountdown } from './countdown/SnCountdown.vue'
export { default as SnDataTable } from './data-table/SnDataTable.vue'
export type {
  DataTableRowKey,
  DataTableRowData,
  DataTableColumn,
  DataTableColumns,
  DataTableSortOrder,
  DataTableSortState,
  DataTableFilterOption,
  DataTableFilterState,
  DataTableCompareFn,
  DataTableCreateSummary,
  DataTableSummaryCell,
  DataTableSummaryRow,
  DataTablePagination,
} from './data-table/sn-data-table-types'
export { default as SnDescriptions } from './descriptions/SnDescriptions.vue'
export { default as SnDescriptionsItem } from './descriptions/SnDescriptionsItem.vue'
export { default as SnEmpty } from './empty/SnEmpty.vue'
export { default as SnEquation } from './equation/SnEquation.vue'
export type { SnEquationKatex } from './equation/sn-equation-types'
export { default as SnHeatmap } from './heatmap/SnHeatmap.vue'
export type {
  SnHeatmapTooltipConfig,
  SnHeatmapTooltipDay,
} from './heatmap/heatmap-tooltip'
export { default as SnHighlight } from './highlight/SnHighlight.vue'
export { default as SnImage } from './image/SnImage.vue'
export { default as SnImageGroup } from './image/SnImageGroup.vue'
export { default as SnInfiniteScroll } from './infinite-scroll/SnInfiniteScroll.vue'
export { default as SnList } from './list/SnList.vue'
export { default as SnListItem } from './list/SnListItem.vue'
export { default as SnLog } from './log/SnLog.vue'
export { default as SnNumberAnimation } from './number-animation/SnNumberAnimation.vue'
export { default as SnQrCode } from './qr-code/SnQrCode.vue'
export { default as SnStatistic } from './statistic/SnStatistic.vue'
export { default as SnTable } from './table/SnTable.vue'
export { default as SnThing } from './thing/SnThing.vue'
export { default as SnTime } from './time/SnTime.vue'
export { default as SnTimeline } from './timeline/SnTimeline.vue'
export { default as SnTimelineItem } from './timeline/SnTimelineItem.vue'
export { default as SnTree } from './tree/SnTree.vue'
export type {
  SnTreeKey,
  SnTreeFieldNames,
  SnTreeOption,
  SnTreeRenderProps,
  SnTreeNode,
} from './tree/sn-tree-types'

// Popover 弹层家族 (AUI-WEB-FB-009..011)
export { default as SnPopover } from './popover/SnPopover.vue'
export type { SnPopoverPlacement } from './popover/SnPopover.vue'
export { default as SnPopconfirm } from './popconfirm/SnPopconfirm.vue'
export type {
  SnPopconfirmPlacement,
  SnPopconfirmActionReturn,
} from './popconfirm/SnPopconfirm.vue'
export { default as SnPopselect } from './popselect/SnPopselect.vue'
export type {
  SnPopselectValue,
  SnPopselectLeafOption,
  SnPopselectGroupOption,
  SnPopselectMenuNode,
  SnPopselectRenderLabel,
  SnPopselectRenderOption,
} from './popselect/sn-popselect-types'

// Feedback 反馈补充 (AUI-WEB-FB-012/013) — Provider + composable API
export { default as SnNotificationProvider } from './notification/SnNotificationProvider.vue'
export { default as SnNotification } from './notification/SnNotification.vue'
export { useNotification } from './notification/use-notification'
export type {
  NotificationType,
  NotificationPlacement,
  NotificationOptions,
  NotificationReactive,
  NotificationApi,
} from './notification/notification-types'
export { default as SnLoadingBarProvider } from './loading-bar/SnLoadingBarProvider.vue'
export { useLoadingBar } from './loading-bar/use-loading-bar'
export type { LoadingBarApi } from './loading-bar/loading-bar-types'

// Data Display 补充 (AUI-WEB-DD-024..029)
export { default as SnProgress } from './progress/SnProgress.vue'
export type {
  SnProgressType,
  SnProgressStatus,
  SnProgressIndicatorPlacement,
  SnProgressGradientStop,
} from './progress/SnProgress.vue'
export { default as SnWatermark } from './watermark/SnWatermark.vue'
export { default as SnEllipsis } from './ellipsis/SnEllipsis.vue'
export type { SnEllipsisTooltipOptions } from './ellipsis/SnEllipsis.vue'
export { default as SnAvatarGroup } from './avatar-group/SnAvatarGroup.vue'
export type { SnAvatarGroupMaxOptions } from './avatar-group/SnAvatarGroup.vue'
export { default as SnPageHeader } from './page-header/SnPageHeader.vue'
export { default as SnLink } from './link/SnLink.vue'
export { default as SnVirtualList } from './virtual-list/SnVirtualList.vue'

// Navigation / Form 补充 (AUI-WEB-NAV-009 / AUI-WEB-FORM-017)
export { default as SnPagination } from './pagination/SnPagination.vue'
export { default as SnTransfer } from './transfer/SnTransfer.vue'

// 追加批次 (AUI-WEB-FB-015 / DD-030..032): 悬浮按钮 / 瀑布流 / 视频预览 / 跑马灯
export { default as SnFloatButton } from './float-button/SnFloatButton.vue'
export { default as SnFloatButtonGroup } from './float-button/SnFloatButtonGroup.vue'
export { default as SnWaterfall } from './waterfall/SnWaterfall.vue'
export { default as SnVideoPreview } from './video-preview/SnVideoPreview.vue'
export { default as SnMarquee } from './marquee/SnMarquee.vue'

export { SnUI, default } from './install.js'
export type { SnUIOptions } from './install.js'

// Re-export commonly needed token utilities for app-level theme overrides.
export { snCssVars, snVarName, auiVarName } from '@snui/tokens'
export type { SnCssVarsOptions } from '@snui/tokens'