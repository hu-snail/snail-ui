# 风格包（Style Pack）总览

Style Pack 是 snail-aui 的**风格一等公民**。它把 **Token 覆盖 + 皮肤 CSS + 资源** 三层组合在一起，让用户能一键切换 iOS、涂鸦、便签、抖音、淘宝 等风格。

> **v3.1 端独立更新**：Style Pack 本身**跨端共用**（`@snui/style-packs`），但消费入口按端区分：Web 端通过 `@snui/tokens-web` 输出的 `--sn-web-*` 别名层应用，uni 端通过 `@snui/tokens-mp` 输出的 `--sn-mp-*` 别名层应用。每个 Pack 还带 `end: 'web' | 'mp' | 'both'` 字段，标记可应用端。

---

## 为什么需要三层

仅靠修改 Token 变量（颜色 / 圆角 / 间距）做不出涂鸦、便签、抖音 这种**视觉人格**——手绘边框、手写字体、霓虹发光必须靠 CSS 实现。所以 Style Pack 由三层组成：

| 层 | 内容 | 必须 |
|---|---|---|
| **Token 层** | 颜色 / 圆角 / 间距覆盖（`snCssVars({ end })`）| ✅ 所有 Pack |
| **皮肤 CSS 层** | `.snui-skin-{name}` 作用域 CSS（字体 / 装饰 / 特效） | 仅需要视觉人格的 Pack（涂鸦 / 抖音） |
| **资源层** | 字体 / 纹理 / SVG | 仅个别 Pack（抖音 / 淘宝） |

**硬约束**：皮肤 CSS 只能操作视觉层（颜色、阴影、字体、动画、伪元素），不能修改组件 DOM / Props / 行为。

---

## 官方 Pack 路线图

| Pack | 视觉特征 | 层 | `end` | 交付 |
|---|---|---|---|---|
| `default` | 6px 圆角，微妙阴影，蓝色 | Token | `both` | M2 ✅ |
| `dark` | 低饱和度暗色 | Token | `both` | M2 ✅ |
| `ios` | 大圆角，无阴影，苹果蓝 | Token | `both` | M2 ✅ |
| `doodle` | 手绘边框，手写字体，黑白 | Token + 皮肤 CSS | `both` | M3 |
| `sticky-note` | 暖黄背景，倾斜阴影 | Token + 皮肤 CSS | `both` | M3 |
| `mp-taobao` | 橙红主色，圆润圆角 | Token + 皮肤 CSS | `mp` | M4 |
| `mp-douyin` | 深色底，红青主色，霓虹 glow | Token + 皮肤 CSS + 资源 | `mp` | M4 |

> **端约束**：`mp-taobao` / `mp-douyin` 在 Web 端不可用——它们针对移动端密集布局 / rpx 单位设计。文档站 StyleSwitcher 与 MCP `get_style_pack` 会自动按 `end` 过滤。

---

## 用法（端独立）

### Web 端（PC 桌面）

```ts
// @snui/vue-web 项目
import { snCssVars } from '@snui/tokens'
import '@snui/tokens-web/styles'  // 引入 --sn-web-* 别名层
import { iosPack } from '@snui/style-packs/ios'

const el = document.createElement('style')
el.textContent = snCssVars({
  end: 'web',           // ← 端标识，决定输出 --sn-web-* 别名
  theme: iosPack.theme,
  style: iosPack.style,
  density: iosPack.density,
})
document.head.appendChild(el)
```

或通过 ConfigProvider：

```vue
<!-- @snui/vue-web -->
<SnConfigProvider skin="ios">
  <SnButton type="primary">按钮</SnButton>
</SnConfigProvider>
```

ConfigProvider 内部把 `skin="ios"` 写到 `document.body.classList`，皮肤 CSS 立刻生效。

### uni 端（移动端 / 小程序 / H5）

```ts
// @snui/uni 项目
import { snCssVars } from '@snui/tokens'
import '@snui/tokens-mp/styles'   // 引入 --sn-mp-* 别名层（rpx 单位）
import { doodlePack } from '@snui/style-packs/doodle'

const cssText = snCssVars({
  end: 'mp',            // ← 端标识，输出 --sn-mp-* 别名 + rpx 转换
  theme: doodlePack.theme,
  style: doodlePack.style,
  density: doodlePack.density,
})
// uni 端无 document.head，通过 ConfigProvider 注入
```

```vue
<!-- @snui/uni -->
<sn-config-provider skin="doodle">
  <sn-button type="primary">按钮</sn-button>
</sn-config-provider>
```

小程序不支持 `:root` 和属性选择器，ConfigProvider 根元素直接加 `.snui-skin-doodle` class，皮肤 CSS 走组件 scoped。

### 端独立的 0 行源代码复用

Web 端组件（`@snui/vue-web`）写 CSS 时用 `var(--sn-web-*)`，uni 端组件（`@snui/uni`）用 `var(--sn-mp-*)`，**两端组件源代码完全独立**。Style Pack 是两端共用的主题资源，但通过 `end` 字段决定适用端。

---

## 文档站交互

文档站右上角的 **StyleSwitcher** 列出所有官方 Pack，点击即时切换页面内所有组件的 Token 变量。

| 页面 | StyleSwitcher 列出 |
|---|---|
| `/guide/web/{...}` | `end: 'web' \| 'both'` 的 Pack（default / dark / ios / doodle / sticky-note） |
| `/guide/uni/{...}` | `end: 'mp' \| 'both'` 的 Pack（default / dark / ios / doodle / sticky-note / mp-taobao / mp-douyin） |

每个组件页还有 **StylePackPreview** 横向展示该组件在不同 Pack 下的渲染效果。

页面下方的 **ThemeCopier** 展示当前 Pack 的 `snCssVars(...)` 完整代码片段，一键复制。

---

## 自定义 Pack

发布你自己的 Pack：

```ts
import type { StylePackDefinition } from '@snui/style-packs'

const myPack: StylePackDefinition = {
  name: 'my-brand',
  label: 'My Brand',
  description: 'Custom brand skin.',

  // 跨端共用 — 不指定 end 默认 'both'
  // end: 'mp'  // ← 仅移动端

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

校验会检查：

- `name` (kebab-case)、`label`、`description` 都存在
- `end` 字段（`'web' | 'mp' | 'both'`）合法
- `style.component` 字段名存在于 `@snui/tokens` 的 ComponentTokens 类型
- `theme` 不包含非颜色字段
- 皮肤 CSS 文件存在（如声明了 `skinCss`）

---

## 下一步

- [iOS 风格](/style-packs/ios)
- [自定义风格包](/style-packs/custom)
- [Token 三层级联](/theme/cascade)
- [AI 生态](/ai/overview)