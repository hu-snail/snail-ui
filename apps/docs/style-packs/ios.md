# iOS 风格

iOS 风格是 snail-aui 默认提供的风格包之一，完全在 Token 层实现（不需要皮肤 CSS）。参考 Apple Human Interface Guidelines。

## 视觉特征

| 维度 | 默认 | iOS |
|---|---|---|
| 圆角（control）| 6px | 12px |
| 圆角（card）| 8px | 16px |
| 阴影 | 微妙（subtle）| 无 |
| 边框 | 1px 细线 | 0.5px 细线 |
| 主色 | `#1677ff`（蓝色）| `#007AFF`（苹果蓝）|
| 按钮 hover | `#4096ff` | `#3395FF` |

## 用法

```ts
import { snCssVars } from '@snui/tokens'
import { iosPack } from '@snui/style-packs/ios'

const el = document.createElement('style')
el.textContent = snCssVars({
  theme: iosPack.theme,
  style: iosPack.style,
  density: iosPack.density,
})
document.head.appendChild(el)
```

或用 ConfigProvider：

```vue
<SnConfigProvider skin="ios">
  <SnButton type="primary">按钮</SnButton>
</SnConfigProvider>
```

## 实际效果

文档站右上角的 StyleSwitcher 选中 iOS 即可在所有组件文档页即时看到效果。每个组件页下方的 StylePackPreview 也并排展示 iOS 风格。

## 下一步

- [风格包总览](/style-packs/overview)
- [自定义风格包](/style-packs/custom)