/**
 * Built-in icons used by SnInputNumber (stepper − / + glyphs). Inlined per
 * the sn-input-icons.ts / sn-select-icons.ts precedent so the package does
 * NOT depend on a third-party icon set, and so this module stays
 * self-contained (no shared-file edits).
 *
 * The paths keep the geometry the component shipped inline before these
 * glyphs became replaceable through the `minus-icon` / `plus-icon` slots
 * (512 viewBox, stroke-width 32) — moving them into a module must not move a
 * pixel. Only the markup duplication is gone.
 *
 * Per AGENTS.md §113: emoji-as-UI-icon is forbidden. Every glyph ships here
 * as a Vue functional component (no emoji, no innerHTML).
 */
import { defineComponent, h } from 'vue';
import type { IconComponent } from '../icon/sn-icon-registry';

/** Stepper glyph stroke width in the 512-unit viewBox (naive-ui parity). */
const STEPPER_STROKE_WIDTH = '32';

function svgIcon(paths: string[], viewBox = '0 0 512 512'): IconComponent {
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
          xmlns: 'http://www.w3.org/2000/svg',
          'aria-hidden': 'true',
        },
        paths.map((d) =>
          h('path', {
            d,
            stroke: 'currentColor',
            'stroke-width': STEPPER_STROKE_WIDTH,
            'stroke-linecap': 'round',
            'stroke-linejoin': 'round',
          }),
        ),
      );
    },
  }) as unknown as IconComponent;
}

/** Minus — decrement glyph. */
export const MinusIcon: IconComponent = svgIcon(['M400 256H112']);
/** Plus — increment glyph. */
export const PlusIcon: IconComponent = svgIcon(['M256 112V400M400 256H112']);

export const BUILTIN_INPUT_NUMBER_ICONS = [MinusIcon, PlusIcon] as const;
