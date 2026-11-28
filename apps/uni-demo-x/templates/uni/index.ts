// gen-x: source packages/templates/src/uni/index.ts sha256:7f979112c45f3271 —— 生成产物勿手改；源码改动后重跑 pnpm -F @snui/uni-demo-x gen
/**
 * `@snui/templates/uni` — uni-app template barrel.
 *
 * Importing this pulls every uni template. For a single page prefer the
 * per-template subpath (`@snui/templates/uni/chat`) so the bundle only carries
 * the page actually mounted.
 */

export { default as SnAiChat } from './sn-ai-chat.uvue';
export { default as SnAiMessage } from './sn-ai-message.uvue';
export type { SnAiRunTurn } from './sn-ai-chat.uvue';
