/**
 * AUI Runtime — schema interpreter over Protocol + Schema + Tokens.
 *
 * Per AGENTS.md §18 Runtime MUST NOT do business work (login / order / payment / CRM / ERP).
 * Per AGENTS.md §19 Phase 1 reuses @vue/reactivity via ReactiveAdapter; do not re-implement.
 *
 * Real Runtime / RuntimeContext / Lifecycle / Registry land in AUI-RUNTIME-001..004.
 */
export const AUI_RUNTIME_VERSION = '0.1.0';