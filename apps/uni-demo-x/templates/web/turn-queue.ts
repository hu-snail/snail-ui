/**
 * `@snui/templates/web/turn-queue` — the turn engine on its own.
 *
 * Exposed so a host can assemble a page from the leaf templates
 * (`/message-list`, `/prompt`, `/model-config`) and wire scheduling exactly the
 * way `SnAiChat` and `SnAiAssistant` do, instead of re-implementing the queue,
 * the stream fold and the abort contract.
 *
 * The two page templates mount this same engine, so an assembled page behaves
 * identically to them by construction.
 */
export { useAiTurnQueue } from './use-ai-turn-queue';
export type {
  AiTurnQueue,
  AiTurnQueueHooks,
  AiTurnQueueOptions,
  SnAiRunTurn,
} from './use-ai-turn-queue';
