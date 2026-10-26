/**
 * @snui/ai/mcp/types — MCP tool input/output shapes.
 *
 * The full MCP SDK is intentionally NOT a dependency in this M0.5 stub.
 * Per the user's scoping decision, the server is a typed stub that exposes
 * tool descriptors and returns placeholder responses. When the real
 * @modelcontextprotocol/sdk is wired up (M2), the existing tool descriptors
 * here will satisfy its request/response types with minimal adaptation.
 *
 * Per AGENTS.md §23, the stub must NOT execute any arbitrary user input.
 * All tools below operate on pre-validated typed inputs only.
 */

export interface ListComponentsInput {
  /** Which library end to query. */
  end: 'web' | 'uni'
}

export interface ComponentSummary {
  /** PascalCase component name (Web) or kebab-case (Uni). */
  name: string
  /** One-line purpose. */
  description: string
  /** Import path snippet. */
  importPath: string
}

export interface ListComponentsOutput {
  components: ReadonlyArray<ComponentSummary>
}

export interface GetComponentMetaInput {
  name: string
  end: 'web' | 'uni'
}

export interface ComponentProp {
  name: string
  type: string
  default: string
  required: boolean
  description: string
}

export interface ComponentEvent {
  name: string
  payload: string
  description: string
}

export interface ComponentSlot {
  name: string
  description: string
}

export interface ComponentToken {
  cssVar: string
  purpose: string
}

export interface ComponentMeta {
  name: string
  description: string
  importPath: string
  props: ReadonlyArray<ComponentProp>
  events: ReadonlyArray<ComponentEvent>
  slots: ReadonlyArray<ComponentSlot>
  tokens: ReadonlyArray<ComponentToken>
  accessibility: string
}

export interface GetStylePackInput {
  name: string
}

export interface StylePackInfo {
  name: string
  label: string
  description: string
  /** Ready-to-paste snippet (consumed by docs site ThemeCopier). */
  snippet: string
  hasSkinCss: boolean
}

export interface RenderPreviewInput {
  vueCode: string
  packName?: string
}

export interface RenderPreviewOutput {
  url: string
  success: boolean
  error?: string
}

export interface AiMcpTool<I, O> {
  readonly name: string
  readonly description: string
  readonly inputSchema: string
  handle(input: I): Promise<O>
}