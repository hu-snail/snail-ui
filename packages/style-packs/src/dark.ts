import type { StylePackDefinition } from './types.js'

/**
 * dark Pack — low-saturation dark theme.
 *
 * Per AUI-PRD-v3.0 §3 + ADR-0002 + Spec-01 §2.5:
 *   - Inverts the light theme primary palette to dark variants
 *   - Token layer only
 *   - Active when document.documentElement has data-theme="dark" OR when pack
 *     is explicitly applied via ConfigProvider skin="dark"
 */
export const darkPack: StylePackDefinition = {
  name: 'dark',
  label: 'Dark (现代暗色)',
  description: '低饱和度暗色背景，蓝色主色沿用，保留可访问对比度。',
  theme: {
    name: 'dark',
    semantic: {
      text: {
        primary: '#fafafa',
        secondary: '#a1a1aa',
        disabled: '#52525b',
        inverse: '#18181b',
      },
      background: {
        surface: '#18181b',
        subtle: '#27272a',
        elevated: '#1f1f23',
      },
      border: {
        default: '#3f3f46',
        subtle: '#27272a',
      },
      action: {
        primary: '#3b82f6',
        primaryHover: '#60a5fa',
      },
    },
  },
  style: {
    name: 'dark-modern',
    primitive: {
      radius: { sm: '4px', md: '6px', lg: '8px', xl: '12px' },
      shadow: {
        xs: '0 1px 2px rgba(0,0,0,0.4)',
        sm: '0 1px 3px rgba(0,0,0,0.5), 0 1px 2px rgba(0,0,0,0.4)',
        md: '0 4px 8px rgba(0,0,0,0.5), 0 2px 4px rgba(0,0,0,0.4)',
      },
    },
    component: {
      button: { radius: '6px' },
      input: { radius: '6px' },
      card: { radius: '8px', shadow: '0 1px 3px rgba(0,0,0,0.5), 0 1px 2px rgba(0,0,0,0.4)' },
    },
  },
}

export default darkPack