# Spec-02：组件开发规范

**版本**：v1.1  
**状态**：Active（supersedes v1.0）  
**对应**：PRD v3.1 §3 / Architecture v3.1 §3.3  
**日期**：2026-10-03

---

## 1. 端独立性原则（v3.1 强化）

**每个端从开发到打包发布完全独立**：

- 独立包目录
- 独立构建产物
- 独立 npm 发布
- 独立 TypeScript 类型
- 0 行源代码跨端复用

**未来扩展新端（如 React）按相同模式**：`@snui/{end}` 独立包 + `@snui/tokens-{end}` 独立别名层 + 独立组件代码。

---

## 2. Web 端组件（@snui/vue-web）

### 2.1 文件结构

```text
packages/vue-web/src/{name}/
├── Sn{Name}.vue        # 主组件
├── Sn{Name}.test.ts    # 单元测试
└── ai-description.md   # AI 元数据（含 end: web 标记）
```

### 2.2 命名

| 对象 | 命名 | 示例 |
|---|---|---|
| 目录 | camelCase | `button/` |
| 组件文件 | PascalCase + `Sn` 前缀 | `SnButton.vue` |
| 测试文件 | 与组件同名 | `SnButton.test.ts` |
| AI 描述 | 固定名 | `ai-description.md` |

### 2.3 Token 消费

**Web 端组件 CSS 只能用 `var(--sn-web-*)` 变量**。不允许 `--sn-mp-*`、`--aui-*` 或字面量颜色（兜底只允许 `transparent` / `inherit` / `currentColor`）。

```css
/* Web 端 SnButton.vue */
.sn-button {
  background-color: var(--sn-web-color-action-primary);
  border-radius: var(--sn-web-button-radius);
  height: var(--sn-web-button-height-medium);
}
```

### 2.4 ai-description.md 中标注 end

```md
<!-- ai-description.md SnButton -->
end: web
name: SnButton
...
```

---

## 3. uni 端组件（@snui/uni）

### 3.1 文件结构

```text
packages/uni/src/components/sn-{name}/
├── sn-{name}.vue       # 主组件
├── sn-{name}.test.ts   # 单元测试
└── ai-description.md   # AI 元数据（含 end: mp 标记）
```

### 3.2 命名

| 对象 | 命名 | 示例 |
|---|---|---|
| 目录 | kebab-case + `sn-` 前缀 | `sn-button/` |
| 组件文件 | kebab-case + `sn-` 前缀 | `sn-button.vue` |
| 测试文件 | 与组件同名 | `sn-button.test.ts` |

### 3.3 Token 消费

**uni 端组件 CSS 只能用 `var(--sn-mp-*)` 变量**。尺寸优先 `rpx`，但颜色 / 圆角 / 阴影走 token。

```css
/* uni 端 sn-button.vue */
.sn-button {
  background-color: var(--sn-mp-color-action-primary);
  border-radius: var(--sn-mp-button-radius);  /* 转换后 24rpx */
  height: var(--sn-mp-button-height-medium);    /* 72rpx */
}
```

`tokens-mp` 别名层会自动把 px 转换为 rpx（按 375 设计稿）。

### 3.4 ai-description.md 中标注 end

```md
<!-- ai-description.md sn-button -->
end: mp
name: sn-button
...
```

---

## 4. 跨端禁止

```text
❌ @snui/vue-web 引入 @snui/uni 的组件
❌ @snui/uni 引入 @snui/vue-web 的组件
❌ 任何端包 import 其他端包的源代码
❌ 跨端"共享"组件 .vue 文件
❌ 跨端"共享"组件测试代码
```

端与端之间**只通过 `@snui/tokens` / `@snui/style-packs` / `@snui/ai` / `@snui/cli` / `@snui/docs` 跨端共用层交互**，不通过源代码。

---

## 5. 组件 SFC 规范（两端通用）

### 5.1 基本结构

```vue
<script setup lang="ts">
/**
 * Sn{Component} / sn-{component} — {一句话说明}
 *
 * end: web | mp
 */

defineOptions({ name: 'Sn{Component}' | 'SnComponent' */ })

const props = withDefaults(
  defineProps<{
    /** Props 注释 */
    type?: 'primary' | 'default'
  }>(),
  { type: 'default' },
)

const emit = defineEmits<{
  (e: 'click', event: MouseEvent): void
}>()

defineSlots<{
  default(): unknown
}>()
</script>

<template>
  <!-- 语义化 HTML，A11y 属性 -->
</template>

<style scoped>
/* 只用 var(--sn-{end}-*) 变量 */
</style>
```

### 5.2 Props / Events / Slots 规范（两端通用）

- Props 类型用联合字面量，不允许 `any`
- 布尔 prop 显式默认值：`isLoading` / `disabled` / `loading`
- 受控组件使用 `v-model`（`update:modelValue`）
- Events payload 用精确类型
- 所有 Props / Events / Slots 必须有 JSDoc 注释

### 5.3 A11y 规范（两端通用）

- 交互组件 `role` / `aria-disabled` / `aria-busy` 完整
- 键盘支持：Enter / Space 触发主操作
- focus-visible 必须有聚焦环（`focus-ring` token）

---

## 6. 未来端扩展（如 React）

按 v3.1 端独立模式：

```text
packages/react-web/
├── src/{name}/Sn{Name}.tsx    # 独立 React 实现
├── src/{name}/Sn{Name}.test.tsx
└── src/{name}/ai-description.md  # end: 'react'

packages/tokens-react/
├── src/
│   ├── index.ts              # --sn-react-* 别名层
│   └── variables.ts
└── styles/index.css          # 入口 @snui/tokens-react/styles
```

React 组件 CSS 只能用 `var(--sn-react-*)`。

---

## 7. CI / 包验证

```text
- pnpm --filter @snui/vue-web typecheck       # Web 端独立
- pnpm --filter @snui/uni typecheck           # uni 端独立
- pnpm --filter @snui/react-web typecheck     # React 端独立 (未来)
- pnpm snui token check --dir packages/vue-web    # Web 端扫描 → 禁止 --sn-mp-*
- pnpm snui token check --dir packages/uni        # uni 端扫描 → 禁止 --sn-web-*
- pnpm snui pack validate                       # 跨端共用 Style Pack 校验
```

`token-check` 会按端验证别名前缀正确性，禁止跨端 token 串用。

---

## 8. 修订记录

| 版本 | 日期 | 变更 |
|---|---|---|
| v1.0 | 2026-10-03 | 初始版本 |
| **v1.1** | 2026-10-03 | **强化端独立性：0 行源代码跨端复用，每端独立包目录、构建、Token 别名（Active）** |