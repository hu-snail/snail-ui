import { z } from 'zod';
import {
  defineComponentContract,
  type ComponentContract,
} from './component-contract.js';

/**
 * AUI Form / FormItem — official component contracts.
 *
 * Per AUI-WEB-005 acceptance: fields / validation / submit / reset / disabled /
 * loading.
 *
 * Per AGENTS.md §31, every official component MUST define this contract
 * (name / version / props / events / slots / tokens / accessibility /
 * capabilities / ai). Per §25, Zod is the Source of Truth.
 *
 * Validation rule model (intentionally minimal for Phase 2):
 *   - `required` — value must be non-empty
 *   - `minLength` / `maxLength` — string length constraints
 *   - `pattern` — RegExp source string (compiled at runtime by the renderer)
 *
 *   Future tasks: cross-field validation, async rules, custom validators.
 *   Adding them requires bumping `version` per AGENTS.md §78 (Minor / Additive).
 *
 * Sub-components:
 *   - `form`     — container; renders FormItems + emits submit/reset/validate
 *   - `form-item` — leaf; renders label + slot + error message
 *
 * Both share the `Form` family and live in one file because their
 * validation contract is intertwined.
 */

export const FormLayoutSchema = z.enum(['horizontal', 'vertical']);
export type FormLayout = z.infer<typeof FormLayoutSchema>;

export const FormRuleSchema = z
  .object({
    required: z.boolean().optional(),
    minLength: z.number().int().nonnegative().optional(),
    maxLength: z.number().int().positive().optional(),
    pattern: z.string().optional(),
    message: z.string().optional(),
  })
  .strict();
export type FormRule = z.infer<typeof FormRuleSchema>;

/**
 * FormField — declarative field descriptor. Phase 2 uses this as the single
 * source of truth for fields rendered inside a Form. The renderer reads the
 * `children` tree, but a schema-only `fields` array is allowed for the
 * minimal "data only" use case (no inline UI customization).
 */
export const FormFieldSchema = z
  .object({
    /** Property path inside form values (e.g. `'email'`, `'address.city'`). */
    prop: z.string().min(1),
    label: z.string().optional(),
    required: z.boolean().optional(),
    rules: z.array(FormRuleSchema).optional(),
    placeholder: z.string().optional(),
    type: z
      .enum(['text', 'password', 'email', 'number', 'tel', 'url', 'search'])
      .default('text'),
    disabled: z.boolean().default(false),
  })
  .strict();
export type FormField = z.infer<typeof FormFieldSchema>;

export const FormPropsSchema = z
  .object({
    layout: FormLayoutSchema.default('vertical'),
    disabled: z.boolean().default(false),
    loading: z.boolean().default(false),
    /** Initial values keyed by `prop` path. */
    initialValues: z.record(z.string(), z.unknown()).default({}),
    /** Inline field definitions — optional, the renderer may also use children. */
    fields: z.array(FormFieldSchema).optional(),
    /** Optional form id (used as the wrapping `<form>` element id). */
    formId: z.string().min(1).optional(),
  })
  .strict();
export type FormProps = z.infer<typeof FormPropsSchema>;

export const FormItemPropsSchema = z
  .object({
    /** Property path this item binds to. Required for value lookup / error lookup. */
    prop: z.string().min(1),
    label: z.string().optional(),
    required: z.boolean().default(false),
    /** Error string for this item, set by the parent Form after validation. */
    error: z.string().optional(),
  })
  .strict();
export type FormItemProps = z.infer<typeof FormItemPropsSchema>;

/**
 * Form tokens — logical token → CSS variable mapping.
 * Per AGENTS.md §33-35, tokens flow Primitive → Semantic → Component.
 */
export const FormTokens = {
  background: 'var(--aui-color-surface)',
  itemGap: 'var(--aui-spacing-md)',
  labelColor: 'var(--aui-color-text-primary)',
  errorColor: 'var(--aui-color-text-danger)',
  requiredColor: 'var(--aui-color-text-danger)',
  borderColor: 'var(--aui-color-border-default)',
} as const;

export const FormItemTokens = {
  ...FormTokens,
  gap: 'var(--aui-spacing-sm)',
} as const;

/**
 * Form accessibility contract — wraps the children in `<form>` so platform
 * keyboard / submit semantics work natively.
 */
export const FormAccessibility = {
  role: 'form',
  keyboard: ['Enter', 'Tab'] as const,
  aria: {
    'aria-busy': '{binding:loading}',
    'aria-disabled': '{binding:disabled}',
  },
} as const;

export const FormItemAccessibility = {
  role: 'group',
  keyboard: [] as const,
  aria: {
    'aria-required': '{binding:required}',
    'aria-invalid': '{binding:hasError}',
  },
} as const;

/**
 * Form capabilities — what platform triggers this component responds to.
 */
export const FormCapabilities = ['submit', 'reset', 'validate'] as const;
export const FormItemCapabilities = ['blur', 'input'] as const;

/**
 * AI Patch Boundary — what AI may modify vs must not modify.
 */
export const FormAIMetadata = {
  patchable: ['layout', 'disabled', 'loading', 'initialValues', 'fields', 'formId'],
  readonly: ['role', 'submit', 'reset'],
} as const;

export const FormItemAIMetadata = {
  patchable: ['prop', 'label', 'required', 'error'],
  readonly: ['role'],
} as const;

/**
 * Form ComponentContract — AGENTS.md §31 shape.
 */
export const FormContract: ComponentContract<FormProps> = defineComponentContract<FormProps>({
  name: 'form',
  version: '0.1.0',
  props: FormPropsSchema,
  events: {
    submit: 'submit',
    reset: 'reset',
    validate: 'validate',
  },
  slots: {},
  tokens: FormTokens,
  accessibility: FormAccessibility,
  capabilities: FormCapabilities,
  ai: FormAIMetadata,
});

/**
 * FormItem ComponentContract — AGENTS.md §31 shape.
 * Lives alongside `form` because the two are tightly coupled; their contracts
 * share the `FormRule` validation vocabulary.
 */
export const FormItemContract: ComponentContract<FormItemProps> =
  defineComponentContract<FormItemProps>({
    name: 'form-item',
    version: '0.1.0',
    props: FormItemPropsSchema,
    events: {},
    slots: {},
    tokens: FormItemTokens,
    accessibility: FormItemAccessibility,
    capabilities: FormItemCapabilities,
    ai: FormItemAIMetadata,
  });