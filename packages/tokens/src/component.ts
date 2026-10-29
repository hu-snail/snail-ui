/**
 * AUI Component Tokens (AUI-TOKEN-003) — component-level tokens that resolve
 * through the semantic layer. Each component token value is a CSS variable
 * reference; Style overrides can vary the visual personality (Modern / Glass /
 * Minimal) without touching semantic or primitive layers.
 *
 * Per AUI-PRD-v3.0 §3 + ADR-0002:
 *   - Component tokens sit BELOW Semantic
 *   - Style axis overrides component tokens
 *   - Density axis only overrides size/spacing primitives
 *   - Component token names use kebab-case in resolver output (e.g. `--aui-button-height-tiny`)
 *   - All component tokens must have a `--sn-*` brand alias (one-to-one mapping)
 *
 * Per AGENTS.md §34 + Spec-01 §1.3, only kebab-case serialized names are valid
 * CSS variable identifiers. Internal property names remain camelCase to match
 * TypeScript conventions.
 */

import type { SemanticRef } from './semantic.js';

/** A button-grouped semantic + primitive ref bundle. */
export interface ButtonComponentTokens {
  readonly heightTiny: SemanticRef;
  readonly heightSmall: SemanticRef;
  readonly heightMedium: SemanticRef;
  readonly heightLarge: SemanticRef;
  readonly paddingX: SemanticRef;
  readonly radius: SemanticRef;
  readonly fontSize: SemanticRef;
  readonly shadow: SemanticRef;
  readonly focusRing: SemanticRef;
}

export interface InputComponentTokens {
  readonly heightSmall: SemanticRef;
  readonly heightMedium: SemanticRef;
  readonly heightLarge: SemanticRef;
  readonly paddingX: SemanticRef;
  readonly radius: SemanticRef;
}

export interface CardComponentTokens {
  readonly padding: SemanticRef;
  readonly radius: SemanticRef;
  readonly shadow: SemanticRef;
}

/**
 * Icon component tokens — drives SnIcon / sn-icon geometry.
 *
 * Per Spec-01 v1.2 §2.3: icon sizing follows the same 5-tier rhythm as
 * button / input (tiny / small / medium / large / xlarge). The medium
 * tier matches the lucide 16px default — consumers rarely override.
 *
 * `strokeWidth` is the SVG `stroke-width` attribute value in design units
 * (lucide convention: 2 on a 24×24 grid). The `absoluteStrokeWidth`
 * SnIcon prop switches this from "scale with size" to "constant pixels"
 * — see lucide docs for the rationale.
 */
export interface IconComponentTokens {
  readonly sizeTiny: SemanticRef;
  readonly sizeSmall: SemanticRef;
  readonly sizeMedium: SemanticRef;
  readonly sizeLarge: SemanticRef;
  readonly sizeXlarge: SemanticRef;
  readonly strokeWidth: SemanticRef;
}

/**
 * Spin component tokens — drives SnLoading.
 *
 * Per naive-ui `spinLight`, the spinner inherits its colour from the action
 * (primary) colour and its size from the control heights; the content behind
 * a spinning overlay is dimmed by `opacitySpinning`, which upstream aliases to
 * the disabled opacity. `descriptionGap` is upstream's hard-coded 8px, lifted
 * into a token here so the Style axis can tighten or loosen it.
 */
export interface SpinComponentTokens {
  readonly color: SemanticRef;
  readonly textColor: SemanticRef;
  readonly sizeTiny: SemanticRef;
  readonly sizeSmall: SemanticRef;
  readonly sizeMedium: SemanticRef;
  readonly sizeLarge: SemanticRef;
  readonly sizeHuge: SemanticRef;
  readonly fontSize: SemanticRef;
  readonly opacitySpinning: SemanticRef;
  readonly descriptionGap: SemanticRef;
}

