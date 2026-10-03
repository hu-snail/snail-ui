# Token 级联

按 ADR-0002 + Spec-01 §1，Token 解析顺序（优先级低 → 高）：

```text
1. 默认 Primitive Tokens
2. Theme 覆盖 → Primitive color + Semantic color
3. Style 覆盖 → Primitive radius/shadow + Component Tokens
4. Density 覆盖 → Primitive spacing/size/fontSize
5. Variant 覆盖 → Component Tokens
6. Instance 覆盖 → flat record，顶层优先级
```

输出：扁平 `{ name, value }` 列表，按 Primitive → Semantic → Component 顺序排列。

## 高层只能覆盖明确声明允许的 Token

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

## 端独立的别名层（v3.1 新增）

```text
@snui/tokens 输出 --aui-* 原始层
   ↓
@snui/tokens-web  生成 --sn-web-* 别名（Web 端独立 dist）
@snui/tokens-mp   生成 --sn-mp-* 别名（uni 端独立 dist + rpx 转换）
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

按依赖顺序：Primitive 先，Semantic 后，Component 最后。Instance overrides 顶优先级。

## snCssVars + 端参数

```ts
import { snCssVars } from '@snui/tokens'

// Web 端（输出 --sn-web-* 别名）
const webCss = snCssVars({
  end: 'web',
  theme: DARK_THEME,
  style: MODERN_STYLE,
})

// uni 端（输出 --sn-mp-* 别名 + rpx）
const mpCss = snCssVars({
  end: 'mp',
  theme: DARK_THEME,
  style: MODERN_STYLE,
})
```

## 全局 vs 实例

**全局**：注入 `<style>` 到 `:root`，影响整个应用。

**实例**：组件级 `<SnButton :style="{ '--sn-web-button-radius': '0px' }">` —— 只影响单个按钮。

## 下一步

- [风格包](/style-packs/overview)
- [AI 生态](/ai/overview)