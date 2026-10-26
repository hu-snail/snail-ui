# Equation · Web (PC)

LaTeX math rendering (mirrors n-equation). KaTeX is bundled — works out of
the box, with displayMode / custom macros / renderer override support.

## When to use

- Displaying LaTeX math expressions inline or in display mode
- Academic / educational content typesetting
- Advanced cases needing custom KaTeX macros or a swapped renderer

## Examples

### Basic usage

<Demo name="equation-web-basic" description="Inline and display-mode formulas." />

### Katex options

<Demo name="equation-web-katex-options" description="displayMode, fleqn and custom macros." />

## API

### SnEquation Props

| Prop         | Type                      | Default     | Description                                                                                                         |
| ------------ | ------------------------- | ----------- | ------------------------------------------------------------------------------------------------------------------- |
| value        | `string`                  | `''`        | LaTeX expression                                                                                                    |
| katex        | `SnEquationKatex`         | `undefined` | Custom katex-like renderer; the bundled katex is used by default                                                    |
| katexOptions | `Record<string, unknown>` | `undefined` | Options forwarded to `renderToString` (e.g. `displayMode` / `macros` / `fleqn`); `throwOnError` defaults to `false` |

No events, no slots. The rendered wrapper tag/class is extracted from the
katex output (`span.katex` inline, `span.katex-display` block) and carries
`data-snui-component="equation"`.

KaTeX CSS + fonts ship with the `@snui/vue-web/styles` barrel — no extra
import required.
