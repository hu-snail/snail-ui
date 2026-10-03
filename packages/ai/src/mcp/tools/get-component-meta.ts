/**
 * get_component_meta — return the full meta of one component.
 *
 * Stub: only SnButton / SnConfigProvider are wired. Other components return
 * `error: not found` until they are migrated into the registry.
 *
 * Real implementation will:
 *   1. Read packages/vue-web/src/<name>/ai-description.md
 *   2. Parse Props / Events / Slots / Tokens tables
 *   3. Auto-extract via @snui/cli (AUI-TOOL-002)
 */

import type { AiMcpTool, GetComponentMetaInput, ComponentMeta } from '../types.js'

const KNOWN_META: Record<string, ComponentMeta> = {
  SnButton: {
    name: 'SnButton',
    description: '主要交互按钮。',
    importPath: "import { SnButton } from '@snui/vue-web'",
    props: [
      { name: 'type', type: "'primary' | 'default' | 'success' | 'warning' | 'danger' | 'info'", default: "'default'", required: false, description: 'Visual variant' },
      { name: 'size', type: "'tiny' | 'small' | 'medium' | 'large'", default: "'medium'", required: false, description: 'Size preset' },
      { name: 'block', type: 'boolean', default: 'false', required: false, description: 'Full-width block layout' },
      { name: 'round', type: 'boolean', default: 'false', required: false, description: 'Pill shape (radius 999px)' },
      { name: 'disabled', type: 'boolean', default: 'false', required: false, description: 'Disabled state, skips click' },
      { name: 'loading', type: 'boolean', default: 'false', required: false, description: 'Loading state, shows spinner' },
      { name: 'htmlType', type: "'button' | 'submit' | 'reset'", default: "'button'", required: false, description: 'Native button type' },
      { name: 'bordered', type: 'boolean', default: 'true', required: false, description: 'Draw border (for default type)' },
      { name: 'ariaLabel', type: 'string', default: '—', required: false, description: 'Native ARIA label override' },
    ],
    events: [
      { name: 'click', payload: '(event: MouseEvent) => void', description: 'Skipped when disabled or loading' },
    ],
    slots: [
      { name: 'default', description: 'Button label text' },
      { name: 'icon', description: 'Pre-content icon slot' },
      { name: 'loading', description: 'Custom loading indicator slot' },
    ],
    tokens: [
      { cssVar: '--sn-color-action-primary', purpose: 'primary background' },
      { cssVar: '--sn-button-height-medium', purpose: 'default height' },
      { cssVar: '--sn-button-radius', purpose: 'border radius' },
      { cssVar: '--sn-focus-ring', purpose: 'focus-visible ring color' },
    ],
    accessibility: 'role="button", aria-disabled / aria-busy, native keyboard (Enter/Space).',
  },
  SnConfigProvider: {
    name: 'SnConfigProvider',
    description: '全局配置 + skin class 注入。',
    importPath: "import { SnConfigProvider } from '@snui/vue-web'",
    props: [
      { name: 'skin', type: 'string', default: "''", required: false, description: 'Style Pack 标识（kebab-case）；写入 document.body.classList' },
    ],
    events: [],
    slots: [
      { name: 'default', description: '应用树' },
    ],
    tokens: [],
    accessibility: 'No specific a11y role (transparent wrapper).',
  },
}

export const getComponentMeta: AiMcpTool<GetComponentMetaInput, ComponentMeta> = {
  name: 'get_component_meta',
  description: 'Get full Props / Events / Slots / Tokens / A11y of a single component.',
  inputSchema: 'json-schema-stub',
  async handle(input: GetComponentMetaInput): Promise<ComponentMeta> {
    const meta = KNOWN_META[input.name]
    if (!meta) {
      throw new Error(`component not found: ${input.name} (end=${input.end})`)
    }
    return meta
  },
}