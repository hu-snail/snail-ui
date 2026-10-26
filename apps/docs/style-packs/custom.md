# 自定义 Style Pack

发布你自己的风格包，把团队品牌 / 客户定制作为可复用资产。

> **v3.1 端独立**：自定义 Pack 默认 `end: 'both'`（跨端共用）。如果 Pack 仅针对移动端（如依赖 rpx 单位的密集布局），显式声明 `end: 'mp'`。CLI `pack validate` 会校验 `end` 合法性。

---

## 定义

```ts
// my-brand/styles/skin.ts
import type { StylePackDefinition } from '@snui/style-packs'

export const myBrandPack: StylePackDefinition = {
  name: 'my-brand',
  label: 'My Brand',
  description: '官方品牌皮肤 — 主色橙红，圆角 8px，微妙阴影。',

  // 跨端共用 — 默认 'both'，可省略
  // end: 'mp'  // ← 仅移动端

  // Token 层 — 覆盖品牌主色
  theme: {
    name: 'my-brand-light',
    semantic: {
      action: {
        primary: '#ff5722',
        primaryHover: '#ff7043',
      },
    },
  },

  // Style 轴 — 圆角 + 阴影
  style: {
    name: 'my-brand',
    primitive: {
      radius: { sm: '6px', md: '8px', lg: '12px', xl: '16px' },
      shadow: {
        sm: '0 1px 3px rgba(0,0,0,0.10)',
        md: '0 4px 12px rgba(0,0,0,0.12)',
      },
    },
    component: {
      button: { radius: '8px' },
      card: { radius: '12px', shadow: '0 4px 12px rgba(0,0,0,0.12)' },
    },
  },

  // 皮肤 CSS 层 — 可选，覆盖组件视觉人格
  skinCss: '/packs/my-brand.skin.css',
}
```

皮肤 CSS 例子：

```css
/* my-brand/public/packs/my-brand.skin.css */
.snui-skin-my-brand [data-snui-component="button"] {
  font-weight: 600;
  letter-spacing: 0.02em;
}

.snui-skin-my-brand [data-snui-component="card"] {
  border-top: 3px solid #ff5722;
}
```

> 皮肤 CSS 中的颜色值可以用字面量（**不是** Token），因为皮肤 CSS 是端无关的视觉人格覆盖。如果想保持 Token 驱动，用 `var(--aui-color-action-primary)` 等基础变量（注意：**不要**用 `--sn-web-*` 或 `--sn-mp-*` 别名，皮肤 CSS 跨端共用）。

---

## 校验

```bash
pnpm snui pack validate
```

会检查：

- `name` (kebab-case)、`label`、`description` 都存在
- `end` 字段（`'web' | 'mp' | 'both'`，默认 `'both'`）合法
- `style.component` 字段名存在于 `@snui/tokens` 的 ComponentTokens 类型
- `theme` 不包含非颜色字段
- 皮肤 CSS 文件存在（如声明了 `skinCss`）

---

## 应用

### Web 端

```ts
import { snCssVars } from '@snui/tokens'
import '@snui/tokens-web/styles'
import { myBrandPack } from './styles/my-brand'

const el = document.createElement('style')
el.textContent = snCssVars({
  end: 'web',
  theme: myBrandPack.theme,
  style: myBrandPack.style,
  density: myBrandPack.density,
})
document.head.appendChild(el)

// 同时加载皮肤 CSS
if (myBrandPack.skinCss) {
  const link = document.createElement('link')
  link.rel = 'stylesheet'
  link.href = myBrandPack.skinCss
  document.head.appendChild(link)
}
```

或者用 ConfigProvider：

```vue
<SnConfigProvider skin="my-brand">
  <App />
</SnConfigProvider>
```

### uni 端

```vue
<!-- @snui/uni，end: 'mp' 自动转换 px → rpx -->
<sn-config-provider skin="my-brand">
  <app />
</sn-config-provider>
```

> **端约束**：自定义 Pack 如果只针对 `pm`（如用了 `@media (max-width: 480px)` 等移动专属样式），声明 `end: 'mp'`。文档站 StyleSwitcher 与 MCP `get_style_pack` 会自动按 `end` 过滤，避免在 Web 端误用。

---

## 边界约束

**禁止**：

- 修改组件 .vue 文件
- 通过组件属性覆盖引用层（如 `background: #fff`）
- 在皮肤 CSS 中用 `!important`
- 在皮肤 CSS 中用深层 DOM 选择器（依赖 `data-snui-component` 钩子）
- 在 `theme` 字段中放非颜色 token
- 在 `style` 字段中放颜色 token
- **在 Token / 皮肤 CSS 中用 `--sn-web-*` 或 `--sn-mp-*` 别名**（Skin 是跨端共用层，端无关）

**允许**：

- 覆盖颜色、圆角、阴影、间距、组件 Token 字段
- 在皮肤 CSS 中加伪元素、动画、字体
- 在皮肤 CSS 中通过 `data-snui-component` 钩子选择
- 在皮肤 CSS 中用字面量颜色（视觉人格覆盖不强制走 Token）

---

## 下一步

- [Token 级联](/theme/cascade)
- [AI 生态](/ai/overview)