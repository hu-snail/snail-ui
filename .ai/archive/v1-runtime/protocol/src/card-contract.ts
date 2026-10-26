import { z } from 'zod';
import {
  defineComponentContract,
  type ComponentContract,
} from './component-contract.js';

/**
 * AUI Card — official component contract.
 *
 * Per AUI-WEB-006 acceptance: title / description / header / body / footer.
 *
 * Per AGENTS.md §31, every official component MUST define this contract.
 * Per §25, Zod is the Source of Truth.
 *
 * Phase 2 simplification: a single `Card` component carries all sections. The
 * renderer treats `title` and `description` as a default header; `header`,
 * `body`, and `footer` slots can override or supplement. This keeps the
 * schema-driven path minimal (no need for a `card-header` / `card-body` /
 * `card-footer` schema node) while supporting full layout customization via
 * UINode children.
 */

export const CardVariantSchema = z.enum(['default', 'outlined', 'elevated']);
export type CardVariant = z.infer<typeof CardVariantSchema>;

export const CardPaddingSchema = z.enum(['none', 'sm', 'md', 'lg']);
export type CardPadding = z.infer<typeof CardPaddingSchema>;

export const CardPropsSchema = z
  .object({
    title: z.string().optional(),
    description: z.string().optional(),
    variant: CardVariantSchema.default('default'),
    padding: CardPaddingSchema.default('md'),
    bordered: z.boolean().default(true),
    shadow: z.boolean().default(false),
  })
  .strict();

export type CardProps = z.infer<typeof CardPropsSchema>;

/**
 * Card tokens — logical token → CSS variable mapping.
 * Per AGENTS.md §33-35.
 */
export const CardTokens = {
  background: 'var(--aui-color-surface)',
  borderColor: 'var(--aui-color-border-default)',
  titleColor: 'var(--aui-color-text-primary)',
  descriptionColor: 'var(--aui-color-text-secondary)',
  footerBorderColor: 'var(--aui-color-border-soft)',
  shadow: 'var(--aui-shadow-md)',
  radius: 'var(--aui-radius-card)',
  padding: {
    none: '0',
    sm: 'var(--aui-spacing-sm)',
    md: 'var(--aui-spacing-md)',
    lg: 'var(--aui-spacing-lg)',
  },
} as const;

/**
 * Card accessibility contract — region landmark for navigation.
 * Per AGENTS.md §52 (Role / ARIA / Keyboard / Label).
 */
export const CardAccessibility = {
  role: 'region',
  keyboard: [] as const,
  aria: {
    'aria-labelledby': '{binding:titleId}',
    'aria-describedby': '{binding:descriptionId}',
  },
} as const;

/**
 * Card capabilities — purely visual; no platform events.
 */
export const CardCapabilities = [] as const;

/**
 * AI Patch Boundary.
 */
export const CardAIMetadata = {
  patchable: ['title', 'description', 'variant', 'padding', 'bordered', 'shadow'],
  readonly: ['role'],
} as const;

/**
 * Card ComponentContract — AGENTS.md §31 shape.
 */
export const CardContract: ComponentContract<CardProps> = defineComponentContract<CardProps>({
  name: 'card',
  version: '0.1.0',
  props: CardPropsSchema,
  events: {},
  slots: {},
  tokens: CardTokens,
  accessibility: CardAccessibility,
  capabilities: CardCapabilities,
  ai: CardAIMetadata,
});