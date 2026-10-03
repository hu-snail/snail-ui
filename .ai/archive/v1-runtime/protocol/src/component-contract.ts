import type { ZodType } from 'zod';

/**
 * AUI ComponentContract — every official component must satisfy this shape.
 *
 * Per AGENTS.md §31 + §57:
 *   - name / version / props / events / slots / tokens / accessibility / capabilities
 *   - `ai.patchable` and `ai.readonly` declare the AI mutation boundary
 *
 * Per AGENTS.md §25, Zod is the Source of Truth for `props`. The `TProps`
 * type parameter is the inferred TS type from the schema (e.g.
 * `ButtonProps = z.infer<typeof ButtonPropsSchema>`); contract consumers get
 * full type safety end-to-end.
 */

/** Map of an event id → the platform-level event name (e.g. `click`). */
export type ContractEventMap = Readonly<Record<string, string>>;

/** Map of a slot id → its slot contract metadata (placeholder for Phase 2). */
export type ContractSlotMap = Readonly<Record<string, unknown>>;

/** Accessibility contract per AGENTS.md §52 (Role / ARIA / Keyboard / Label). */
export interface ContractAccessibility {
  /** WAI-ARIA role (e.g. `button`, `textbox`, `dialog`). */
  readonly role: string;
  /** Keyboard interactions that trigger the primary action. */
  readonly keyboard: readonly string[];
  /** Map of aria-* attribute → binding expression (e.g. `'{binding:disabled}'`). */
  readonly aria?: Readonly<Record<string, string>>;
}

/** AI Patch Boundary (AGENTS.md §57). */
export interface ContractAIMetadata {
  /** Prop names AI may modify. */
  readonly patchable: readonly string[];
  /** Prop / event names that must not be AI-modified. */
  readonly readonly: readonly string[];
}

/** Component token shape (logical → CSS variable mapping). */
export type ContractTokens = Readonly<Record<string, unknown>>;

/** Platform capabilities the component reacts to (AGENTS.md §84). */
export type ContractCapabilities = readonly string[];

export interface ComponentContract<TProps = unknown> {
  /** Stable component name (e.g. `button`, `input`). */
  readonly name: string;
  /** Component contract semver. */
  readonly version: string;
  /** Zod source-of-truth schema for the component's props. */
  readonly props: ZodType<TProps>;
  /** Event id → DOM event name map. */
  readonly events: ContractEventMap;
  /** Slot definitions (may be empty for leaf components). */
  readonly slots?: ContractSlotMap;
  /** Component-level token mapping (logical → CSS var reference). */
  readonly tokens: ContractTokens;
  /** Accessibility contract. */
  readonly accessibility: ContractAccessibility;
  /** Platform capabilities. */
  readonly capabilities: ContractCapabilities;
  /** Optional AI patch boundary. */
  readonly ai?: ContractAIMetadata;
}

/**
 * `defineComponentContract` — a thin factory that returns the input contract.
 * It exists to:
 *   1. Force TS to verify the contract satisfies `ComponentContract<TProps>`
 *   2. Provide a single point to add cross-cutting invariants (e.g. version
 *      semver check, name normalization) without touching every component site.
 */
export function defineComponentContract<TProps>(
  contract: ComponentContract<TProps>,
): ComponentContract<TProps> {
  if (!/^\d+\.\d+\.\d+/.test(contract.version)) {
    throw new Error(
      `ComponentContract "${contract.name}" version "${contract.version}" must be semver (X.Y.Z)`,
    );
  }
  if (!/^[a-z][a-z0-9-]*$/.test(contract.name)) {
    throw new Error(
      `ComponentContract name "${contract.name}" must be lowercase kebab (^[a-z][a-z0-9-]*$)`,
    );
  }
  return Object.freeze({ ...contract }) as ComponentContract<TProps>;
}

/** Read a property key list from a ZodType via the inferred shape. */
export type PropKeys<T> = T extends Record<string, unknown> ? keyof T : never;