/**
 * ai-meta aggregator for snail-aui (AUI-AI-003).
 *
 * Aggregates parsed ai-description.md files plus the Style Pack list plus
 * the global token variable names into a single JSON file that AI clients
 * consume for one-shot context loading. Stub for v0.1.0.
 */

import { allPacks } from '@snui/style-packs'

export interface AiMeta {
  version: string
  generated: string
  web: {
    library: string
    components: ReadonlyArray<{ name: string; description: string; importPath: string }>
  }
  uni: {
    library: string
    components: ReadonlyArray<{ name: string; description: string; importPath: string }>
  }
  stylePacks: ReadonlyArray<{ name: string; label: string; description: string }>
  tokens: {
    semantic: ReadonlyArray<string>
    component: ReadonlyArray<string>
  }
}

export function buildAiMeta(now: Date = new Date()): AiMeta {
  return {
    version: '1.0',
    generated: now.toISOString(),
    web: {
      library: '@snui/vue-web',
      components: [
        { name: 'SnButton', description: '主要交互按钮', importPath: "import { SnButton } from '@snui/vue-web'" },
        { name: 'SnConfigProvider', description: '全局配置 + skin 切换', importPath: "import { SnConfigProvider } from '@snui/vue-web'" },
      ],
    },
    uni: {
      library: '@snui/uni',
      components: [
        { name: 'sn-button', description: 'uni-app 端主要交互按钮', importPath: '<sn-button>' },
        { name: 'sn-config-provider', description: 'uni-app 端全局配置 + skin 切换', importPath: '<sn-config-provider>' },
      ],
    },
    stylePacks: allPacks.map((p) => ({
      name: p.name,
      label: p.label,
      description: p.description ?? '',
    })),
    tokens: {
      semantic: [
        '--sn-color-action-primary',
        '--sn-color-action-primary-hover',
        '--sn-color-text-primary',
        '--sn-color-text-secondary',
        '--sn-color-background-surface',
        '--sn-color-border-default',
        '--sn-color-feedback-success',
        '--sn-color-feedback-warning',
        '--sn-color-feedback-danger',
        '--sn-focus-ring',
      ],
      component: [
        '--sn-button-height-tiny',
        '--sn-button-height-small',
        '--sn-button-height-medium',
        '--sn-button-height-large',
        '--sn-button-radius',
        '--sn-button-font-size',
        '--sn-input-radius',
        '--sn-card-radius',
        '--sn-card-shadow',
      ],
    },
  }
}