export interface SkeletonComponentTokens {
  readonly color: SemanticRef;
  readonly colorEnd: SemanticRef;
  readonly radius: SemanticRef;
  readonly heightSmall: SemanticRef;
  readonly heightMedium: SemanticRef;
  readonly heightLarge: SemanticRef;
}

export interface DialogComponentTokens {
  readonly color: SemanticRef;
  readonly textColor: SemanticRef;
  readonly titleTextColor: SemanticRef;
  readonly border: SemanticRef;
  readonly radius: SemanticRef;
  readonly padding: SemanticRef;
  readonly titleFontSize: SemanticRef;
  readonly titleFontWeight: SemanticRef;
  readonly fontSize: SemanticRef;
  readonly lineHeight: SemanticRef;
  readonly iconSize: SemanticRef;
  readonly iconMargin: SemanticRef;
  readonly iconMarginIconTop: SemanticRef;
  readonly iconColor: SemanticRef;
  readonly iconColorInfo: SemanticRef;
  readonly iconColorSuccess: SemanticRef;
  readonly iconColorWarning: SemanticRef;
  readonly iconColorError: SemanticRef;
  readonly contentMargin: SemanticRef;
  readonly actionSpace: SemanticRef;
  readonly closeSize: SemanticRef;
  readonly closeIconSize: SemanticRef;
  readonly closeMargin: SemanticRef;
  readonly closeMarginIconTop: SemanticRef;
  readonly closeColor: SemanticRef;
  readonly closeColorHover: SemanticRef;
  readonly closeIconColor: SemanticRef;
  readonly closeIconColorHover: SemanticRef;
}

export interface DrawerComponentTokens {
  readonly color: SemanticRef;
  readonly textColor: SemanticRef;
  readonly titleTextColor: SemanticRef;
  readonly boxShadow: SemanticRef;
  readonly lineHeight: SemanticRef;
  readonly radius: SemanticRef;
  readonly headerPadding: SemanticRef;
  readonly bodyPadding: SemanticRef;
  readonly footerPadding: SemanticRef;
  readonly titleFontSize: SemanticRef;
  readonly titleFontWeight: SemanticRef;
  readonly headerBorderBottom: SemanticRef;
  readonly footerBorderTop: SemanticRef;
  readonly closeSize: SemanticRef;
  readonly closeIconSize: SemanticRef;
  readonly closeIconColor: SemanticRef;
  readonly closeIconColorHover: SemanticRef;
  readonly closeColor: SemanticRef;
  readonly closeColorHover: SemanticRef;
  readonly maskColor: SemanticRef;
}

export interface ComponentTokens {
  readonly button: ButtonComponentTokens;
  readonly input: InputComponentTokens;
  readonly card: CardComponentTokens;
  readonly icon: IconComponentTokens;
  readonly spin: SpinComponentTokens;
  readonly skeleton: SkeletonComponentTokens;
  readonly dialog: DialogComponentTokens;
  readonly drawer: DrawerComponentTokens;
}

/**
 * Default Modern style component tokens. The Style axis can swap this entire
 * block (e.g. to a Glass-style that increases shadow + lowers radius).
 *
 * Per ADR-0002, every component token must be exposed under BOTH:
 *   - `--aui-button-{key}` (raw cascade output)
 *   - `--sn-button-{key}`   (brand alias — what components actually consume)
 */
