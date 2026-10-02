/**
 * AUI Protocol — framework-agnostic UI contract definitions.
 *
 * This package is the foundation of the Schema-first architecture.
 * Per AGENTS.md §17, Protocol MUST NOT depend on Vue / React / Flutter / Router / DOM APIs.
 *
 * Public API surface (AGENTS.md §14 stable / minimal / explicit):
 *   - `UISchemaSchema` / `UISchema` — top-level UISchema (AUI-PROTOCOL-001)
 *   - `UINodeSchema` / `UINode` — recursive UINode (AUI-PROTOCOL-002)
 *   - `UIBindingSchema` / `UIBinding` — discriminated union, 5 kinds (AUI-PROTOCOL-003)
 *   - `UIEventBindingSchema` / `UIEventBinding` — DOM event → action id (AUI-PROTOCOL-003)
 *   - `UIActionSchema` / `UIAction` — declarative action reference (AUI-PROTOCOL-004)
 *   - `AIActionMetadataSchema` / `AIActionMetadata` — AI metadata sub-schema
 *   - `UI_SCHEMA_TYPE` — canonical schema id prefix (`aui.page`)
 *   - `UI_SCHEMA_VERSION` — current UISchema version constant
 *   - `AUI_PROTOCOL_VERSION` — protocol package version constant
 *
 * Sibling tasks (placeholders replaced as they merge):
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

export {
  UIBindingSchema,
  StateBindingSchema,
  ComputedBindingSchema,
  PropBindingSchema,
  EventBindingSchema,
  ExpressionBindingSchema,
  type UIBinding,
  type StateBinding,
  type ComputedBinding,
  type PropBinding,
  type EventBinding,
  type ExpressionBinding,
} from './ui-binding.js';

export { UIEventBindingSchema, type UIEventBinding } from './ui-event-binding.js';

export {
  UIActionSchema,
  AIActionMetadataSchema,
  type UIAction,
  type AIActionMetadata,
} from './ui-action.js';