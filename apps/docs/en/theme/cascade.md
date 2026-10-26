# Token cascade

Per ADR-0002 + Spec-01 §1, the priority order (low → high):

```text
1. Default Primitive Tokens
2. Theme override   → Primitive color + Semantic color
3. Style override   → Primitive radius / shadow + Component Token
4. Density override → Primitive spacing / size / fontSize
5. Variant override → Component Token
6. Instance override → flat record, top-most priority
```

Output: a flat `{ name, value }` list ordered Primitive → Semantic → Component.

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
  readonly component?: Partial<{
    readonly button: Partial<ComponentTokens['button']>
    readonly input:  Partial<ComponentTokens['input']>
    readonly card:   Partial<ComponentTokens['card']>
  }>
}
```

## End-aware alias layers (v3.1)

```text
@snui/tokens emits --aui-* raw layer
   ↓
@snui/tokens-web  emits --sn-web-* aliases (Web independent dist)
@snui/tokens-mp   emits --sn-mp-* aliases (uni independent dist + rpx)
```

## resolveEnvironment

```ts
const bindings = resolveEnvironment({
  theme: DARK_THEME,
  style: MODERN_STYLE,
  density: COMFORTABLE_DENSITY,
  instanceOverrides: { '--sn-web-button-radius': '0px' },
})
```

Dependency order: Primitive first, then Semantic, then Component. Instance overrides win.

## snCssVars + end parameter

```ts
import { snCssVars } from '@snui/tokens'

// Web (emits --sn-web-* aliases)
const webCss = snCssVars({
  end: 'web',
  theme: DARK_THEME,
  style: MODERN_STYLE,
})

// uni (emits --sn-mp-* aliases + rpx)
const mpCss = snCssVars({
  end: 'mp',
  theme: DARK_THEME,
  style: MODERN_STYLE,
})
```

## Global vs Instance

**Global**: inject `<style>` into `:root`, affects the whole app.

**Instance**: per-component, e.g. `<SnButton :style="{ '--sn-web-button-radius': '0px' }">` — affects only this button.

## Where to next

- [Style Packs](/en/style-packs/overview)
- [AI Ecosystem](/en/ai/overview)