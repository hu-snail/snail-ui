import type { StylePackDefinition } from './types.js'

/**
 * ios Pack — Apple Human Interface Guidelines.
 *
 * Per AUI-PRD-v3.0 §3 + ADR-0002 + Spec-01 §2.5:
 *   - Apple blue (#007AFF) primary action
 *   - Larger radii (12-16px)
 *   - Drop shadows entirely (use 0.5px borders instead)
 *   - Token-layer only — no skin CSS
 */
export const iosPack: StylePackDefinition = {
  name: 'ios',
  label: 'iOS 风格',
  description: 'Apple HIG 风格：12px 圆角，无阴影，细线边框，苹果蓝主色。',
  theme: {
    name: 'ios-light',
    semantic: {
      action: {
        primary: '#007AFF',
        primaryHover: '#3395FF',
      },
    },
  },
  style: {
    name: 'ios',
    primitive: {
      radius: { sm: '8px', md: '12px', lg: '16px', xl: '20px' },
      shadow: { xs: 'none', sm: 'none', md: 'none', lg: 'none', xl: 'none' },
    },
    component: {
      button: { radius: '12px' },
      input: { radius: '10px' },
      card: { radius: '16px', shadow: 'none' },
    },
  },
}

export default iosPack