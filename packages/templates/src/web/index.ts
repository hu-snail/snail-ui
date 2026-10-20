/**
 * @snui/templates/web — web-end template barrel.
 *
 * Importing this pulls every web template. For a single page prefer the
 * per-template subpath (`@snui/templates/web/chat`) so the bundle only carries
 * the page actually mounted.
 */

export { default as SnAiChat } from './SnAiChat.vue'
export { default as SnAiPrompt } from './SnAiPrompt.vue'
export { default as SnAiMessage } from './SnAiMessage.vue'
export { default as SnAiAssistant } from './SnAiAssistant.vue'
export { default as SnAiMessageList } from './SnAiMessageList.vue'
export { default as SnAiThinking } from './SnAiThinking.vue'
export { default as SnModelConfig } from './SnModelConfig.vue'

export { toIconComponent } from './icon-adapter'
