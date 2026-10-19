/**
 * @snui/templates — public entry (both ends).
 *
 * Per AGENTS.md §14 the public surface is explicit and minimal. Templates are
 * grouped by end because they are end-specific renderers: `./web/*` composes
 * @snui/vue-web, `./uni/*` composes @snui/uni. The shared contract types and
 * stream helpers are re-exported here so a host can build a transcript without
 * importing either end.
 */

export * from './shared/index'
