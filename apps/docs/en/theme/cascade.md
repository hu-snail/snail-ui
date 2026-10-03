# Token cascade

Per ADR-0002 / Spec-01 §1, the priority order (low → high):

```text
1. Default Primitive Tokens
2. Theme override   → Primitive color + Semantic color
3. Style override   → Primitive radius / shadow + Component Token
4. Density override → Primitive spacing / size / fontSize
5. Variant override → Component Token
6. Instance override → flat record, top-most priority
```

Output: a flat `{ name, value }` list ordered Primitive → Semantic → Component, ready for `:root` injection or `style.setProperty`.

## Each axis may only override declared slots

```ts
export interface ThemeDefinition {
  readonly name: string
  readonly primitive?: Partial<PrimitiveTokens['color']>   // color only
  readonly semantic?: Partial<{...}>                       // color only
}

export interface StyleDefinition {
  readonly name: string
  readonly primitive?: {
    readonly radius?: Partial<PrimitiveTokens['radius']>  // radius only
    readonly shadow?: Partial<PrimitiveTokens['shadow']>  // shadow only
  }
  readonly component?: Partial<{                          // declared component slots only
    readonly button: Partial<ComponentTokens['button']>
    readonly input:  Partial<ComponentTokens['input']>
    readonly card:   Partial<ComponentTokens['card']>
  }>
}

export interface DensityDefinition {
  readonly name: string
  readonly primitive?: {
    readonly spacing?: Partial<PrimitiveTokens['spacing']>
    readonly size?:    Partial<PrimitiveTokens['size']>
    readonly font?:    Partial<...>
  }>
}
```

Per ADR-0002: a higher axis may only override what its type declaration allows. Theme cannot change radius; Style cannot change color; Density cannot change color or radius.

## resolveEnvironment behavior

```ts
const bindings = resolveEnvironment({
  theme: DARK_THEME,
  style: MODERN_STYLE,
  density: COMFORTABLE_DENSITY,
  instanceOverrides: { '--sn-button-radius': '0px' },
})
```

The returned `bindings` are sorted by dependency: Primitive first (referenced later), then Semantic, then Component. Instance overrides win last.

## Emit CSS variables

```ts
import { renderStyleBlock } from '@snui/tokens'

const css = renderStyleBlock(bindings)
// ":root {"
// "  --aui-color-blue-500: #1677ff;"
// "  --aui-color-action-primary: var(--aui-color-blue-500);"
// "  --aui-button-radius: 6px;"
// "  --sn-button-radius: var(--aui-button-radius);"
// "}"
```

Inject this into `:root` and you're done.

## Global vs Instance overrides

**Global** (recommended): call `snCssVars()` and inject `<style>` into `:root`, affects the whole app.

**Instance**: per-component, e.g. `<SnButton :style="{ '--sn-button-radius': '0px' }">` — affects only this button. The `instanceOverrides` parameter on resolve takes precedence over everything else.

## Where to next

- [Style Packs](/en/style-packs/overview)
- [AI Ecosystem](/en/ai/overview)