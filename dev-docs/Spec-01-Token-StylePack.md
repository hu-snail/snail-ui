# Spec-01：Token 系统与 Style Pack 规范

**版本**：v1.1  
**状态**：Active  
**对应**：PRD v3.0 §3 / Architecture v3.0 §2.1-2.2 / ADR-0002  
**日期**：2026-10-03

---

## 1. Token 三层级联

### 1.1 层级关系

```text
Primitive Tokens   原始设计值，无语义意义
      ↓
Semantic Tokens    有语义的引用，指向 Primitive CSS 变量
      ↓
Component Tokens   组件级覆盖，Style 轴可替换整个此层
      ↓
--sn-* 别名层      品牌变量，组件实际消费（唯一消费入口）
```

**唯一消费规则**：组件 CSS 只能用 `var(--sn-*)` 变量。不允许直接引用 `--aui-*` 或字面量颜色值。

### 1.2 三轴独立原则

| 轴 | 覆盖范围 | 禁止覆盖 |
|---|---|---|
| Theme（Light/Dark） | Primitive 颜色 + Semantic 颜色 | 圆角、间距、尺寸 |
| Style（Modern/iOS/...） | Primitive 圆角/阴影 + Component Token | 颜色、间距、字号 |
| Density（Compact/Comfortable） | Primitive 间距/尺寸/字号 | 颜色、圆角 |

### 1.3 CSS 变量命名规范（已对齐实际输出）

> ⚠️ 下表是规范目标，部分变量需要通过 AUI-FOUND-001 地基任务补齐。

**Primitive 层**（`@snui/tokens` resolver 实际输出）

```css
--aui-color-{palette}-{ramp}        /* --aui-color-blue-500 */
--aui-spacing-{scale}               /* --aui-spacing-3 */
--aui-radius-{scale}                /* --aui-radius-md */
--aui-shadow-{scale}                /* --aui-shadow-md */
--aui-font-size-{scale}             /* --aui-font-size-md */
--aui-motion-duration-{scale}       /* --aui-motion-duration-base */
```

**Semantic 层**

```css
--aui-color-action-primary
--aui-color-action-primary-hover
--aui-color-text-primary
--aui-color-text-secondary
--aui-color-text-disabled
--aui-color-background-surface
--aui-color-background-subtle
--aui-color-border-default
--aui-color-border-subtle
--aui-color-feedback-{success|warning|danger|info}
```

**Component 层**（需要 AUI-FOUND-001 补全）

```css
/* 按钮 */
--aui-button-height-tiny            /* 24px */
--aui-button-height-small           /* 32px */
--aui-button-height-medium          /* 36px */
--aui-button-height-large           /* 44px */
--aui-button-radius                 /* 6px */
--aui-button-font-size              /* 14px */
--aui-button-focus-ring             /* rgba(22,119,255,0.25) */

/* 输入框 */
--aui-input-height-small
--aui-input-height-medium
--aui-input-height-large
--aui-input-radius

/* 卡片 */
--aui-card-padding
--aui-card-radius
--aui-card-shadow
```

**--sn-* 别名层**（组件实际消费，一对一映射 --aui-*）

```css
--sn-color-action-primary           → var(--aui-color-action-primary)
--sn-color-text-primary             → var(--aui-color-text-primary)
--sn-button-height-medium           → var(--aui-button-height-medium)
--sn-button-radius                  → var(--aui-button-radius)
--sn-button-focus-ring              → var(--aui-button-focus-ring)
/* 以此类推 */
```

### 1.4 地基任务：Token 命名对齐（AUI-FOUND-001）

当前问题：`SnButton` 消费的变量名（`--sn-radius-button`、`--sn-button-size-medium-height` 等）与 `@snui/tokens` 实际输出的变量名不匹配，导致组件依赖硬编码兜底值，风格切换无效。

修复清单（执行顺序）：

