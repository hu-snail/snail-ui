/**
 * SnEquation types — shared contract for the equation component.
 */

/**
 * Structural katex contract — only `renderToString` is consumed. Accepts
 * the bundled katex namespace or any consumer-provided compatible object
 * (mirrors n-equation's `katex` prop).
 */
export interface SnEquationKatex {
  renderToString(expression: string, options?: Record<string, unknown>): string;
}
