/**
 * `@snui/templates/uni` — uni-app template barrel.
 *
 * Importing this pulls every uni template. For a single page prefer the
 * per-template subpath (`@snui/templates/uni/chat`) so the bundle only carries
 * the page actually mounted.
 */

export { default as SnAiChat } from './sn-ai-chat.vue';
export { default as SnAiMessage } from './sn-ai-message.vue';
export type { SnAiRunTurn } from './sn-ai-chat.vue';