1. 在 `packages/tokens/src/component.ts` 中补全所有 Button / Input / Card 的 Component Token 字段
2. 在 `packages/tokens/src/resolver.ts` 的 `emitComponentBindings` 中输出这些字段
3. 在 `packages/tokens/styles/index.css` 中补充对应默认值
4. 修改 `SnButton.vue` 使用新的标准变量名（`--sn-button-radius`、`--sn-button-height-medium` 等）
5. 对齐 `sn-button.vue`（uni 端）
6. 补充测试：Token 变量名存在于 `snCssVars()` 输出中

**完成标准**：`snCssVars()` 输出中包含所有 Button 消费的 `--aui-button-*` 变量，组件 CSS 中无兜底字面量值（`var(--sn-x, LITERAL)` 中的 LITERAL 只允许 `transparent` / `inherit` / `currentColor`）。

---

## 2. Style Pack 系统

### 2.1 三层结构

风格包不是纯 Token 覆盖。对于需要视觉人格（涂鸦、便签、抖音等）的风格，只改 Token 无法达到效果。因此 Style Pack 由三层构成：

```text
Token 层          覆盖颜色 / 圆角 / 间距 / 字号（通过 snCssVars()）
    +
皮肤 CSS 层       .snui-skin-{name} 作用域下的 CSS，提供特效/字体/装饰
    +
资源层（可选）    字体文件 / SVG 纹理 / CSS 自定义属性
```

**边界约束（硬性）**：

- 皮肤 CSS **只能**操作视觉层（颜色、阴影、背景、字体、动画、伪元素）
- 皮肤 CSS **不能**修改组件 DOM 结构、Props、事件、行为
- 皮肤 CSS **只能**通过 `.snui-skin-{name}` 前缀 + 组件根元素的 `data-skin` 钩子选择，不能用深层 DOM 选择器

### 2.2 StylePackDefinition 接口

```ts
export interface StylePackDefinition {
  /** kebab-case 唯一标识 */
  name: string
  /** 用户可见的显示名 */
  label: string
  /** 描述（文档 / MCP 用） */
  description?: string

  // --- Token 层 ---
  /** Theme 覆盖（只能覆盖颜色） */
  theme?: ThemeDefinition
  /** Style 覆盖（圆角/阴影/Component token） */
  style: StyleDefinition
  /** Density 覆盖（间距/尺寸，可选） */
  density?: DensityDefinition

  // --- 皮肤 CSS 层 ---
  /**
   * 皮肤 CSS 文件路径（相对于包根目录）。
   * 内容必须以 .snui-skin-{name} 开头，不允许全局选择器。
   */
  skinCss?: string

  // --- 资源层 ---
  /** 额外需要预加载的字体或资源（URL 数组） */
  resources?: string[]

  /** 文档站预览缩略图 */
  previewImage?: string
}
```

### 2.3 皮肤钩子（组件侧）

每个组件根元素需要添加皮肤钩子属性（AUI-FOUND-004 任务）：

```vue
<!-- SnButton.vue -->
<button
  :class="classList"
  data-snui-component="button"
>
```

皮肤 CSS 通过这个属性选择：

```css
/* doodle.skin.css */
.snui-skin-doodle [data-snui-component="button"] {
  font-family: 'Comic Sans MS', 'Segoe UI', cursive;
  border: 2px solid currentColor;
  box-shadow: 3px 3px 0 currentColor;
  border-radius: 2px;
}

.snui-skin-doodle [data-snui-component="button"]:hover {
  transform: translate(-1px, -1px);
  box-shadow: 4px 4px 0 currentColor;
}
```

### 2.4 风格包激活方式

**Web 端**（文档站 StyleSwitcher）：

