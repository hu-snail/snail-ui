/**
 * render_preview — render an arbitrary Vue SFC in a sandbox iframe.
 *
 * Stub: returns success=false with an explicit "not implemented" message.
 * Real implementation (M3 phase, AUI-AI-004) will:
 *   1. Run @vue/compiler-sfc on the input string (server-side)
 *   2. Construct an HTML wrapper with sandbox="allow-scripts allow-same-origin"
 *      (no network, no fetch, no XMLHttpRequest)
 *   3. Host it on a temp endpoint and return it
 *   4. Enforce 15s timeout + 64MB memory cap
 *
 * Per AGENTS.md §23, this stub must NOT execute the input code in any form.
 */

import type { AiMcpTool, RenderPreviewInput, RenderPreviewOutput } from '../types.js'

export const renderPreview: AiMcpTool<RenderPreviewInput, RenderPreviewOutput> = {
  name: 'render_preview',
  description: 'Render a Vue SFC in a sandboxed iframe; returns preview URL.',
  inputSchema: 'json-schema-stub',
  async handle(_input: RenderPreviewInput): Promise<RenderPreviewOutput> {
    return {
      url: '',
      success: false,
      error: 'render_preview is not implemented yet (M3 phase, AUI-AI-004). See Spec-03 §3.2 for security constraints.',
    }
  },
}