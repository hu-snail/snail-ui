// list_components stub for M0.5 (AUI-AI-002).
// Real implementation will scan component ai-description.md files.

import type { AiMcpTool, ListComponentsInput, ListComponentsOutput } from '../types.js'

export const listComponents: AiMcpTool<ListComponentsInput, ListComponentsOutput> = {
  name: 'list_components',
  description: 'List all official snail-aui components for the given end (web / uni).',
  inputSchema: 'json-schema-stub',
  async handle(input: ListComponentsInput): Promise<ListComponentsOutput> {
    if (input.end === 'web') {
      return {
        components: [
          {
            name: 'SnButton',
            description: '主要交互按钮，支持 type/size/disabled/loading 等。',
            importPath: "import { SnButton } from '@snui/vue-web'",
          },
          {
            name: 'SnConfigProvider',
            description: '全局配置：skin prop 用于切换 Style Pack。',
            importPath: "import { SnConfigProvider } from '@snui/vue-web'",
          },
        ],
      }
    }
    return {
      components: [
        {
          name: 'sn-button',
          description: 'uni-app 端主要交互按钮（easycom 自动注册）。',
          importPath: '<sn-button>',
        },
        {
          name: 'sn-config-provider',
          description: 'uni-app 端全局配置 + skin 切换（通过 .snui-skin-* class）。',
          importPath: '<sn-config-provider>',
        },
      ],
    }
  },
}