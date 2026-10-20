/**
 * SnUI Web install — register all components via `app.use(SnUI)`.
 *
 * Per AGENTS.md §32, Vue components are responsible for rendering only.
 * No schema validation or business logic lives here.
 */

import type { App, Plugin } from 'vue'
import SnButton from './button/SnButton.vue'
import SnAlert from './alert/SnAlert.vue'
import SnAffix from './affix/SnAffix.vue'
import SnAnchor from './anchor/SnAnchor.vue'
import SnAnchorLink from './anchor/SnAnchorLink.vue'
import SnBackTop from './back-top/SnBackTop.vue'
import SnBreadcrumb from './breadcrumb/SnBreadcrumb.vue'
import SnBreadcrumbItem from './breadcrumb/SnBreadcrumbItem.vue'
import SnCard from './card/SnCard.vue'
import SnCollapse from './collapse/SnCollapse.vue'
import SnCollapseItem from './collapse/SnCollapseItem.vue'
import SnConfigProvider from './config-provider/SnConfigProvider.vue'
import SnDivider from './divider/SnDivider.vue'
import SnForm from './form/SnForm.vue'
import SnFormItem from './form/SnFormItem.vue'
import SnGrid from './grid/SnGrid.vue'
import SnIcon from './icon/SnIcon.vue'
import SnInput from './input/SnInput.vue'
import SnCheckbox from './checkbox/SnCheckbox.vue'
import SnCheckboxGroup from './checkbox/SnCheckboxGroup.vue'
import SnRadio from './radio/SnRadio.vue'
import SnRadioButton from './radio/SnRadioButton.vue'
import SnRadioGroup from './radio/SnRadioGroup.vue'
import SnSwitch from './switch/SnSwitch.vue'
import SnSlider from './slider/SnSlider.vue'
import SnRate from './rate/SnRate.vue'
import SnInputNumber from './input-number/SnInputNumber.vue'
import SnSelect from './select/SnSelect.vue'
import SnOption from './select/SnOption.vue'
import SnAutoComplete from './auto-complete/SnAutoComplete.vue'
import SnDynamicInput from './dynamic-input/SnDynamicInput.vue'
import SnDynamicTags from './dynamic-tags/SnDynamicTags.vue'
import SnTimePicker from './time-picker/SnTimePicker.vue'
import SnCascader from './cascader/SnCascader.vue'
import SnTreeSelect from './tree-select/SnTreeSelect.vue'
import SnMention from './mention/SnMention.vue'
import SnUpload from './upload/SnUpload.vue'
import SnDatePicker from './date-picker/SnDatePicker.vue'
import SnColorPicker from './color-picker/SnColorPicker.vue'
import SnText from './text/SnText.vue'
import SnTitle from './text/SnTitle.vue'
import SnParagraph from './text/SnParagraph.vue'
import SnAvatar from './avatar/SnAvatar.vue'
import SnTag from './tag/SnTag.vue'
import SnSpace from './space/SnSpace.vue'
import SnFlex from './flex/SnFlex.vue'
import SnLayout from './layout/SnLayout.vue'
import SnLayoutHeader from './layout/SnLayoutHeader.vue'
import SnLayoutContent from './layout/SnLayoutContent.vue'
import SnLayoutFooter from './layout/SnLayoutFooter.vue'
import SnLayoutSider from './layout/SnLayoutSider.vue'
import SnSplitter from './splitter/SnSplitter.vue'
import SnSplitterPanel from './splitter/SnSplitterPanel.vue'
import SnDropdown from './dropdown/SnDropdown.vue'
import SnDialog from './dialog/SnDialog.vue'
import SnDrawer from './drawer/SnDrawer.vue'
import SnDrawerContent from './drawer/SnDrawerContent.vue'
import SnLoading from './loading/SnLoading.vue'
import SnMenu from './menu/SnMenu.vue'
import SnSkeleton from './skeleton/SnSkeleton.vue'
import SnTooltip from './tooltip/SnTooltip.vue'
import SnTabs from './tabs/SnTabs.vue'
import SnTabPane from './tabs/SnTabPane.vue'
import SnSteps from './steps/SnSteps.vue'
import SnStep from './steps/SnStep.vue'
import SnCalendar from './calendar/SnCalendar.vue'
import SnCarousel from './carousel/SnCarousel.vue'
import SnCarouselItem from './carousel/SnCarouselItem.vue'
import SnCode from './code/SnCode.vue'
import SnComment from './comment/SnComment.vue'
import SnCountdown from './countdown/SnCountdown.vue'
import SnDataTable from './data-table/SnDataTable.vue'
import SnDescriptions from './descriptions/SnDescriptions.vue'
import SnDescriptionsItem from './descriptions/SnDescriptionsItem.vue'
import SnEmpty from './empty/SnEmpty.vue'
import SnEquation from './equation/SnEquation.vue'
import SnHeatmap from './heatmap/SnHeatmap.vue'
import SnHighlight from './highlight/SnHighlight.vue'
import SnImage from './image/SnImage.vue'
import SnImageGroup from './image/SnImageGroup.vue'
import SnInfiniteScroll from './infinite-scroll/SnInfiniteScroll.vue'
import SnList from './list/SnList.vue'
import SnListItem from './list/SnListItem.vue'
import SnLog from './log/SnLog.vue'
import SnNumberAnimation from './number-animation/SnNumberAnimation.vue'
import SnQrCode from './qr-code/SnQrCode.vue'
import SnStatistic from './statistic/SnStatistic.vue'
import SnTable from './table/SnTable.vue'
import SnThing from './thing/SnThing.vue'
import SnTime from './time/SnTime.vue'
import SnTimeline from './timeline/SnTimeline.vue'
import SnTimelineItem from './timeline/SnTimelineItem.vue'
import SnTree from './tree/SnTree.vue'
import SnPopover from './popover/SnPopover.vue'
import SnPopconfirm from './popconfirm/SnPopconfirm.vue'
import SnPopselect from './popselect/SnPopselect.vue'
import SnNotificationProvider from './notification/SnNotificationProvider.vue'
import SnNotification from './notification/SnNotification.vue'
import SnLoadingBarProvider from './loading-bar/SnLoadingBarProvider.vue'
import SnProgress from './progress/SnProgress.vue'
import SnWatermark from './watermark/SnWatermark.vue'
import SnEllipsis from './ellipsis/SnEllipsis.vue'
import SnAvatarGroup from './avatar-group/SnAvatarGroup.vue'
import SnPageHeader from './page-header/SnPageHeader.vue'
import SnLink from './link/SnLink.vue'
import SnVirtualList from './virtual-list/SnVirtualList.vue'
import SnPagination from './pagination/SnPagination.vue'
import SnTransfer from './transfer/SnTransfer.vue'
import SnFloatButton from './float-button/SnFloatButton.vue'
import SnFloatButtonGroup from './float-button/SnFloatButtonGroup.vue'
import SnWaterfall from './waterfall/SnWaterfall.vue'
import SnVideoPreview from './video-preview/SnVideoPreview.vue'
import SnMarquee from './marquee/SnMarquee.vue'

