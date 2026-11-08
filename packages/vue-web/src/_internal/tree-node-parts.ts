/**
 * Shared rendering helpers for SnTree / SnTreeSelect node parts.
 *
 * Two problems live here:
 *
 *  1. `{{ vnode }}` must never be used for a dynamic part. Vue's
 *     `toDisplayString` JSON.stringify's plain objects; a VNode carries a
 *     `component -> vnode` cycle, so rendering a VNode through text
 *     interpolation throws "Converting circular structure to JSON" and
 *     takes down the whole component. `SnTreePart` renders the value as a
 *     VNodeChild instead.
 *
 *  2. Data-level icons can arrive as a registry name, a component, a VNode,
 *     an array of them, or a zero-arg render fn. `resolveTreeIcon`
 *     normalizes all of those into a single VNodeChild.
 */

import {
  defineComponent,
  h,
  isVNode,
  type Component,
  type PropType,
  type VNodeChild,
} from 'vue';
import SnIcon from '../icon/SnIcon.vue';
import { resolveIconByName } from '../icon/sn-icon-registry';

/**
 * Renders text, a VNode, an array of VNodes or null without stringifying it.
 * Used for `prefix` / `suffix` / `icon` in both tree components.
 */
export const SnTreePart = defineComponent({
  name: 'SnTreePart',
  props: {
    content: { type: null as unknown as PropType<VNodeChild>, default: null },
  },
  setup(props) {
    return (): VNodeChild => props.content;
  },
});

/**
 * Normalize a raw `icon` option value.
 *
 * - `string`: a registered SnIcon name (see `registerSnIcons`); an
 *   unregistered name falls back to plain text so a typo never blanks a row.
 * - `function`: an icon component or a zero-arg render fn — both are valid
 *   functional components for `h()`.
 * - `VNode` / `VNode[]` / primitive: rendered as-is.
 * - component definition object: mounted through `h()`.
 */
export function resolveTreeIcon(icon: unknown): VNodeChild {
  if (icon === undefined || icon === null || typeof icon === 'boolean') return null;
  if (typeof icon === 'string') {
    return resolveIconByName(icon) !== undefined
      ? h(SnIcon, { name: icon, size: 14 })
      : icon;
  }
  if (typeof icon === 'number') return icon;
  if (typeof icon === 'function') return h(icon as Component);
  if (isVNode(icon)) return icon;
  if (Array.isArray(icon)) return icon as VNodeChild;
  if (typeof icon === 'object') return h(icon as Component);
  return null;
}
