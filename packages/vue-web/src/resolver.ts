/**
 * SnUIResolver — unplugin-vue-components resolver for @snui/vue-web.
 *
 * Auto-registers `<SnButton>` etc. without manual imports.
 *
 * Usage:
 *   import Components from 'unplugin-vue-components/vite'
 *   import { SnUIResolver } from '@snui/vue-web/resolver'
 *
 *   Components({
 *     resolvers: [SnUIResolver()]
 *   })
 *
 * Type-only import for `unplugin-vue-components` (peer dependency). Consumers
 * must install it themselves; we do not force it as a direct dependency to
 * keep `@snui/vue-web` bundle small.
 */

// Type-only import — no runtime dependency on unplugin-vue-components.
// If consumers don't have it installed, they can still use named imports.
type ResolvedComponent = {
  name: string
  from: string
  sideEffects?: string | string[]
}
type ComponentResolver = {
  type: 'component'
  resolve: (name: string) => ResolvedComponent | undefined
}

export interface SnUIResolverOptions {
  /** Library to import from. Default: '@snui/vue-web'. */
  library?: string
}

/**
 * Internal: list of public components in @snui/vue-web.
 *
 * Must stay in sync with the named exports in `index.ts` — a component that is
 * exported but missing here silently fails to auto-import under
 * unplugin-vue-components. `resolver.test.ts` asserts the two lists match.
 */
export const PUBLIC_COMPONENTS: ReadonlyArray<string> = [
  // Basic
  'SnButton',
  'SnConfigProvider',
  'SnDivider',
  'SnIcon',
  // Form
  'SnForm',
  'SnFormItem',
  'SnInput',
  'SnCheckbox',
  'SnCheckboxGroup',
  'SnRadio',
  'SnRadioButton',
  'SnRadioGroup',
  'SnSwitch',
  'SnSlider',
  'SnRate',
  'SnInputNumber',
  // Layout
  'SnCard',
  'SnCollapse',
  'SnCollapseItem',
  'SnGrid',
  // Navigation
  'SnAffix',
  'SnAnchor',
  'SnAnchorLink',
  'SnBackTop',
  'SnBreadcrumb',
  'SnBreadcrumbItem',
  'SnMenu',
  'SnStep',
  'SnSteps',
  'SnTabPane',
  'SnTabs',
  'SnTooltip',
  // Feedback
  'SnAlert',
  'SnDialog',
  'SnDrawer',
  'SnDrawerContent',
  'SnLoading',
  'SnSkeleton',
]

export function SnUIResolver(options: SnUIResolverOptions = {}): ComponentResolver {
  const library = options.library ?? '@snui/vue-web'

  return {
    type: 'component',
    resolve(name: string): ResolvedComponent | undefined {
      if (!PUBLIC_COMPONENTS.includes(name)) return undefined
      return {
        name: 'default',
        from: library,
        sideEffects: `${library}/styles`,
      }
    },
  }
}

export default SnUIResolver
