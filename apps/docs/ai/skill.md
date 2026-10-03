# Skill 文件

AI Skill（`snail-ui.skill.md`）是一份结构化的行为契约，**不是** API 文档。它放在 `packages/ai/src/skill/skill.md`。

## 关键内容

### 组件引用规范

- Web 端：`import { SnButton } from '@snui/vue-web'`
- Uni 端：easycom 自动注册，直接 `<sn-button>`
- 禁止引入 snail-aui 外的 UI 组件库（Ant Design / Element Plus / Naive UI 等）
- 禁止混用其他前缀（`A-` / `El-` / `N-` / `Van-`）

### Props 命名约定

- 全部 camelCase
- 布尔 prop 优先 `disabled` / `loading` / `block`，不写 `isDisabled`
- 受控组件用 `modelValue` + `update:modelValue`（v-model）

### Token 引用规则（最强约束）

- 在 `<style>` 中只能用 `var(--sn-*)` 变量
- 禁止写 hex 字面量（`#1677ff` / `#fff` 等）
- 禁止写 `rgb()` / `rgba()` / `hsl()` 字面量
- 禁止在 inline style 中写颜色值
- 禁止直接引用 `--aui-*` 变量
- 唯一允许的兜底值：`transparent` / `inherit` / `currentColor`

### 高保真原型输出格式

```vue
<script setup lang="ts">
import { SnButton, SnInput, SnForm } from '@snui/vue-web'
import { ref } from 'vue'
// 只 import snail-aui 组件和 Vue 核心
// 不引入 axios / pinia / router（原型阶段用 setTimeout 模拟异步）
</script>

<template>
  <!-- 使用 Sn 前缀组件，camelCase props -->
  <SnForm :model="form">
    <SnInput v-model="form.name" placeholder="请输入姓名" />
    <SnButton type="primary" :loading="loading" @click="submit">提交</SnButton>
  </SnForm>
</template>

<style scoped>
/* 只用 var(--sn-*) 变量，不写字面量颜色 */
.page { padding: var(--sn-spacing-inset-lg); }
</style>
```

### 禁止事项

- ❌ `eval()` / `new Function()` / `document.write()`
- ❌ 硬编码颜色值（违反 Token 规则）
- ❌ 直接操作 DOM（用 Vue 响应式）
- ❌ 引入 snail-aui 未提供的组件（先用 `list_components` 确认）
- ❌ 写 `!important`
- ❌ 修改组件 .vue 内部实现

## 在代码中使用 Skill

Skill 文件被 `@snui/ai/skill` 模块导出：

```ts
import { SKILL_VERSION, SKILL_CONTENT, loadSkill } from '@snui/ai/skill'

const text = loadSkill()
// 拼到 AI prompt 头部
const prompt = `${SKILL_CONTENT}\n\n## User request\n${userInput}`
```

## 版本

- `@snui/ai@0.1.0` — 初始版本

Skill 文件由人类维护。AI 不得自动覆盖；如需修改，必须由人类提交 PR。

## 下一步

- [MCP Server](/ai/mcp)
- [高保真原型](/ai/prototype)