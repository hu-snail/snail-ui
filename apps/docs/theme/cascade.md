# Token 级联

从 primitive 到 component 的完整级联，并附示例绑定。

## Primitive

原始设计值，没有语义含义。Theme 掌管这里。

```text
color.gray.50    = #fafafa
color.gray.900   = #171717
color.blue.500   = #1677ff
spacing.4        = 12px
radius.md        = 6px
font.size.md     = 14px
shadow.md        = 0 4px 8px rgba(0,0,0,0.08)
motion.duration.base = 200ms
size.control.md  = 32px
```

## Semantic

语义别名通过 `var()` 引用 primitive。

```text
color.text.primary     → var(--aui-color-text-primary)
color.action.primary   → var(--aui-color-action-primary)
spacing.inset.md       → var(--aui-spacing-inset-md)
radius.control         → var(--aui-radius-control)
size.control.md        → var(--aui-size-control-md)
```

解析后（Light Theme）：

```text
--aui-color-text-primary   → var(--aui-color-gray-900)
--aui-color-gray-900       → #171717
--aui-color-action-primary → var(--aui-color-blue-500)
--aui-color-blue-500       → #1677ff
```

## Component

Component token 引用 semantic。

```text
button.heightMd       → var(--aui-size-control-md)
button.radius         → var(--aui-radius-control)
button.paddingX       → var(--aui-spacing-inset-md)
button.shadow         → var(--aui-shadow-control)
input.height          → var(--aui-size-control-md)
card.padding         → var(--aui-spacing-inset-lg)
card.radius          → var(--aui-radius-card)
```

解析后：

```text
--aui-button-height-md  → var(--aui-size-control-md)  → var(--aui-size-control-md)  → 32px
--aui-button-radius     → var(--aui-radius-control)   → var(--aui-radius-md)       → 6px
```

## Component CSS 只使用 token

组件永远不硬编码颜色 / 尺寸 / 间距：

```css
/* ✅ 正确 */
.snui-button {
  background: var(--aui-color-action-primary);
  border-radius: var(--aui-button-radius);
  height: var(--aui-button-height-md);
}

/* ❌ 禁止 */
.snui-button {
  background: #1677ff;
  border-radius: 6px;
  height: 32px;
}
```

硬编码版本把组件锁死到特定的 Theme / Style / Density。Token 版本会跟随宿主选定的维度组合切换。

## Resolver 输出

```ts
import { resolveEnvironment, renderStyleBlock } from '@snui/tokens';

const env = {
  theme: LIGHT_THEME,
  style: MODERN_STYLE,
  density: COMFORTABLE_DENSITY,
};

const bindings = resolveEnvironment(env);
console.log(bindings.length);     // ~110 项
console.log(bindings[0]);
// { name: '--aui-color-gray-50', value: '#fafafa' }
console.log(bindings.find(b => b.name === '--aui-color-blue-500'));
// { name: '--aui-color-blue-500', value: '#1677ff' }
console.log(bindings.find(b => b.name === '--aui-button-radius'));
// { name: '--aui-button-radius', value: 'var(--aui-radius-control)' }

renderStyleBlock(bindings);
// → ":root { --aui-color-gray-50: #fafafa; ... }"
```

## 下一步

- [Theme（Light / Dark）](/theme/theme)
- [Style（Modern / Glass / Minimal）](/theme/style)
- [Density（Compact / Comfortable）](/theme/density)