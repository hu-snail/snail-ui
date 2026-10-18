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

export { SnUI, default } from './install.js'
export type { SnUIOptions } from './install.js'

// Re-export commonly needed token utilities for app-level theme overrides.
export { snCssVars, snVarName, auiVarName } from '@snui/tokens'
export type { SnCssVarsOptions } from '@snui/tokens'