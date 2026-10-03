import { z } from 'zod';
import { defineComponentContract, type ComponentContract } from './component-contract.js';

/**
 * AUI Button — official component contract.
 *
 * Per AUI-WEB-003 acceptance: variant / size / disabled / loading / / text /
 * click. Plus Token / A11y / Schema / Binding / Action.
 *
 * Per AGENTS.md §31, every official component MUST define this contract
 * (name / version / props / events / slots / tokens / accessibility /
 * capabilities / ai). Per §25, Zod is the Source of Truth.
 *
 * Per §57 (AI Patch Boundary), `ai.patchable` and `ai.readonly` declare which
 * fields AI may modify. Runtime state, internal handlers, and the role are
 * forbidden from AI mutation.
 *
 * The contract is sealed through `defineComponentContract<ButtonProps>(...)`
 * so TS verifies the props schema aligns with the inferred TS type at the
 * point of definition (AUI-CONTRACT-002 — Zod / Type / Default / Validation
 * must stay consistent).
 */

export const ButtonVariantSchema = z.enum(['primary', 'secondary', 'danger', 'ghost']);
export type ButtonVariant = z.infer<typeof ButtonVariantSchema>;

export const ButtonSizeSchema = z.enum(['small', 'medium', 'large']);
export type ButtonSize = z.infer<typeof ButtonSizeSchema>;

export const ButtonTypeSchema = z.enum(['button', 'submit', 'reset']);
export type ButtonType = z.infer<typeof ButtonTypeSchema>;

export const ButtonPropsSchema = z
  .object({
    variant: ButtonVariantSchema.default('primary'),
    size: ButtonSizeSchema.default('medium'),
    disabled: z.boolean().default(false),
    loading: z.boolean().default(false),
    icon: z.string().min(1).optional(),
    text: z.string().min(1).optional(),
    type: ButtonTypeSchema.default('button'),
  })
  .strict();

export type ButtonProps = z.infer<typeof ButtonPropsSchema>;

/**
 * Button tokens — logical token → CSS variable mapping.
 *
 * Per AGENTS.md §33-35, tokens flow Primitive → Semantic → Component. The
 * renderer expands the logical name to a CSS variable; the actual values
 * are provided by the Theme / Style / Density runtime config.
 *
 * `size` is a sub-axis (per §36): controls height / padding / font-size.
 */
export const ButtonTokens = {
  primary: {
    background: 'var(--aui-color-action-primary)',
    color: 'var(--aui-color-text-on-action)',
    borderColor: 'transparent',
  },
  secondary: {
    background: 'var(--aui-color-action-secondary)',
    color: 'var(--aui-color-text-on-action)',
    borderColor: 'var(--aui-color-border-default)',
  },
  danger: {
    background: 'var(--aui-color-action-danger)',
    color: 'var(--aui-color-text-on-danger)',
    borderColor: 'transparent',
  },
  ghost: {
    background: 'transparent',
    color: 'var(--aui-color-action-primary)',
    borderColor: 'var(--aui-color-action-primary)',
  },
  size: {
    small: {
      height: 'var(--aui-control-height-sm)',
      padding: '0 var(--aui-spacing-sm)',
      fontSize: 'var(--aui-font-size-sm)',
    },
    medium: {
      height: 'var(--aui-control-height-md)',
      padding: '0 var(--aui-spacing-md)',
      fontSize: 'var(--aui-font-size-md)',
    },
    large: {
      height: 'var(--aui-control-height-lg)',
      padding: '0 var(--aui-spacing-lg)',
      fontSize: 'var(--aui-font-size-lg)',
    },
  },
} as const;

/**
 * Button accessibility contract (per AGENTS.md §34).
 * role="button" + keyboard=[Enter,Space] is the W3C baseline.
 */
export const ButtonAccessibility = {
  role: 'button',
  keyboard: ['Enter', 'Space'] as const,
  aria: {
    'aria-disabled': '{binding:disabled}',
    'aria-busy': '{binding:loading}',
  },
} as const;

/**
 * Button capabilities — which platform triggers this component responds to.
 * Renderer maps these to DOM events.
 */
export const ButtonCapabilities = ['click', 'keyboard-enter', 'keyboard-space'] as const;

/**
 * AI Patch Boundary — what AI may modify vs must not modify.
 * Per AGENTS.md §33 + §54, AI may modify visual/structural props but not
 * internal handlers, the role, or the keyboard mapping.
 */
export const ButtonAIMetadata = {
  patchable: ['variant', 'size', 'disabled', 'loading', 'icon', 'text', 'type'],
  readonly: ['role', 'keyboard', 'click'],
} as const;

/**
 * Button ComponentContract — AGENTS.md §31 shape.
 * `defineComponentContract<ButtonProps>` enforces that the schema's inferred
 * TS type matches the `TProps` parameter — AUI-CONTRACT-002 invariant.
 */
export const ButtonContract: ComponentContract<ButtonProps> = defineComponentContract<ButtonProps>({
  name: 'button',
  version: '0.1.0',
  props: ButtonPropsSchema,
  events: { click: 'click' },
  slots: {},
  tokens: ButtonTokens,
  accessibility: ButtonAccessibility,
  capabilities: ButtonCapabilities,
  ai: ButtonAIMetadata,
});