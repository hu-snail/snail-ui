/**
 * Normalize a default slot into a vnode array.
 *
 * H5 / App (vue runtime): `slots.default` is a render function — call it.
 * WeChat MP (uni-mp-vue): slot content arrives pre-rendered as an array of
 * vnodes, so the compiled `slots.default?.()` becomes an optional call on a
 * non-function and throws `_a.call is not a function`. That crash killed the
 * `totalCount` computed and with it the whole group render on MP.
 */
export function resolveSlotNodes(slot: unknown): unknown[] {
  if (typeof slot === 'function') {
    const nodes: unknown = (slot as () => unknown)();
    return Array.isArray(nodes) ? nodes : nodes == null ? [] : [nodes];
  }
  return Array.isArray(slot) ? slot : [];
}
