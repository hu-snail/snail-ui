/**
 * AUI Protocol — framework-agnostic UI contract definitions.
 *
 * This package is the foundation of the Schema-first architecture.
 * Per AGENTS.md §17, Protocol MUST NOT depend on Vue / React / Flutter / Router / DOM APIs.
 *
 * Public API surface (AGENTS.md §14 stable / minimal / explicit):
 *   - `UISchemaSchema` — top-level UISchema validator (Source of Truth per AGENTS.md §25)
 *   - `UISchema` — TypeScript type derived from the Zod schema via `z.infer`
 *   - `UINodeSchema` — recursive UINode validator (z.lazy for children self-reference)
 *   - `UINode` — TypeScript type derived from UINodeSchema
 *   - `UI_SCHEMA_TYPE` — canonical schema id prefix (`aui.page`)
 *   - `UI_SCHEMA_VERSION` — current UISchema version constant
 *   - `AUI_PROTOCOL_VERSION` — protocol package version constant
 *
 * Sibling tasks (placeholders replaced as they merge):
 *   - AUI-PROTOCOL-003: UIBinding / UIEventBinding / UIStyle
 *   - AUI-PROTOCOL-004: UIAction
 *   - AUI-PROTOCOL-005: UIAccessibility
 *   - AUI-PROTOCOL-006: UICapability
 *   - future task: UIStateSchema
 */
export const AUI_PROTOCOL_VERSION = '0.1.0';

export {
  UISchemaSchema,
  UI_SCHEMA_TYPE,
  UI_SCHEMA_VERSION,
  type UISchema,
} from './ui-schema.js';

export { UINodeSchema, type UINode } from './ui-node.js';