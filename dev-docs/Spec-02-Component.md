# Spec-02：组件开发规范

**版本**：v1.0  
**状态**：Active  
**对应**：PRD v3.0 §5 / Architecture v3.0 §2.3  
**日期**：2026-10-03

---

## 1. 组件文件结构

### 1.1 Web 端（@snui/vue-web）

```text
packages/vue-web/src/{component}/
├── Sn{Component}.vue        # 主组件（唯一实现文件）
├── Sn{Component}.test.ts    # 单元测试
└── ai-description.md        # AI 元数据（人类可读 + AI 可解析）
```

**命名规则**：

| 对象 | 命名 | 示例 |
|---|---|---|
| 目录 | camelCase（与组件名一致） | `button/` |
| 组件文件 | PascalCase + `Sn` 前缀 | `SnButton.vue` |
| 测试文件 | 与组件同名 | `SnButton.test.ts` |
| AI 描述 | 固定名 | `ai-description.md` |

### 1.2 Uni 端（@snui/uni）

```text
packages/uni/src/components/sn-{component}/
├── sn-{component}.vue       # 主组件（easycom 约定）
├── sn-{component}.test.ts   # 单元测试
└── ai-description.md        # AI 元数据
```

**命名规则**：

| 对象 | 命名 | 示例 |
|---|---|---|
| 目录 | kebab-case + `sn-` 前缀 | `sn-button/` |
| 组件文件 | kebab-case + `sn-` 前缀 | `sn-button.vue` |
| 测试文件 | 与组件同名 | `sn-button.test.ts` |

---

## 2. 组件 SFC 规范

### 2.1 基本结构

```vue
<script setup lang="ts">
/**
 * Sn{Component} — {组件一句话说明}
 *
 * API design reference: naive-ui / wot-ui
 * Token-driven styling: every visual property resolves via `var(--sn-*)`.
 */

defineOptions({ name: 'Sn{Component}' })

const props = withDefaults(
  defineProps<{
    /** Props 注释 */
    type?: 'primary' | 'default'
    // ... 所有 prop 必须有 JSDoc 注释
  }>(),
  {
    type: 'default',
  },
)

const emit = defineEmits<{
  (e: 'click', event: MouseEvent): void
  // ... 所有 event 必须有注释
}>()

defineSlots<{
  default(): unknown
  // ... 所有 slot 必须声明
}>()
</script>

<template>
  <!-- 语义化 HTML，A11y 属性 -->
</template>

<style scoped>
/* 只用 var(--sn-*) 变量，禁止硬编码颜色/间距 */
</style>
```

### 2.2 Props 规范

- 类型使用联合字面量（`'primary' | 'default'`），不用魔法字符串
- 所有 prop 必须有 JSDoc `/** */` 注释
- 必须为所有可选 prop 提供默认值（`withDefaults`）
- 布尔 prop 默认值显式写出（不依赖 Vue 的隐式 `false`）
- 禁止在 Props 中暴露内部实现细节

**Boolean 命名**：

```ts
isLoading    // ✅
loadingFlag  // ❌
isDisabled   // ✅（也可直接用 disabled）
disableFlag  // ❌
```

### 2.3 Events 规范

- 事件名 camelCase（Vue 模板里 `@update:modelValue`）
- 事件 payload 必须有精确类型（不用 `any`）
- 受控组件（v-model）使用 `update:modelValue` 约定
- 禁止在 disabled/loading 状态下触发用户交互事件

### 2.4 Slots 规范

- 所有 slot 用 `defineSlots<{}>()` 声明
- Slot 名 camelCase
- 复杂 slot 提供 slot props 类型

### 2.5 CSS 规范

```css
/* ✅ 所有视觉属性必须通过 --sn-* 变量 */
.sn-button {
  background-color: var(--sn-color-action-primary, #1677ff);
  border-radius: var(--sn-radius-button, 6px);
  height: var(--sn-button-size-medium-height, 36px);
  font-size: var(--sn-button-font-size, 14px);
}

/* ❌ 禁止硬编码 */
.sn-button {
  background-color: #1677ff;
  border-radius: 6px;
}

/* ❌ 禁止直接用 --aui-* */
.sn-button {
  background-color: var(--aui-color-blue-500);
}
```

- 使用 `scoped` CSS，避免全局污染
- 不使用 `!important`
- 不依赖深层 DOM 选择器（`>>>`、`/deep/`）
- 动画使用 `var(--sn-motion-duration-base)` 等 Token 变量

### 2.6 A11y 规范

