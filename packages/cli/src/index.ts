/**
 * @snui/cli — public entry.
 *
 * Re-exports resolver (for unplugin-vue-components) and llms.txt generator.
 * Heavy lifting lives in their respective files; this index just wires them.
 */

export { SnUIResolver, type SnUIResolverOptions } from './resolver.js'
export { generateLlmsTxt, type LlmsTxtOptions } from './llms-txt.js'
