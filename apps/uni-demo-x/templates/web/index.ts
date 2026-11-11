/**
 * @snui/templates/web — web-end template barrel.
 *
 * Importing this pulls every web template. For a single page prefer the
 * per-template subpath (`@snui/templates/web/chat`) so the bundle only carries
 * the page actually mounted.
 */

export { default as SnAiChat } from './SnAiChat.uvue';
export { default as SnAiPrompt } from './SnAiPrompt.uvue';
export { default as SnAiMessage } from './SnAiMessage.uvue';
export { default as SnAiAssistant } from './SnAiAssistant.uvue';
export { default as SnAiMessageList } from './SnAiMessageList.uvue';
export { default as SnAiThinking } from './SnAiThinking.uvue';
export { default as SnModelConfig } from './SnModelConfig.uvue';

export { toIconComponent } from './icon-adapter';

/* The turn engine the two page templates assemble their pages around. */
export { useAiTurnQueue } from './use-ai-turn-queue';
export type {
  AiTurnQueue,
  AiTurnQueueHooks,
  AiTurnQueueOptions,
  SnAiRunTurn,
} from './use-ai-turn-queue';
