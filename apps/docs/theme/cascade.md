# Token 级联

按 ADR-0002 / Spec-01 §1，Token 解析顺序（优先级低 → 高）：

```text
1. 默认 Primitive Tokens
2. Theme 覆盖 → Primitive color + Semantic color
3. Style 覆盖 → Primitive radius/shadow + Component Tokens
4. Density 覆盖 → Primitive spacing/size/fontSize
5. Variant 覆盖 → Component Tokens
6. Instance 覆盖 → flat record，顶层优先级
```

输出：一个 `{ name, value }` 列表，按 Primitive → Semantic → Component 顺序排列，可直接注入 `:root` 或 `style.setProperty`。

## 高层只能覆盖明确声明允许的 Token

```ts
export interface ThemeDefinition {
  readonly name: string
  readonly primitive?: Partial<PrimitiveTokens['color']>   // ✅ 只允许 color
  readonly semantic?: Partial<{...}>                       // ✅ 只允许 color
}

export interface StyleDefinition {
  readonly name: string
  readonly primitive?: {
    readonly radius?: Partial<PrimitiveTokens['radius']>  // ✅ 只允许 radius
    readonly shadow?: Partial<PrimitiveTokens['shadow']>  // ✅ 只允许 shadow
  }
  readonly component?: Partial<{                          // ✅ 只允许 Component Token 字段
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
  }
}
```

按 ADR-0002：高一层只能覆盖明确声明允许覆盖的 Token。Theme 不能改圆角；Style 不能改颜色；Density 不能改颜色或圆角。

## resolveEnvironment 行为

```ts
const bindings = resolveEnvironment({
  theme: DARK_THEME,
  style: MODERN_STYLE,
  density: COMFORTABLE_DENSITY,
  instanceOverrides: { '--sn-button-radius': '0px' },
})
```

返回的 `bindings` 已经按依赖顺序排好：Primitive 先（被后面的引用），然后 Semantic，然后 Component。Instance overrides 最后。

## 输出 CSS 变量

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

把它注入 `:root` 即可应用。

## 全局 vs 实例覆盖

**全局**（推荐）：通过 `snCssVars()` 注入 `<style>` 到 `:root`，影响整个应用。

**实例**：组件级 `<SnButton :style="{ '--sn-button-radius': '0px' }">` —— 只影响这一个按钮。`instanceOverrides` 参数走 resolve 流程，优先级最高。

## 下一步

- [风格包（Style Pack）](/style-packs/overview)
- [AI 生态](/ai/overview)