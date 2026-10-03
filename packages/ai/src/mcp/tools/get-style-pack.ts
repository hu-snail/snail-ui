/**
 * get_style_pack — return Style Pack definition + ready-to-paste snippet.
 *
 * Stub: returns default / ios / dark directly (no dependency on @snui/style-packs
 * to keep this package minimal). Real implementation will import from style-packs
 * once the package is stable.
 *
 * Per AUI-PRD-v3.0 §3.4 + ADR-0002, the returned `snippet` is the exact code
 * users would paste into main.ts (docs site ThemeCopier reads from this field).
 */

import type { AiMcpTool, GetStylePackInput, StylePackInfo } from '../types.js'

const KNOWN_PACKS: Record<string, StylePackInfo> = {
  default: {
    name: 'default',
    label: 'Default (Modern)',
    description: '6px control radius, subtle shadows, blue accent.',
    snippet: `import { snCssVars } from '@snui/tokens'
import { defaultPack } from '@snui/style-packs/default'

const el = document.createElement('style')
el.textContent = snCssVars({
  style: defaultPack.style,
  density: defaultPack.density,
})
document.head.appendChild(el)`,
    hasSkinCss: false,
  },
  ios: {
    name: 'ios',
    label: 'iOS 风格',
    description: 'Apple HIG 风格：12px 圆角，无阴影，细线边框，苹果蓝。',
    snippet: `import { snCssVars } from '@snui/tokens'
import { iosPack } from '@snui/style-packs/ios'

const el = document.createElement('style')
el.textContent = snCssVars({
  theme: iosPack.theme,
  style: iosPack.style,
  density: iosPack.density,
})
document.head.appendChild(el)`,
    hasSkinCss: false,
  },
  dark: {
    name: 'dark',
    label: 'Dark (现代暗色)',
    description: '低饱和度暗色背景。',
    snippet: `import { snCssVars } from '@snui/tokens'
import { darkPack } from '@snui/style-packs/dark'

const el = document.createElement('style')
el.textContent = snCssVars({
  theme: darkPack.theme,
  style: darkPack.style,
  density: darkPack.density,
})
document.head.appendChild(el)`,
    hasSkinCss: false,
  },
}

export const getStylePack: AiMcpTool<GetStylePackInput, StylePackInfo> = {
  name: 'get_style_pack',
  description: 'Get a Style Pack definition + ready-to-paste snippet.',
  inputSchema: 'json-schema-stub',
  async handle(input: GetStylePackInput): Promise<StylePackInfo> {
    const pack = KNOWN_PACKS[input.name]
    if (!pack) {
      throw new Error(`style pack not found: ${input.name}`)
    }
    return pack
  },
}