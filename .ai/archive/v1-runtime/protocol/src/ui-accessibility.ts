import { z } from 'zod';

/**
 * AUI UIAccessibility — declarative accessibility metadata on a UINode.
 *
 * Per AGENTS.md §34, the schema instance provides concrete semantics; the
 * renderer is responsible for mapping to platform attributes (HTML aria-*
 * attributes, uni-app accessibility props, etc.).
 *
 * Per AGENTS.md §52, A11y is a first-class concern: this schema is the
 * Source of Truth; runtime must NOT silently strip these fields.
 *
 * Field semantics:
 *   - role        — ARIA role (e.g. `button`, `textbox`, `dialog`, `presentation`)
 *   - keyboard    — canonical keyboard keys this node responds to
 *   - aria        — additional ARIA attributes not covered by `label`/`description`
 *                   (e.g. `aria-expanded`, `aria-controls`, `aria-haspopup`)
 *   - label       — accessible name (maps to aria-label)
 *   - description — accessible description (maps to aria-describedby / aria-description)
 *
 * Forward references:
 *   - renderers map these to platform attrs (AUI-WEB-003, AUI-UNI-003)
 *   - golden tests verify A11y conformance (AUI-TEST-007)
 */

const KEYBOARD_KEY_ENUM = [
  'Enter',
  'Escape',
  'Space',
  'Tab',

  'ArrowUp',
  'ArrowDown',
  'ArrowLeft',
  'ArrowRight',

  'Home',
  'End',
  'PageUp',
  'PageDown',

  'Backspace',
  'Delete',
] as const;

export const UIAccessibilitySchema = z
  .object({
    role: z
      .string()
      .min(1, 'role must be a non-empty string')
      .max(64, 'role must be 64 chars or less')
      .optional(),

    keyboard: z
      .array(z.enum(KEYBOARD_KEY_ENUM))
      .min(1, 'keyboard array must have at least one entry if provided')
      .optional(),

    aria: z
      .record(z.string(), z.union([z.string(), z.boolean(), z.number()]))
      .optional(),

    label: z
      .string()
      .min(1, 'label must be a non-empty string')
      .max(256, 'label must be 256 chars or less')
      .optional(),

    description: z
      .string()
      .min(1, 'description must be a non-empty string')
      .max(1024, 'description must be 1024 chars or less')
      .optional(),
  })
  .strict();

export type UIAccessibility = z.infer<typeof UIAccessibilitySchema>;