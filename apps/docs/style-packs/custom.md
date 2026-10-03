# 自定义 Style Pack

发布你自己的风格包，把团队品牌 / 客户定制作为可复用资产。

## 定义

```ts
// my-brand/styles/skin.ts
import type { StylePackDefinition } from '@snui/style-packs'

export const myBrandPack: StylePackDefinition = {
  name: 'my-brand',
  label: 'My Brand',
  description: '官方品牌皮肤 — 主色橙红，圆角 8px，微妙阴影。',

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
      button: { radius: 'var(--aui-radius-md)' },
      card: { radius: 'var(--aui-radius-lg)', shadow: 'var(--aui-shadow-md)' },
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
  border-top: 3px solid var(--sn-color-action-primary);
}
```

## 校验

```bash
pnpm snui pack validate
```

会检查：
- `name` (kebab-case)、`label`、`description` 都存在
- `style.component` 字段名存在于 `@snui/tokens` 的 ComponentTokens 类型
- `theme` 不包含非颜色字段
- 皮肤 CSS 文件存在（如声明了 `skinCss`）

## 应用

```ts
import { snCssVars } from '@snui/tokens'
import { myBrandPack } from './styles/my-brand'

const el = document.createElement('style')
el.textContent = snCssVars({
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

## 边界约束

**禁止**：

- 修改组件 .vue 文件
- 通过组件属性覆盖引用层（如 `background: #fff`）
- 在皮肤 CSS 中用 `!important`
- 在皮肤 CSS 中用深层 DOM 选择器（依赖 `data-snui-component` 钩子）
- 在 `theme` 字段中放非颜色 token
- 在 `style` 字段中放颜色 token

**允许**：

- 覆盖颜色、圆角、阴影、间距、组件 Token 字段
- 在皮肤 CSS 中加伪元素、动画、字体
- 在皮肤 CSS 中通过 `data-snui-component` 钩子选择

## 下一步

- [Token 级联](/theme/cascade)
- [AI 生态](/ai/overview)