export interface SnUIOptions {
  /** Skip auto-registration of specific components. */
  exclude?: ReadonlyArray<string>
}

/**
 * Must stay in sync with the named exports in `index.ts` — a component that
 * ships but is missing here is an unknown custom element for consumers relying
 * on `app.use(SnUI)`. `install.test.ts` asserts the two lists match.
 */
const COMPONENTS: ReadonlyArray<{ name: string; component: unknown }> = [
  { name: 'SnAffix', component: SnAffix },
  { name: 'SnAlert', component: SnAlert },
  { name: 'SnAnchor', component: SnAnchor },
  { name: 'SnAnchorLink', component: SnAnchorLink },
  { name: 'SnBackTop', component: SnBackTop },
  { name: 'SnBreadcrumb', component: SnBreadcrumb },
  { name: 'SnBreadcrumbItem', component: SnBreadcrumbItem },
  { name: 'SnButton', component: SnButton },
  { name: 'SnCard', component: SnCard },
  { name: 'SnCollapse', component: SnCollapse },
  { name: 'SnCollapseItem', component: SnCollapseItem },
  { name: 'SnConfigProvider', component: SnConfigProvider },
  { name: 'SnDialog', component: SnDialog },
  { name: 'SnDivider', component: SnDivider },
  { name: 'SnDrawer', component: SnDrawer },
  { name: 'SnDrawerContent', component: SnDrawerContent },
  { name: 'SnForm', component: SnForm },
  { name: 'SnFormItem', component: SnFormItem },
  { name: 'SnGrid', component: SnGrid },
  { name: 'SnIcon', component: SnIcon },
  { name: 'SnInput', component: SnInput },
  { name: 'SnCheckbox', component: SnCheckbox },
  { name: 'SnCheckboxGroup', component: SnCheckboxGroup },
  { name: 'SnRadio', component: SnRadio },
  { name: 'SnRadioButton', component: SnRadioButton },
  { name: 'SnRadioGroup', component: SnRadioGroup },
  { name: 'SnSwitch', component: SnSwitch },
  { name: 'SnSlider', component: SnSlider },
  { name: 'SnRate', component: SnRate },
  { name: 'SnInputNumber', component: SnInputNumber },
  { name: 'SnSelect', component: SnSelect },
  { name: 'SnOption', component: SnOption },
  { name: 'SnAutoComplete', component: SnAutoComplete },
  { name: 'SnDynamicInput', component: SnDynamicInput },
  { name: 'SnDynamicTags', component: SnDynamicTags },
  { name: 'SnTimePicker', component: SnTimePicker },
  { name: 'SnCascader', component: SnCascader },
  { name: 'SnTreeSelect', component: SnTreeSelect },
  { name: 'SnMention', component: SnMention },
  { name: 'SnUpload', component: SnUpload },
  { name: 'SnDatePicker', component: SnDatePicker },
  { name: 'SnColorPicker', component: SnColorPicker },
  { name: 'SnText', component: SnText },
  { name: 'SnTitle', component: SnTitle },
  { name: 'SnParagraph', component: SnParagraph },
  { name: 'SnAvatar', component: SnAvatar },
  { name: 'SnTag', component: SnTag },
  { name: 'SnSpace', component: SnSpace },
  { name: 'SnFlex', component: SnFlex },
  { name: 'SnLayout', component: SnLayout },
  { name: 'SnLayoutHeader', component: SnLayoutHeader },
  { name: 'SnLayoutContent', component: SnLayoutContent },
  { name: 'SnLayoutFooter', component: SnLayoutFooter },
  { name: 'SnLayoutSider', component: SnLayoutSider },
  { name: 'SnSplitter', component: SnSplitter },
  { name: 'SnSplitterPanel', component: SnSplitterPanel },
  { name: 'SnDropdown', component: SnDropdown },
  { name: 'SnLoading', component: SnLoading },
  { name: 'SnMenu', component: SnMenu },
  { name: 'SnSkeleton', component: SnSkeleton },
  { name: 'SnStep', component: SnStep },
  { name: 'SnSteps', component: SnSteps },
  { name: 'SnTabPane', component: SnTabPane },
  { name: 'SnTabs', component: SnTabs },
  { name: 'SnTooltip', component: SnTooltip },
  // Data Display 数据展示 (AUI-WEB-DD-001..021)
  { name: 'SnCalendar', component: SnCalendar },
  { name: 'SnCarousel', component: SnCarousel },
  { name: 'SnCarouselItem', component: SnCarouselItem },
  { name: 'SnCode', component: SnCode },
  { name: 'SnComment', component: SnComment },
  { name: 'SnCountdown', component: SnCountdown },
  { name: 'SnDataTable', component: SnDataTable },
  { name: 'SnDescriptions', component: SnDescriptions },
  { name: 'SnDescriptionsItem', component: SnDescriptionsItem },
  { name: 'SnEmpty', component: SnEmpty },
  { name: 'SnEquation', component: SnEquation },
  { name: 'SnHeatmap', component: SnHeatmap },
  { name: 'SnHighlight', component: SnHighlight },
  { name: 'SnImage', component: SnImage },
  { name: 'SnImageGroup', component: SnImageGroup },
  { name: 'SnInfiniteScroll', component: SnInfiniteScroll },
  { name: 'SnList', component: SnList },
  // Popover 弹层家族 (AUI-WEB-FB-009..011)
  { name: 'SnPopover', component: SnPopover },
  { name: 'SnPopconfirm', component: SnPopconfirm },
  { name: 'SnPopselect', component: SnPopselect },
  // Feedback 反馈补充 (AUI-WEB-FB-012/013)
  { name: 'SnNotificationProvider', component: SnNotificationProvider },
  { name: 'SnNotification', component: SnNotification },
  { name: 'SnLoadingBarProvider', component: SnLoadingBarProvider },
  // Data Display 补充 (AUI-WEB-DD-024..029)
  { name: 'SnProgress', component: SnProgress },
  { name: 'SnWatermark', component: SnWatermark },
  { name: 'SnEllipsis', component: SnEllipsis },
  { name: 'SnAvatarGroup', component: SnAvatarGroup },
  { name: 'SnPageHeader', component: SnPageHeader },
  { name: 'SnLink', component: SnLink },
  { name: 'SnVirtualList', component: SnVirtualList },
  // Navigation / Form 补充 (AUI-WEB-NAV-009 / AUI-WEB-FORM-017)
  { name: 'SnPagination', component: SnPagination },
  { name: 'SnTransfer', component: SnTransfer },
  { name: 'SnListItem', component: SnListItem },
  { name: 'SnLog', component: SnLog },
  { name: 'SnNumberAnimation', component: SnNumberAnimation },
  { name: 'SnQrCode', component: SnQrCode },
  { name: 'SnStatistic', component: SnStatistic },
  { name: 'SnTable', component: SnTable },
  { name: 'SnThing', component: SnThing },
  { name: 'SnTime', component: SnTime },
  { name: 'SnTimeline', component: SnTimeline },
  { name: 'SnTimelineItem', component: SnTimelineItem },
  { name: 'SnTree', component: SnTree },
  // 追加批次 (AUI-WEB-FB-015 / DD-030..032)
  { name: 'SnFloatButton', component: SnFloatButton },
  { name: 'SnFloatButtonGroup', component: SnFloatButtonGroup },
  { name: 'SnWaterfall', component: SnWaterfall },
  { name: 'SnVideoPreview', component: SnVideoPreview },
  { name: 'SnMarquee', component: SnMarquee },
]

export const SnUI: Plugin = {
  install(app: App, options?: SnUIOptions): void {
    const exclude = new Set(options?.exclude ?? [])
    for (const { name, component } of COMPONENTS) {
      if (exclude.has(name)) continue
      app.component(name, component as never)
    }
  },
}

export default SnUI