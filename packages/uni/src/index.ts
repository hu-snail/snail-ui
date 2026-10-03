/**
 * @snui/uni — uni-app multi-end UI component library.
 *
 * Public API surface (v0.1.0):
 *   - All components are auto-registered via easycom (no manual import needed)
 *   - This index.ts is the npm package entry point; explicit imports still work
 *
 * Per AGENTS.md §14, public API is explicit / stable / minimal / testable.
 */

// Named component exports (for explicit import usage outside easycom contexts).
export { default as SnButton } from './components/sn-button/sn-button.vue'

// Re-export token utilities for app-level theme overrides.
export { snCssVars, snVarName, auiVarName } from '@snui/tokens'
export type { SnCssVarsOptions } from '@snui/tokens'
