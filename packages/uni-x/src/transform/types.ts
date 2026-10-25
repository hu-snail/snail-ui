/** Issue kinds emitted by the .vue → .uvue transform pipeline (ADR-0004). */
export type IssueKind =
  | 'pseudo-element'
  | 'pseudo-class'
  | 'attribute-selector'
  | 'tag-only-selector'
  | 'combinator-unsupported'
  | 'unsupported-property'
  | 'stray-sfc-content'
  | 'template-bare-text'
  | 'template-attr'
  | 'script-guard'
  | 'defineSlots-stripped'
  | 'defineSlots-manual'
  | 'patch';

export interface TransformIssue {
  file: string;
  kind: IssueKind;
  detail: string;
  line?: number | undefined;
}

export interface CssTransformResult {
  css: string;
  issues: TransformIssue[];
}

export interface TextTransformResult {
  code: string;
  issues: TransformIssue[];
}

export type CssMode = 'component' | 'tokens';
