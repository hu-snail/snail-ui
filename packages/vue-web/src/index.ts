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
export { default as SnConfigProvider } from './config-provider/SnConfigProvider.vue'
export { default as SnDivider } from './divider/SnDivider.vue'
export { default as SnIcon } from './icon/SnIcon.vue'
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