```ts
function applyPack(pack: StylePackDefinition) {
  // 1. 注入 Token 层
  let styleEl = document.getElementById('snui-pack') as HTMLStyleElement | null
  if (!styleEl) {
    styleEl = document.createElement('style')
    styleEl.id = 'snui-pack'
    document.head.appendChild(styleEl)
  }
  styleEl.textContent = snCssVars({
    theme: pack.theme,
    style: pack.style,
    density: pack.density,
  })

  // 2. 激活皮肤 CSS class
  document.body.className = document.body.className
    .replace(/\bsnui-skin-\S+/g, '')
    .trim()
  if (pack.name !== 'default') {
    document.body.classList.add(`snui-skin-${pack.name}`)
  }

  // 3. 加载皮肤 CSS（如果有）
  if (pack.skinCss) {
    let skinEl = document.getElementById('snui-skin') as HTMLLinkElement | null
    if (!skinEl) {
      skinEl = document.createElement('link')
      skinEl.id = 'snui-skin'
      skinEl.rel = 'stylesheet'
      document.head.appendChild(skinEl)
    }
    skinEl.href = pack.skinCss
  } else {
    document.getElementById('snui-skin')?.remove()
  }
}
```

**uni 端**（小程序 / App / H5）：

小程序不支持 `:root`、`[data-theme]` 选择器。通过 ConfigProvider 组件传递 `skin` prop：

```vue
<!-- ConfigProvider.vue（uni 端） -->
<view :class="['sn-config-provider', skin ? `snui-skin-${skin}` : '']">
  <slot />
</view>

<!-- 使用 -->
<sn-config-provider skin="doodle">
  <sn-button type="primary">按钮</sn-button>
</sn-config-provider>
```

uni 端皮肤 CSS 只声明组件 class 级别的覆盖，不依赖 `:root` 或属性选择器：

```css
/* doodle.uni.css — 在 ConfigProvider 的 scoped 外层 */
.snui-skin-doodle .sn-button {
  font-family: cursive;
  border: 4rpx solid currentColor;
  box-shadow: 6rpx 6rpx 0 currentColor;
}
```

**项目集成（复制配置片段）**：

```ts
// main.ts（Web 端）
import { snCssVars } from '@snui/tokens'
import { iosPack } from '@snui/style-packs/ios'

// Token 层
const el = document.createElement('style')
el.id = 'snui-pack'
el.textContent = snCssVars({ theme: iosPack.theme, style: iosPack.style })
document.head.appendChild(el)

// 皮肤 CSS 层（如果该 Pack 有皮肤 CSS）
// iOS 只有 Token 层，无需此步
```

### 2.5 官方 Pack 设计规格

| Pack | Token 层 | 皮肤 CSS 层 | 交付阶段 |
|---|---|---|---|
| default | 现有 Modern 封装 | 无 | M2 |
| dark | 现有 dark theme 封装 | 无 | M2 |
| ios | 苹果蓝、大圆角、无阴影 | 无 | M2 |
| doodle | 黑白主色、微小圆角 | 手写字体、2px 偏移阴影、hover 轻移 | M3 |
| sticky-note | 暖黄背景色 | 偏转卡片阴影、无边框 | M3 |
| taobao | 橙红主色、圆润圆角 | 价格数字字重、橙色高亮 | M4 |
| douyin | 深色底、红青主色 | 霓虹 glow（text-shadow / box-shadow）| M4 |

**ios Pack 示例**：

```ts
import type { StylePackDefinition } from '@snui/style-packs'

export const iosPack: StylePackDefinition = {
  name: 'ios',
  label: 'iOS 风格',
  description: '参考 Apple Human Interface Guidelines，大圆角，无阴影，细线边框，苹果蓝',
  theme: {
    name: 'ios-light',
    semantic: {
      action: {
        primary: '#007AFF',
        primaryHover: '#3395FF',
      },
    },
  },
  style: {
    name: 'ios',
    primitive: {
      radius: { sm: '8px', md: '12px', lg: '16px', xl: '20px' },
      shadow: { sm: 'none', md: 'none', lg: 'none', xl: 'none' },
    },
    component: {
      button: { radius: 'var(--aui-radius-lg)' },
      card:   { radius: 'var(--aui-radius-xl)', shadow: 'none' },
      input:  { radius: 'var(--aui-radius-md)' },
    },
  },
  // 无皮肤 CSS，iOS 风格仅 Token 层即可
}
```

