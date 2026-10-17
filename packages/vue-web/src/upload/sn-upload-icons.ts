/**
 * Built-in icons used by SnUpload (trigger upload glyph). Inlined per the
 * sn-input-icons.ts / sn-select-icons.ts precedent so the package does NOT
 * depend on a third-party icon set, and so this upload module stays
 * self-contained (no shared-file edits).
 *
 * Per AGENTS.md §113: emoji-as-UI-icon is forbidden. Every glyph ships
 * here as a Vue functional component.
 */
import { defineComponent, h } from 'vue'
import type { IconComponent } from '../icon/sn-icon-registry'

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

/** Upload arrow — default trigger glyph. */
export const UploadIcon: IconComponent = svgIconMulti([
  'M12 3v12',
  'm7 8 5-5 5 5',
  'M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2',
])
/** X — remove glyph. */
export const CloseIcon: IconComponent = svgIconMulti(['M18 6 6 18', 'M6 6 18 18'])
/** Loader arc — uploading spinner. */
export const LoadingIcon: IconComponent = svgIconMulti([
  'M12 2v4',
  'm16.2 7.8 2.9-2.9',
  'M18 12h4',
  'm19.1 16.2-2.9-2.9',
  'M12 18v4',
  'm7.8 19.1-2.9-2.9',
  'M2 12h4',
  'm4.9 7.8 2.9-2.9',
])