每个交互组件必须包含：

| 要素 | 说明 |
|---|---|
| `role` | 语义化角色（button / checkbox / dialog 等） |
| `aria-disabled` | disabled 状态 |
| `aria-busy` | loading 状态 |
| `aria-label` / `aria-labelledby` | 无文字内容时必须提供 |
| 键盘支持 | Enter/Space 触发主操作 |
| focus-visible | 必须有可见的聚焦环（`var(--sn-color-focus-ring)`） |

### 2.7 uni 端特殊规范

- 使用 `<view>`、`<text>` 等 uni 基础组件替代 `<div>`、`<span>`
- 事件用 `@tap` 替代 `@click`（也支持 `@click` 兼容）
- 尺寸优先使用 `rpx`（响应式）
- 不使用 Web 专有 CSS 属性（`position: fixed`、`backdrop-filter` 等）时做 capability check
- 满足 easycom 路径约定：`components/sn-{name}/sn-{name}.vue`

---

## 3. ai-description.md 规范

每个组件必须包含 `ai-description.md`，格式如下：

```md
# Sn{Component} — AI-Friendly Component Description

> {组件用途一句话描述}

## Purpose

{详细用途说明}

## Import

​```ts
import { Sn{Component} } from '@snui/vue-web'
​```

## Props

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `type` | `'primary' \| 'default'` | `'default'` | no | 按钮类型 |

## Events

| Name | Payload | Description |
|---|---|---|
| `click` | `(event: MouseEvent) => void` | 点击时触发 |

## Slots

| Name | Description |
|---|---|
| `default` | 默认内容 |

## Tokens Consumed

| Token | CSS Variable | Purpose |
|---|---|---|
| 主色 | `--sn-color-action-primary` | primary 背景色 |

## Accessibility

- 使用原生 `<button>` 元素
- `aria-disabled` 在 disabled 时设置
- ...

## Versioning

`@snui/vue-web@{version}` — {描述}
```

**ai-description.md 要求**：

- 每个组件 Props / Events / Slots / Tokens 表格必须完整
- `>` 引用块（blockquote）写组件用途描述（`parseAiDescription` 从这里提取 description）
- Tokens Consumed 表格第一列是 Token 名，第二列是 CSS 变量名（`@snui/cli` 解析用）
- 内容必须与 `.vue` 文件同步（Public API 变更必须同步更新）

---

## 4. 单元测试规范

### 4.1 测试必须覆盖

- 默认渲染（Snapshot 可选，行为测试优先）
- 所有 Props 变体（type / size / disabled / loading 等）
- 所有 Events（click、input 等）
- Slot 渲染（default / icon / custom slots）
- A11y 属性（role / aria-disabled / aria-busy）
- 边界状态（disabled 不触发 click，loading 不触发 click）

### 4.2 测试命名规范

```ts
describe('SnButton', () => {
  describe('props', () => {
    it('should render primary variant', () => { ... })
    it('should apply disabled class when disabled', () => { ... })
  })

  describe('events', () => {
    it('should emit click event on click', async () => { ... })
    it('should not emit click when disabled', async () => { ... })
    it('should not emit click when loading', async () => { ... })
  })

  describe('slots', () => {
    it('should render default slot content', () => { ... })
    it('should render icon slot', () => { ... })
  })

  describe('accessibility', () => {
    it('should have role="button"', () => { ... })
    it('should set aria-disabled when disabled', () => { ... })
    it('should set aria-busy when loading', () => { ... })
  })
})
```

### 4.3 禁止

- 不允许 `skip` / `only` 遗留在 commit 中
- 不允许删除失败的测试（应修复代码）
- 不允许用 Snapshot 代替行为断言

---

## 5. 组件注册（Web 端）

```ts
// packages/vue-web/src/index.ts
export { default as SnButton } from './button/SnButton.vue'
export { default as SnInput } from './input/SnInput.vue'
// ...

export { SnUI, default } from './install.js'
export type { SnUIOptions } from './install.js'
```

```ts
// packages/vue-web/src/install.ts
import type { App } from 'vue'
import SnButton from './button/SnButton.vue'
// ...

const components = [SnButton, ...]

export const SnUI = {
  install(app: App) {
    components.forEach(c => app.component(c.name!, c))
  }
}
```

同时更新 `packages/cli/src/resolver.ts` 中的 `PUBLIC_COMPONENTS` 列表。

---

## 6. 修订记录

| 版本 | 日期 | 变更 |
|---|---|---|
| v1.0 | 2026-10-03 | 初始版本（Active） |
