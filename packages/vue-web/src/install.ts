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
import SnLoading from './loading/SnLoading.vue'
import SnMenu from './menu/SnMenu.vue'
import SnSkeleton from './skeleton/SnSkeleton.vue'
import SnTooltip from './tooltip/SnTooltip.vue'
import SnTabs from './tabs/SnTabs.vue'
import SnTabPane from './tabs/SnTabPane.vue'
import SnSteps from './steps/SnSteps.vue'
import SnStep from './steps/SnStep.vue'

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
  { name: 'SnDivider', component: SnDivider },
  { name: 'SnForm', component: SnForm },
  { name: 'SnFormItem', component: SnFormItem },
  { name: 'SnGrid', component: SnGrid },
  { name: 'SnIcon', component: SnIcon },
  { name: 'SnInput', component: SnInput },
  { name: 'SnLoading', component: SnLoading },
  { name: 'SnMenu', component: SnMenu },
  { name: 'SnSkeleton', component: SnSkeleton },
  { name: 'SnStep', component: SnStep },
  { name: 'SnSteps', component: SnSteps },
  { name: 'SnTabPane', component: SnTabPane },
  { name: 'SnTabs', component: SnTabs },
  { name: 'SnTooltip', component: SnTooltip },
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