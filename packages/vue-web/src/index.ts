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