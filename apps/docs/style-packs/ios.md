# iOS 风格

iOS 风格是 snail-aui 默认提供的风格包之一，完全在 **Token 层**实现（不需要皮肤 CSS）。参考 Apple Human Interface Guidelines。

> **v3.1 端独立**：`ios` Pack `end: 'both'`，Web 和 uni 两端都可用。Web 端应用后产生 `--sn-web-button-radius: 12px`（px）；uni 端应用后产生 `--sn-mp-button-radius: 24rpx`（rpx 转换）。

---

## 视觉特征

| 维度 | default | iOS |
|---|---|---|
| 圆角（control）| 6px | 12px |
| 圆角（card）| 8px | 16px |
| 阴影 | 微妙（subtle）| 无 |
| 边框 | 1px 细线 | 0.5px 细线 |
| 主色 | `#1677ff`（蓝色）| `#007AFF`（苹果蓝）|
| 按钮 hover | `#4096ff` | `#3395FF` |

---

## Web 端用法（`@snui/vue-web`）

直接调用 `snCssVars()`：

```ts
// @snui/vue-web 项目
import { snCssVars } from '@snui/tokens'
import '@snui/tokens-web/styles'
import { iosPack } from '@snui/style-packs/ios'

const el = document.createElement('style')
el.textContent = snCssVars({
  end: 'web',
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

ConfigProvider 内部把 `skin="ios"` 写到 `document.body.classList`，皮肤 CSS 立刻生效。

---

## uni 端用法（`@snui/uni`）

```vue
<!-- @snui/uni 项目，tokens-mp 自动把 px 转 rpx -->
<sn-config-provider skin="ios">
  <sn-button type="primary">按钮</sn-button>
</sn-config-provider>
```

iOS 风格在移动端的视觉效果：大圆角、无阴影、半透明背景——典型 iOS App 风格。

---

## 实际效果

文档站右上角的 StyleSwitcher 选中 iOS 即可在所有组件文档页即时看到效果。每个组件页下方的 StylePackPreview 也并排展示 iOS 风格。

> 端切换：iOS Pack 在 `/guide/web/` 和 `/guide/uni/` 两侧的组件页都能看到。在 uni 端，按钮圆角会按 rpx 单位换算（如 Web 12px → uni 24rpx）。

---

## 为什么不需要皮肤 CSS

iOS 风格的"视觉人格"完全靠 Token 层就能表达：

- 圆角 12px → `primitive.radius.md`
- 无阴影 → `style.component.card.shadow: none`
- 苹果蓝 → `theme.semantic.action.primary`

不需要伪元素、字体、手绘边框。所以 iOS Pack 只声明 Token 字段，不挂 `skinCss`。

---

## 下一步

- [风格包总览](/style-packs/overview)
- [自定义风格包](/style-packs/custom)
- [Token 三层级联](/theme/cascade)