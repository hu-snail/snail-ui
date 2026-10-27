/**
 * Built-in icon used by SnDragSort (grip handle). Inlined per the
 * sn-dropdown-icons.ts precedent so the package does NOT depend on a
 * third-party icon set, and so this drag-sort module stays self-contained
 * (no shared-file edits).
 *
 * Per AGENTS.md §113: emoji-as-UI-icon is forbidden. Every glyph ships
 * here as a Vue functional component.
 */
import { defineComponent, h } from 'vue';
import type { IconComponent } from '../icon/sn-icon-registry';

/** Six-dot grip — the universal drag-affordance glyph (lucide grip-vertical shape). */
export const GripVerticalIcon: IconComponent = defineComponent({
  name: 'SnBuiltInIcon',
  props: { size: { default: 14 } },
  render() {
    return h(
      'svg',
      {
        viewBox: '0 0 24 24',
        width: String(this.size ?? 14),
        height: String(this.size ?? 14),
        fill: 'none',
        stroke: 'currentColor',
        'stroke-width': '2',
        'stroke-linecap': 'round',
        'stroke-linejoin': 'round',
        'aria-hidden': 'true',
      },
      [
        h('circle', { cx: '9', cy: '5', r: '1' }),
        h('circle', { cx: '9', cy: '12', r: '1' }),
        h('circle', { cx: '9', cy: '19', r: '1' }),
        h('circle', { cx: '15', cy: '5', r: '1' }),
        h('circle', { cx: '15', cy: '12', r: '1' }),
        h('circle', { cx: '15', cy: '19', r: '1' }),
      ],
    );
  },
}) as unknown as IconComponent;
