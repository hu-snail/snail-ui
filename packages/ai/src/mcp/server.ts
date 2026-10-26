/**
 * @snui/ai/mcp/server — MCP Server stub (M0.5).
 *
 * Per user direction + AUI-AI-002:
 *  - 4 tools wired (list / get-meta / get-pack / render-preview) with typed I/O
 *  - Real MCP wire (JSON-RPC over stdio / sse) is NOT implemented here
 *    (that requires @modelcontextprotocol/sdk, planned for M2)
 *  - This module exposes a `createMcpServer()` factory that returns a typed
 *    registry, which can be adapted to the real SDK later
 *
 * Per AGENTS.md §23: this stub does not execute arbitrary code. The
 * render_preview tool explicitly refuses to compile user input.
 */

import type { AiMcpTool } from './types.js'
import { listComponents } from './tools/list-components.js'
import { getComponentMeta } from './tools/get-component-meta.js'
import { getStylePack } from './tools/get-style-pack.js'
import { renderPreview } from './tools/render-preview.js'

export interface McpServerStub {
  /** All registered tools, keyed by name. */
  readonly tools: Readonly<Record<string, AiMcpTool<unknown, unknown>>>
  /** Dispatch a tool call by name. Throws if name not registered. */
  dispatch(name: string, input: unknown): Promise<unknown>
}

export function createMcpServer(): McpServerStub {
  const tools: Record<string, AiMcpTool<unknown, unknown>> = {
    list_components: listComponents as AiMcpTool<unknown, unknown>,
    get_component_meta: getComponentMeta as AiMcpTool<unknown, unknown>,
    get_style_pack: getStylePack as AiMcpTool<unknown, unknown>,
    render_preview: renderPreview as AiMcpTool<unknown, unknown>,
  }

  return {
    tools,
    async dispatch(name, input) {
      const tool = tools[name]
      if (!tool) {
        throw new Error(`unknown tool: ${name}`)
      }
      return tool.handle(input)
    },
  }
}

export type { AiMcpTool } from './types.js'
export * from './types.js'