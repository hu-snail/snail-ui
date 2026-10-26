/**
 * `@snui/templates/web/chat` — the AI conversation page alone.
 *
 * Per-template subpath exports are how on-demand loading works: importing this
 * pulls the chat page and its dependencies, not the whole template library.
 */
export { default as SnAiChat } from './SnAiChat.vue'
export type { SnAiRunTurn } from './SnAiChat.vue'
