# 风格包（Style Pack）总览

Style Pack 是 snail-aui 的**风格一等公民**。它把 Token 覆盖 + 皮肤 CSS + 资源 三层组合在一起，让用户能一键切换 iOS、涂鸦、便签、抖音、淘宝 等风格。

## 为什么需要三层

仅靠修改 Token 变量（颜色 / 圆角 / 间距）做不出涂鸦、便签、抖音 这种**视觉人格**——手绘边框、手写字体、霓虹发光必须靠 CSS 实现。所以 Style Pack 由三层组成：

| 层 | 内容 | 必须 |
|---|---|---|
| **Token 层** | 颜色 / 圆角 / 间距覆盖（`snCssVars()`）| ✅ 所有 Pack |
| **皮肤 CSS 层** | `.snui-skin-{name}` 作用域 CSS（字体 / 装饰 / 特效） | 仅需要视觉人格的 Pack（涂鸦 / 抖音） |
| **资源层** | 字体 / 纹理 / SVG | 仅个别 Pack（抖音 / 淘宝） |

**硬约束**：皮肤 CSS 只能操作视觉层（颜色、阴影、字体、动画、伪元素），不能修改组件 DOM / Props / 行为。

## 官方 Pack 路线图

| Pack | 视觉特征 | 层 | 交付 |
|---|---|---|---|
| `default` | 6px 圆角，微妙阴影，蓝色 | Token | M2 ✅ |
| `dark` | 低饱和度暗色 | Token | M2 ✅ |
| `ios` | 大圆角，无阴影，苹果蓝 | Token | M2 ✅ |
| `doodle` | 手绘边框，手写字体，黑白 | Token + 皮肤 CSS | M3 |
| `sticky-note` | 暖黄背景，倾斜阴影 | Token + 皮肤 CSS | M3 |
| `taobao` | 橙红主色，圆润圆角 | Token + 皮肤 CSS | M4 |
| `douyin` | 深色底，红青主色，霓虹 glow | Token + 皮肤 CSS + 资源 | M4 |

## 用法

### Web 端：直接调用 `snCssVars()`

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

### Web 端：配合 ConfigProvider

```vue
<SnConfigProvider skin="ios">
  <SnButton type="primary">按钮</SnButton>
</SnConfigProvider>
```

ConfigProvider 内部把 `skin="ios"` 写到 `document.body.classList`，皮肤 CSS 立刻生效。

### uni 端：通过 ConfigProvider prop

```vue
<sn-config-provider skin="doodle">
  <sn-button type="primary">按钮</sn-button>
</sn-config-provider>
```

小程序不支持 `:root` 和属性选择器，ConfigProvider 根元素直接加 `.snui-skin-doodle` class，皮肤 CSS 走组件 scoped。

## 文档站交互

文档站右上角的 **StyleSwitcher** 列出所有官方 Pack，点击即时切换页面内所有组件的 Token 变量。

每个组件页还有 **StylePackPreview** 横向展示该组件在不同 Pack 下的渲染效果。

页面下方的 **ThemeCopier** 展示当前 Pack 的 `snCssVars(...)` 完整代码片段，一键复制。

## 自定义 Pack

发布你自己的 Pack：

```ts
import type { StylePackDefinition } from '@snui/style-packs'

const myPack: StylePackDefinition = {
  name: 'my-brand',
  label: 'My Brand',
  description: 'Custom brand skin.',
  style: {
    name: 'modern',
    primitive: { radius: { md: '8px' } },
    component: { button: { radius: '8px' } },
  },
  skinCss: '/packs/my-brand.skin.css',  // 可选
}
```

校验合法性：

```bash
pnpm snui pack validate
```

## 下一步

- [iOS 风格](/style-packs/ios)
- [自定义风格包](/style-packs/custom)