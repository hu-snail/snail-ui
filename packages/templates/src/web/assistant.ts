/**
 * `@snui/templates/web/assistant` — the unified AI assistant page.
 *
 * The AI 套件 in one template: the conversation page plus the model-config
 * drawer. Import the narrower subpaths (`/prompt`, `/model-config`,
 * `/message-list`) when only one of those pieces is wanted.
 */
export { default as SnAiAssistant } from './SnAiAssistant.vue'
/** Re-exported so a host can type its runner without a second import. */
export type { SnAiRunTurn } from './SnAiChat.vue'
