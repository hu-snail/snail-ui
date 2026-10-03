import type { StylePackDefinition } from './types.js'

/**
 * default Pack — Modern / Comfortable.
 *
 * Mostly a no-op pass-through: this pack declares the same theme / style / density
 * as @snui/tokens' defaults. Useful as an explicit identity ("default skin"),
 * and as a reference for other packs.
 *
 * Per AUI-PRD-v3.0 §3 + ADR-0002 + Spec-01 §2.5: this pack has no skin CSS layer
 * (Token layer only).
 */
export const defaultPack: StylePackDefinition = {
  name: 'default',
  label: 'Default (Modern)',
  description: '6px control radius, subtle shadows, blue accent — the modern flat baseline.',
  style: {
    name: 'modern',
    primitive: {
      radius: { sm: '4px', md: '6px', lg: '8px', xl: '12px' },
      shadow: {
        xs: '0 1px 2px rgba(0,0,0,0.04)',
        sm: '0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.06)',
        md: '0 4px 8px rgba(0,0,0,0.08), 0 2px 4px rgba(0,0,0,0.06)',
      },
    },
    component: {
      button: { radius: '6px', fontSize: '14px' },
      input: { radius: '6px' },
      card: { radius: '8px', shadow: '0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.06)' },
    },
  },
  density: {
    name: 'comfortable',
  },
}

export default defaultPack