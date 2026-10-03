/**
 * @snui/vue-web — Web-end UI component library for Vue 3.
 *
 * Public API surface (v0.1.0):
 *   - Named exports for each component (tree-shakeable)
 *   - Default export for full install (`app.use(SnUI)`)
 *   - `SnUIResolver` exposed via `./resolver` for unplugin-vue-components
 *
 * Per AGENTS.md §14, public API is explicit / stable / minimal / testable /
 * extensible. No internal helpers leak.
 */

export { default as SnButton } from './button/SnButton.vue'

export { SnUI, default } from './install.js'
export type { SnUIOptions } from './install.js'

// Re-export commonly needed token utilities for app-level theme overrides.
export { snCssVars, snVarName, auiVarName } from '@snui/tokens'
export type { SnCssVarsOptions } from '@snui/tokens'
