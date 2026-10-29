/**
 * Ambient declaration for the `uni` global that every uni-app runtime injects
 * (H5 → `window.uni`, MP → AppService global, App → plus bridge wrapper).
 *
 * Scope rule (AGENTS.md §14 — minimal public surface): only the APIs this
 * package calls **statically** may appear here. A static `uni.previewImage(...)`
 * call is what lets the uni-app compiler see the API and bundle it into the
 * production build — a dynamic `globalThis.uni?.previewImage` lookup is
 * invisible to that static analysis and gets tree-shaken away, which is
 * exactly how sn-img lost its preview in built H5 output (fixed 2026-06).
 *
 * Do NOT add `@dcloudio/types` on top of this file later — the two global
 * declarations would collide. Extend the shape below instead.
 */
declare const uni: {
  previewImage?: (options: { urls: string[]; current?: string }) => unknown;
};
