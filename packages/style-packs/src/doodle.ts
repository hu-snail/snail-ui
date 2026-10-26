import type { StylePackDefinition } from './types.js'

/**
 * Doodle Pack — hand-drawn / notebook-sticker style.
 *
 * Per AUI-PRD-v3.1 §7.4: a new official pack that visibly differs from
 * the flat modern baseline (defaultPack) and the rounded flat iOS look
 * (iosPack). Activated by toggling body.snui-skin-doodle on the docs site
 * (StyleSwitcher / DemoLabFab) or by mounting under that class on a
 * consumer page.
 *
 * Token layer:
 *   - Saturated palette: pink primary, mint success, butter warning,
 *     coral danger, sky info. Text stays ink-black so all feedback
 *     colors stay readable.
 *   - Hard offset shadows (no blur) — `2px 2px 0 #1a1a1a` /
 *     `4px 4px 0 #1a1a1a` — anchors the sticker metaphor across all
 *     elevated surfaces.
 *
 * Skin layer (handled per-component in @snui/vue-web + @snui/uni CSS):
 *   - Component shapes get wavy / asymmetric border-radius under
 *     `.snui-skin-doodle` (e.g. `12px 2px / 2px 12px`)
 *   - Border width bumped to 2.5px solid #1a1a1a
 *   - Hover lifts component by 1px (translate -1 -1) and grows shadow
 *     to reinforce the pressed-paper feel
 *
 * Density: comfortable (same baseline as defaultPack) — visual emphasis
 * comes from shape + color, not from compactness.
 */
export const doodlePack: StylePackDefinition = {
  name: 'doodle',
  label: 'Doodle 涂鸦',
  description: '手绘贴纸风格：粗黑墨边、硬偏移阴影、不对称波浪圆角、鲜艳纸感配色。',
  theme: {
    name: 'doodle',
    semantic: {
      text: {
        primary: '#1a1a1a',
        secondary: '#3f3f46',
        disabled: '#a1a1aa',
        inverse: '#FFF8E7',
      },
      background: {
        surface: '#FFF8E7', // notebook cream
        subtle: '#F5E6B8',  // darker cream
        elevated: '#FFFBEB',
      },
      border: {
        default: '#1a1a1a',
        subtle: '#3f3f46',
      },
      action: {
        primary: '#FF6B9D',       // marker pink
        primaryHover: '#FF85B0',
      },
      feedback: {
        success: '#7BC85A',       // grass green
        warning: '#FFC83D',       // marker yellow
        danger: '#FF5C5C',        // marker red
        info: '#5DADE2',          // sky blue
      },
    },
  },
  style: {
    name: 'doodle',
    primitive: {
      radius: {
        sm: '8px 2px / 2px 8px',
        md: '12px 2px / 2px 12px',
        lg: '16px 4px / 4px 16px',
        xl: '22px 6px / 6px 22px',
      },
      shadow: {
        xs: '1px 1px 0 #1a1a1a',
        sm: '2px 2px 0 #1a1a1a',
        md: '3px 3px 0 #1a1a1a',
        lg: '5px 5px 0 #1a1a1a',
        xl: '7px 7px 0 #1a1a1a',
      },
    },
    component: {
      button: {
        radius: '12px 2px / 2px 12px',
        fontSize: '14px',
        shadow: '3px 3px 0 #1a1a1a',
      },
      input: {
        radius: '10px 2px / 2px 10px',
      },
      card: {
        radius: '16px 4px / 4px 16px',
        shadow: '4px 4px 0 #1a1a1a',
      },
    },
  },
  density: {
    name: 'comfortable',
  },
}

export default doodlePack
