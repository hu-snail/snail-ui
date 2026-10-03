import { z } from 'zod';
import {
  defineComponentContract,
  type ComponentContract,
} from './component-contract.js';

/**
 * AUI Input — official component contract.
 *
 * Per AUI-WEB-004 acceptance: value / placeholder / disabled / readonly / type /
 * clearable / maxlength / minlength + input / change / focus / blur.
 * Plus Token / A11y / Schema / Binding / Action.
 *
 * Per AGENTS.md §31, every official component MUST define this contract
 * (name / version / props / events / slots / tokens / accessibility /
 * capabilities / ai). Per §25, Zod is the Source of Truth.
 *
 * `value` is intentionally a plain string. Type `number`/`email`/etc. is a
 * render constraint — semantically the field is still a string slot. Callers
 * that need numeric coercion should do it at the action/binding layer (not
 * the contract layer).
 */

export const InputTypeSchema = z.enum([
  'text',
  'password',
  'email',
  'number',
  'tel',
  'url',
  'search',
]);
export type InputType = z.infer<typeof InputTypeSchema>;

export const InputSizeSchema = z.enum(['small', 'medium', 'large']);
export type InputSize = z.infer<typeof InputSizeSchema>;

export const InputPropsSchema = z
  .object({
    value: z.string().default(''),
    placeholder: z.string().optional(),
    disabled: z.boolean().default(false),
    readonly: z.boolean().default(false),
    type: InputTypeSchema.default('text'),
    size: InputSizeSchema.default('medium'),
    clearable: z.boolean().default(false),
    maxlength: z.number().int().positive().optional(),
    minlength: z.number().int().nonnegative().optional(),
    name: z.string().min(1).optional(),
  })
  .strict();

export type InputProps = z.infer<typeof InputPropsSchema>;

/**
 * Input tokens — logical token → CSS variable mapping.
 *
 * Per AGENTS.md §33-35, tokens flow Primitive → Semantic → Component. The
 * renderer expands the logical name to a CSS variable; the actual values
 * are provided by the Theme / Style / Density runtime config.
 *
 * `size` is a sub-axis (per §36): controls height / padding / font-size.
 */
export const InputTokens = {
  background: 'var(--aui-color-input-bg)',
  color: 'var(--aui-color-input-text)',
  borderColor: 'var(--aui-color-input-border)',
  placeholderColor: 'var(--aui-color-input-placeholder)',
  disabledBackground: 'var(--aui-color-input-bg-disabled)',
  disabledColor: 'var(--aui-color-input-text-disabled)',
  focusRing: 'var(--aui-color-focus-ring)',
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
 * Input accessibility contract (per AGENTS.md §52).
 *
 * role="textbox" (text-like inputs); `type=number` uses role="spinbutton"
 * (handled at renderer layer). Keyboard support is platform-native for
 * `<input>` elements — Tab to focus, Arrow keys to navigate text caret.
 */
export const InputAccessibility = {
  role: 'textbox',
  keyboard: ['Tab', 'ArrowLeft', 'ArrowRight', 'Backspace', 'Delete'] as const,
  aria: {
    'aria-disabled': '{binding:disabled}',
    'aria-readonly': '{binding:readonly}',
    'aria-placeholder': '{binding:placeholder}',
  },
} as const;

/**
 * Input capabilities — which platform triggers this component responds to.
 * Renderer maps these to DOM events on the underlying `<input>` element.
 */
export const InputCapabilities = [
  'input',
  'change',
  'focus',
  'blur',
  'keyboard-tab',
] as const;

/**
 * AI Patch Boundary — what AI may modify vs must not modify.
 * Per AGENTS.md §33 + §54, AI may modify visual/structural props but not
 * internal handlers, the role, or the keyboard mapping.
 */
export const InputAIMetadata = {
  patchable: [
    'value',
    'placeholder',
    'disabled',
    'readonly',
    'type',
    'size',
    'clearable',
    'maxlength',
    'minlength',
    'name',
  ],
  readonly: ['role', 'keyboard', 'focus', 'blur'],
} as const;

/**
 * Input ComponentContract — AGENTS.md §31 shape.
 * `defineComponentContract<InputProps>` enforces that the schema's inferred
 * TS type matches the `TProps` parameter — AUI-CONTRACT-002 invariant.
 */
export const InputContract: ComponentContract<InputProps> = defineComponentContract<InputProps>({
  name: 'input',
  version: '0.1.0',
  props: InputPropsSchema,
  events: {
    input: 'input',
    change: 'change',
    focus: 'focus',
    blur: 'blur',
    clear: 'click',
  },
  slots: {},
  tokens: InputTokens,
  accessibility: InputAccessibility,
  capabilities: InputCapabilities,
  ai: InputAIMetadata,
});