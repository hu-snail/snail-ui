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
export { default as SnButton } from './components/sn-button/sn-button.vue'
export { default as SnConfigProvider } from './components/sn-config-provider/sn-config-provider.vue'
export { default as SnDivider } from './components/sn-divider/sn-divider.vue'
export { default as SnForm } from './components/sn-form/sn-form.vue'
export { default as SnFormItem } from './components/sn-form/sn-form-item.vue'
export { default as SnIcon } from './components/sn-icon/sn-icon.vue'
export type { IconData } from './components/sn-icon/sn-icon.vue'
export { default as SnInput } from './components/sn-input/sn-input.vue'
export type {
  FormRule,
  FormRules,
  FormContext,
  FormItemHandle,
} from './components/sn-form/sn-form-types'

// Uni-end icon name registry (mirrors web-end API surface).
export {
  registerSnIcons,
  clearSnIcons,
  resolveIconByName,
} from './components/sn-icon/sn-icon-registry'

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
} from './components/sn-icon/sn-icon-set'

// Re-export token utilities for app-level theme overrides.
export { snCssVars, snVarName, auiVarName } from '@snui/tokens'
export type { SnCssVarsOptions } from '@snui/tokens'