**doodle Pack 示例**：

```ts
export const doodlePack: StylePackDefinition = {
  name: 'doodle',
  label: '涂鸦风格',
  description: '手绘感边框，手写字体，黑白主色配色，偏移阴影',
  theme: {
    name: 'doodle',
    semantic: {
      action: {
        primary: '#1a1a1a',
        primaryHover: '#333',
      },
      text: { primary: '#1a1a1a' },
      background: { surface: '#fafaf8' },
    },
  },
  style: {
    name: 'doodle',
    primitive: {
      radius: { sm: '2px', md: '3px', lg: '4px', xl: '6px' },
      shadow: {
        sm: '2px 2px 0 #1a1a1a',
        md: '3px 3px 0 #1a1a1a',
        lg: '4px 4px 0 #1a1a1a',
      },
    },
    component: {
      button: { radius: 'var(--aui-radius-sm)', shadow: 'var(--aui-shadow-md)' },
      card:   { radius: 'var(--aui-radius-md)', shadow: 'var(--aui-shadow-lg)' },
    },
  },
  skinCss: '/packs/doodle.skin.css',   // 皮肤 CSS 路径
}
```

### 2.6 Pack 开发约束（CI 可验证）

1. `style.component` 只能覆盖 `ComponentTokens` 已声明的字段（`pack validate` 检查）
2. `theme` 不包含非颜色字段（`pack validate` 检查）
3. 皮肤 CSS 所有选择器必须以 `.snui-skin-{name}` 开头（lint 检查）
4. 皮肤 CSS 不允许 `!important`（lint 检查）
5. 每个 Pack 必须有 `description` 字段

### 2.7 Pack 文件结构

```text
packages/style-packs/
├── src/
│   ├── index.ts              # 聚合导出
│   ├── default.ts
│   ├── ios.ts
│   ├── dark.ts
│   ├── doodle.ts             # Phase M3
│   ├── sticky-note.ts        # Phase M3
│   ├── taobao.ts             # Phase M4
│   └── douyin.ts             # Phase M4
├── skins/
│   ├── doodle.skin.css       # 皮肤 CSS（按需，M3）
│   ├── sticky-note.skin.css  # 皮肤 CSS（按需，M3）
│   ├── taobao.skin.css
│   └── douyin.skin.css
├── resources/                # 字体等资源（M4）
├── package.json
└── tsconfig.json
```

---

## 3. Token 使用示例

### 3.1 组件内正确用法

```css
/* ✅ 通过 --sn-* 别名，兜底值只允许关键字 */
.sn-button {
  background-color: var(--sn-color-action-primary);
  border-radius: var(--sn-button-radius);
  height: var(--sn-button-height-medium);
}

/* ❌ 禁止：硬编码颜色 */
.sn-button { background-color: #1677ff; }

/* ❌ 禁止：兜底字面量颜色 */
.sn-button { background-color: var(--sn-color-action-primary, #1677ff); }

/* ❌ 禁止：直接引用 --aui-* */
.sn-button { background-color: var(--aui-color-action-primary); }
```

**兜底值允许的关键字**：`transparent`、`inherit`、`currentColor`。

### 3.2 验证方法

```bash
# Token 对齐检查（AUI-FOUND-001 完成后）
pnpm snui token check   # 检查所有组件 CSS 中无字面量颜色兜底

# Pack 合法性检查
pnpm snui pack validate
```

---

## 4. 修订记录

| 版本 | 日期 | 变更 |
|---|---|---|
| v1.0 | 2026-10-03 | 初始版本（Style Pack = 纯 Token，有误） |
| v1.1 | 2026-10-03 | 修正：Style Pack = Token + 皮肤 CSS + 资源三层；补充 Token 命名对齐问题和地基任务；补充 uni 端主题注入策略 |
