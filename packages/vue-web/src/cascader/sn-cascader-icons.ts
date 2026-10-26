/**
 * Built-in icons used by SnCascader (trigger chevron-down / parent expand
 * chevron-right / clear ×). Inlined per the sn-select-icons.ts precedent so
 * the package does NOT depend on a third-party icon set, and so this
 * cascader module stays self-contained (no shared-file edits).
 *
 * Per AGENTS.md §113: emoji-as-UI-icon is forbidden. Every glyph ships
 * here as a Vue functional component.
 */
import { defineComponent, h } from 'vue';
import type { IconComponent } from '../icon/sn-icon-registry';

function svgIconMulti(paths: string[], viewBox = '0 0 24 24'): IconComponent {
  return defineComponent({
    name: 'SnBuiltInIcon',
    props: { size: { default: 14 } },
    render() {
      return h(
        'svg',
        {
          viewBox,
          width: String(this.size ?? 14),
          height: String(this.size ?? 14),
          fill: 'none',
          stroke: 'currentColor',
          'stroke-width': '2',
          'stroke-linecap': 'round',
          'stroke-linejoin': 'round',
          'aria-hidden': 'true',
        },
        paths.map((d) => h('path', { d })),
      );
    },
  }) as unknown as IconComponent;
}

/** Chevron-down — trigger arrow (rotates 180° while open). */
export const ChevronDownIcon: IconComponent = svgIconMulti(['m6 9 6 6 6-6']);
/** Chevron-right — parent row expand affordance. */
export const ChevronRightIcon: IconComponent = svgIconMulti(['m9 6 6 6-6 6']);
/** X — clear button glyph. */
export const CloseIcon: IconComponent = svgIconMulti(['M18 6 6 18', 'M6 6 18 18']);
