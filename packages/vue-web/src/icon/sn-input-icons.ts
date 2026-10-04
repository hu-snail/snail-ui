/**
 * Built-in icons used by core components (SnInput password toggle +
 * SnInput clear button). Inlined here so the package does NOT depend on
 * lucide-vue-next / tabler-icons / any other third-party icon set —
 * consumers can still registerSnIcons() with whichever set they want.
 *
 * Per AGENTS.md §113: emoji-as-UI-icon is forbidden. Every glyph ships
 * here as a Vue functional component (no emoji, no innerHTML).
 */
import { defineComponent, h } from 'vue'
import type { IconComponent } from './sn-icon-registry'

function svgIcon(path: string, viewBox = '0 0 24 24'): IconComponent {
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
        [h('path', { d: path })],
      )
    },
  }) as unknown as IconComponent
}

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
      )
    },
  }) as unknown as IconComponent
}

/** Eye — password visible. */
export const EyeIcon: IconComponent = svgIconMulti([
  'M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z',
  'M12 12m-3 0a3 3 0 1 0 6 0a3 3 0 1 0-6 0',
])
/** Eye-off — password hidden (slash overlay). */
export const EyeOffIcon: IconComponent = svgIconMulti([
  'M17.94 17.94A10.94 10.94 0 0 1 12 19c-7 0-10-7-10-7a18.45 18.45 0 0 1 4.06-5.94',
  'M9.9 4.24A10.94 10.94 0 0 1 12 4c7 0 10 7 10 7a18.5 18.5 0 0 1-2.16 3.19',
  'M2 9l12 12',
])
/** X — clear button glyph. */
export const XIcon: IconComponent = svgIconMulti(['M18 6 6 18', 'M6 6 18 18'])

export const BUILTIN_INPUT_ICONS = [EyeIcon, EyeOffIcon, XIcon] as const