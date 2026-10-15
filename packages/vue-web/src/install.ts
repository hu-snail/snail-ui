/**
 * SnUI Web install — register all components via `app.use(SnUI)`.
 *
 * Per AGENTS.md §32, Vue components are responsible for rendering only.
 * No schema validation or business logic lives here.
 */

import type { App, Plugin } from 'vue'
import SnButton from './button/SnButton.vue'
import SnAlert from './alert/SnAlert.vue'
import SnConfigProvider from './config-provider/SnConfigProvider.vue'
import SnTooltip from './tooltip/SnTooltip.vue'
import SnTabs from './tabs/SnTabs.vue'
import SnTabPane from './tabs/SnTabPane.vue'
import SnSteps from './steps/SnSteps.vue'
import SnStep from './steps/SnStep.vue'

export interface SnUIOptions {
  /** Skip auto-registration of specific components. */
  exclude?: ReadonlyArray<string>
}

const COMPONENTS: ReadonlyArray<{ name: string; component: unknown }> = [
  { name: 'SnButton', component: SnButton },
  { name: 'SnAlert', component: SnAlert },
  { name: 'SnConfigProvider', component: SnConfigProvider },
  { name: 'SnTooltip', component: SnTooltip },
  { name: 'SnTabs', component: SnTabs },
  { name: 'SnTabPane', component: SnTabPane },
  { name: 'SnSteps', component: SnSteps },
  { name: 'SnStep', component: SnStep },
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