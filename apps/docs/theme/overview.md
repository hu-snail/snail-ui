# Theme / Style / Density

AUI 把 tokens 拆分成三个互相独立的维度。运行时切换任一维度都不会影响其他两个。

| 轴 | 职责 | 切换示例 |
| --- | --- | --- |
| **Theme** | 颜色（text / background / border / action / feedback） | Light、Dark |
| **Style** | 圆角、阴影、组件形状 | Modern、Glass、Minimal |
| **Density** | 尺寸、间距、字号 | Compact、Comfortable |

三个维度 **永远不会** 隐式相互影响（AUI-PRD-v1.2.md §36：「三个维度不得隐式修改其他维度」）。改 Theme 不会动 spacing；改 Density 不会动颜色。

## 级联

```
默认值
   ↓
Theme 覆盖     → primitive.color + semantic.color
   ↓
Style 覆盖     → primitive.radius/shadow + component tokens
   ↓
Density 覆盖   → primitive.spacing/size/font.size
   ↓
Variant         → component 令牌（per-instance preset）
   ↓
Instance 覆盖   → flat Record<string, string>（最上层）
```

## Tokens 即 CSS 变量

Resolver 输出扁平的 `TokenBinding[]`：

```ts
{ name: '--aui-color-blue-500', value: '#1677ff' }
{ name: '--aui-color-text-primary', value: 'var(--aui-color-blue-500)' }
{ name: '--aui-button-radius', value: 'var(--aui-radius-control)' }
```

组件消费 `var(--aui-color-action-primary)`——从不直接接触原始 primitive。这意味着切换 Theme 只改绑定表，组件代码无需修改。

## 本节页面

- [Theme（Light / Dark）](/theme/theme)
- [Style（Modern / Glass / Minimal）](/theme/style)
- [Density（Compact / Comfortable）](/theme/density)
- [Token 级联](/theme/cascade)

## 编程式 API

```ts
import { resolveEnvironment, renderStyleBlock } from '@snui/tokens';

const env = {
  theme: LIGHT_THEME,
  style: MODERN_STYLE,
  density: COMFORTABLE_DENSITY,
  // 可选的实例覆盖
  instanceOverrides: {
    '--aui-color-action-primary': '#ff5500',
  },
};

const bindings = resolveEnvironment(env);

// 注入为 CSS 字符串：
const css = renderStyleBlock(bindings);
document.head.insertAdjacentHTML('beforeend', `<style>${css}</style>`);

// 或者直接挂到宿主元素上：
for (const { name, value } of bindings) {
  document.documentElement.style.setProperty(name, value);
}
```

完整默认尺度见 [`@snui/tokens` 源码](https://github.com/hu-snail/snail-ui)。