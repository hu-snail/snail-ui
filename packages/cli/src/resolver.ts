/**
 * SnUIResolver — unplugin-vue-components resolver (CLI variant).
 *
 * Reads the public component list from @snui/vue-web's resolver module and
 * re-exports it for CLI consumers who only want to install @snui/cli.
 *
 * This avoids forcing consumers to add @snui/vue-web at build time when they
 * only need the resolver; runtime registration still happens through the
 * actual component package.
 */

// Inline type definitions — unplugin-vue-components is a peer dependency
// of @snui/cli, not a direct dependency. Using types from this package at
// compile time would force all CLI consumers to install it.
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

/** Public component tag list — keep in sync with packages/vue-web/src/resolver.ts. */
const PUBLIC_COMPONENTS: ReadonlyArray<string> = [
  'SnButton',
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