export const DEFAULT_COMPONENT_TOKENS: ComponentTokens = {
  button: {
    heightTiny: '24px',
    heightSmall: '32px',
    heightMedium: '36px',
    heightLarge: '40px',
    paddingX: '16px',
    radius: '4px',
    fontSize: '14px',
    shadow: 'none',
    focusRing: 'rgba(22, 119, 255, 0.25)',
  },
  input: {
    heightSmall: '32px',
    heightMedium: '36px',
    heightLarge: '40px',
    paddingX: '12px',
    radius: '4px',
  },
  card: {
    padding: '24px',
    radius: '8px',
    shadow: '0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.06)',
  },
  icon: {
    sizeTiny: '12px',
    sizeSmall: '14px',
    sizeMedium: '16px',
    sizeLarge: '20px',
    sizeXlarge: '24px',
    strokeWidth: '2',
  },
  spin: {
    color: 'var(--aui-color-action-primary)',
    textColor: 'var(--aui-color-text-secondary)',
    sizeTiny: '14px',
    sizeSmall: '18px',
    sizeMedium: '24px',
    sizeLarge: '32px',
    sizeHuge: '40px',
    fontSize: 'var(--aui-font-size-md)',
    opacitySpinning: '0.55',
    descriptionGap: 'var(--aui-spacing-3)',
  },
  skeleton: {
    // `--aui-color-background-subtle` is the name actually emitted by the
    // static cascade (packages/tokens/styles/index.css). The `--aui-color-bg-*`
    // primitive family is resolver-only debt — never emitted anywhere — so
    // referencing it here left SnSkeleton's base color dangling.
    color: 'var(--aui-color-background-subtle)',
    colorEnd: 'var(--aui-color-border-subtle)',
    radius: 'var(--aui-radius-control)',
    heightSmall: '20px',
    heightMedium: '24px',
    heightLarge: '32px',
  },
  dialog: {
    color: 'var(--aui-color-background-elevated)',
    textColor: 'var(--aui-color-text-secondary)',
    titleTextColor: 'var(--aui-color-text-primary)',
    border: '1px solid var(--aui-color-border-default)',
    radius: 'var(--aui-radius-card)',
    padding: 'var(--aui-spacing-5)',
    titleFontSize: 'var(--aui-font-size-xl)',
    titleFontWeight: 'var(--aui-font-weight-semibold)',
    fontSize: 'var(--aui-font-size-md)',
    lineHeight: 'var(--aui-font-line-height-normal)',
    iconSize: '28px',
    iconMargin: '0 4px 0 0',
    iconMarginIconTop: '4px 0 8px 0',
    iconColor: 'var(--aui-color-action-primary)',
    iconColorInfo: 'var(--aui-color-feedback-info)',
    iconColorSuccess: 'var(--aui-color-feedback-success)',
    iconColorWarning: 'var(--aui-color-feedback-warning)',
    iconColorError: 'var(--aui-color-feedback-danger)',
    contentMargin: '8px 0 16px 0',
    actionSpace: '12px',
    closeSize: '22px',
    closeIconSize: '18px',
    closeMargin: '20px 26px 0 0',
    closeMarginIconTop: '10px 16px 0 0',
    closeColor: 'transparent',
    closeColorHover: 'var(--aui-color-background-subtle)',
    closeIconColor: 'var(--aui-color-text-secondary)',
    closeIconColorHover: 'var(--aui-color-text-primary)',
  },
  drawer: {
    color: 'var(--aui-color-background-elevated)',
    textColor: 'var(--aui-color-text-secondary)',
    titleTextColor: 'var(--aui-color-text-primary)',
    boxShadow: 'var(--aui-shadow-overlay)',
    lineHeight: 'var(--aui-font-line-height-normal)',
    radius: 'var(--aui-radius-card)',
    headerPadding: '16px 24px',
    bodyPadding: '16px 24px',
    footerPadding: '16px 24px',
    titleFontSize: 'var(--aui-font-size-xl)',
    titleFontWeight: 'var(--aui-font-weight-semibold)',
    headerBorderBottom: '1px solid var(--aui-color-border-subtle)',
    footerBorderTop: '1px solid var(--aui-color-border-subtle)',
    closeSize: '22px',
    closeIconSize: '18px',
    closeIconColor: 'var(--aui-color-text-secondary)',
    closeIconColorHover: 'var(--aui-color-text-primary)',
    closeColor: 'transparent',
    closeColorHover: 'var(--aui-color-background-subtle)',
    maskColor: 'var(--aui-color-background-overlay)',
  },
};
