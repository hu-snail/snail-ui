/**
 * Built-in icon used by SnDropdown (submenu chevron). Inlined per the
 * sn-select-icons.ts precedent so the package does NOT depend on a
 * third-party icon set, and so this dropdown module stays self-contained
 * (no shared-file edits).
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

/** Chevron-right — submenu indicator on parent rows. */
export const ChevronRightIcon: IconComponent = svgIconMulti(['m9 18 6-6-6-6']);

/**
 * Chevron-down — the built-in trigger arrow. A real SVG glyph replaces the
 * `▾` / `▸` text characters consumers used to type into their buttons
 * (AGENTS.md §113 forbids text/emoji glyphs as UI icons). Rotates 180° while
 * the menu is open; can be replaced through the `icon` prop or `#icon` slot.
 */
export const ChevronDownIcon: IconComponent = svgIconMulti(['m6 9 6 6 6-6']);
