# Skill 文件

AI Skill（`snail-ui.skill.md`）是一份结构化的行为契约，**不是** API 文档。它放在 `packages/ai/src/skill/skill.md`。

> **v3.1 端独立**：Skill 内所有规则按端区分。AI 接收任务时必须**先识别目标端**（Web 还是 uni），然后按对应端的规则写代码。两端**0 行源代码复用**。

---

## 关键内容

### 1. 端识别（最先做）

AI 接到任务后，必须先判断目标端：

| 关键词 | 目标端 |
|---|---|
| PC / 桌面 / 网页 / Web / Vue 3 / 浏览器 | `web` |
| 移动 / 小程序 / 微信 / 支付宝 / H5 / uni-app / uniapp | `mp` |

若无法判断，先问"这个需求是 Web（PC）端还是 uni（移动）端？"，**禁止**默认选 Web。

### 3. 组件引用规范

**Web 端（`@snui/vue-web`）**：

```ts
import { SnButton, SnInput, SnForm, SnCard } from '@snui/vue-web'
import '@snui/tokens-web/styles'
```

- 全部 `Sn-` 前缀，PascalCase 导入
- 单文件组件（无 easycom），靠构建工具 tree-shaking

**Uni 端（`@snui/uni`）**：

```vue
<template>
  <!-- easycom 自动注册，无需 import -->
  <sn-button type="primary">按钮</sn-button>
  <sn-form :model="form">
    <sn-input v-model="form.name" />
  </sn-form>
</template>
```

- 全部 `sn-` 前缀，kebab-case 标签
- easycom 自动注册（约定 `components/{name}/{name}.vue` 或 `sn-{name}` 单文件组件）
- 必须显式 `import '@snui/tokens-mp/styles'` 引入 rpx 别名层

**禁止**：

- 禁止引入 snail-aui 外的 UI 组件库（Ant Design / Element Plus / Naive UI / Vant 等）
- 禁止混用其他前缀（`A-` / `El-` / `N-` / `Van-`）
- **禁止 Web 和 uni 互相 import**（`@snui/vue-web` 不允许出现在 `@snui/uni` 项目，反之亦然）

### 3. Props 命名约定

- 全部 camelCase
- 布尔 prop 优先 `disabled` / `loading` / `block`，不写 `isDisabled`
- 受控组件用 `modelValue` + `update:modelValue`（v-model）

### 4. Token 引用规则（最强约束）

按端区分：

| 端 | 唯一允许的 Token |
|---|---|
| **Web**（`@snui/vue-web`） | `var(--sn-web-*)` 别名层（px） |
| **uni**（`@snui/uni`） | `var(--sn-mp-*)` 别名层（rpx） |

禁止：

- ❌ 写 hex 字面量（`#1677ff` / `#fff` 等）
- ❌ 写 `rgb()` / `rgba()` / `hsl()` 字面量
- ❌ 在 inline style 中写颜色值
- ❌ 直接引用 `--aui-*` 原始层（这是 tokens 内部层，对组件不可见）
- ❌ Web 代码中用 `--sn-mp-*` / uni 代码中用 `--sn-web-*`
- ❌ Style Pack 皮肤 CSS 中用 `--sn-web-*` 或 `--sn-mp-*`（皮肤 CSS 是跨端共用层）

唯一允许的兜底值：`transparent` / `inherit` / `currentColor`。

### 6. 高保真原型输出格式（按端）

**Web 端**：

```vue
<script setup lang="ts">
import { SnButton, SnInput, SnForm, SnCard } from '@snui/vue-web'
import '@snui/tokens-web/styles'
import { ref } from 'vue'
// 只 import snail-aui 组件和 Vue 核心
// 不引入 axios / pinia / router（原型阶段用 setTimeout 模拟异步）
</script>

<template>
  <!-- 使用 Sn 前缀组件，camelCase props -->
  <SnCard>
    <SnForm :model="form">
      <SnInput v-model="form.name" placeholder="请输入姓名" />
      <SnButton type="primary" :loading="loading" @click="submit">提交</SnButton>
    </SnForm>
  </SnCard>
</template>

<style scoped>
/* 只用 var(--sn-web-*) 变量，不写字面量颜色 */
.page { padding: var(--sn-web-spacing-inset-lg); }
</style>
```

**uni 端**：

```vue
<!-- easycom 自动注册 sn-button / sn-input / sn-form / sn-card -->
<script setup lang="ts">
import '@snui/tokens-mp/styles'
import { ref } from 'vue'
</script>

<template>
  <sn-card>
    <sn-form :model="form">
      <sn-input v-model="form.name" placeholder="请输入姓名" />
      <sn-button type="primary" :loading="loading" @click="submit">提交</sn-button>
    </sn-form>
  </sn-card>
</template>

<style scoped>
/* 只用 var(--sn-mp-*) 变量，自动 rpx */
.page { padding: var(--sn-mp-spacing-inset-lg); }
</style>
```

### 7. 禁止事项

- ❌ `eval()` / `new Function()` / `document.write()`
- ❌ 硬编码颜色值（违反 Token 规则）
- ❌ 直接操作 DOM（用 Vue 响应式）
- ❌ 引入 snail-aui 未提供的组件（先用 `list_components` 确认）
- ❌ 写 `!important`
- ❌ 修改组件 .vue 内部实现
- ❌ 跨端 import（vue-web 包到 uni 项目 / uni 包到 vue-web 项目）
- ❌ 跨端 Token 引用（vue-web 代码里用 `--sn-mp-*`）

---

## 在代码中使用 Skill

Skill 文件被 `@snui/ai/skill` 模块导出：

```ts
import { SKILL_VERSION, SKILL_CONTENT, loadSkill } from '@snui/ai/skill'

const text = loadSkill()
// 拼到 AI prompt 头部
const prompt = `${SKILL_CONTENT}\n\n## User request\n${userInput}`
```

---

## 版本

- `@snui/ai@0.1.0` — 初始版本
- `@snui/ai@0.3.0` — v3.1 端独立版（Active）

Skill 文件由人类维护。AI 不得自动覆盖；如需修改，必须由人类提交 PR。

---

## 下一步

- [MCP Server](/ai/mcp)
- [高保真原型](/ai/prototype)