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

/** Internal: list of public components in @snui/vue-web. */
const PUBLIC_COMPONENTS: ReadonlyArray<string> = [
  'SnButton',
  'SnConfigProvider',
  // Phase 1 additions:
  // 'SnInput', 'SnSwitch', 'SnCheckbox', 'SnRadio',
  // 'SnDialog', 'SnToast', 'SnPopup', 'SnLoading',
  // 'SnAvatar', 'SnBadge', 'SnTag', 'SnCard', 'SnDivider',
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
