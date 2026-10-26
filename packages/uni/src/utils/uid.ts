/**
 * Monotonic id generator for components that need a stable per-instance key
 * (registration ids, DOM ids for `scroll-into-view`).
 *
 * ## Why this is not a `let` inside `<script setup>`
 *
 * Everything declared in `<script setup>` lives inside the component's setup
 * function, so a `let seed = 0` there resets for every instance — every child
 * would get the same id. The counter has to live at module scope, which means
 * its own module (the SFC compiler forbids `export` inside `<script setup>`).
 *
 * Ids are only required to be unique within one app tree, so a plain counter
 * is enough; no random / timestamp component is needed.
 */

let seed = 0;

/** Return the next id in the sequence. */
export function nextUid(): number {
  seed += 1;
  return seed;
}
