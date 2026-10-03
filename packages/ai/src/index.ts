/**
 * @snui/ai — public entry.
 *
 * Per AUI-AI-001~003 / ADR-0002 / Spec-03:
 *   - Re-exports Skill, MCP server factory, ai-meta builder
 *   - M2 will add: bin entry, real MCP wire (stdio/sse), @vue/compiler-sfc integration
 */

export { SKILL_VERSION, SKILL_CONTENT, loadSkill, SKILL_PATH } from './skill/skill.js'
export { createMcpServer, type McpServerStub } from './mcp/server.js'
export type {
  AiMcpTool,
  ListComponentsInput,
  ListComponentsOutput,
  ComponentSummary,
  GetComponentMetaInput,
  ComponentMeta,
  GetStylePackInput,
  StylePackInfo,
  RenderPreviewInput,
  RenderPreviewOutput,
} from './mcp/types.js'
export { buildAiMeta, type AiMeta } from './meta/aggregator.js'