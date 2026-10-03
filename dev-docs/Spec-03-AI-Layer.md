# Spec-03：AI Layer 规范（@snui/ai）

**版本**：v1.1  
**状态**：Active  
**对应**：PRD v3.0 §4 / Architecture v3.0 §2.5 / ADR-0002  
**日期**：2026-10-03

---

## 1. 包结构

```text
packages/ai/
├── src/
│   ├── index.ts
│   ├── skill/
│   │   └── snail-ui.skill.md       # Skill 文件（AI 行为契约）
│   ├── mcp/
│   │   ├── server.ts               # MCP Server 主程序
│   │   ├── tools/
│   │   │   ├── list-components.ts
│   │   │   ├── get-component-meta.ts
│   │   │   ├── get-style-pack.ts
│   │   │   └── render-preview.ts
│   │   └── types.ts
│   └── meta/
│       └── aggregator.ts           # ai-meta.json 生成器（供 @snui/cli 调用）
├── bin/
│   └── mcp-server.ts               # npx @snui/ai 入口
├── package.json
└── tsconfig.json
```

---

## 2. Skill 文件（snail-ui.skill.md）

### 2.1 用途

Skill 文件是一份结构化文档，告诉 AI（Cursor / Claude Code / Mavis 等）使用 snail-aui 的完整行为规范。不是 API 文档，而是**行为契约**：做什么、怎么做、禁止什么。

### 2.2 文件结构

```md
# snail-aui Skill — AI 界面创作行为契约

## 1. 组件引用规范
## 2. Props 命名约定
## 3. Token 引用规则
## 4. Style Pack 接入方式
## 5. 高保真原型输出格式
## 6. 应用级代码生成规范
## 7. 禁止事项（AI 不能做的）
## 8. 示例：表单页原型
## 9. 示例：列表页原型
## 10. MCP 工具使用说明
```

### 2.3 关键内容

**组件引用规范**：
- Web 端：`import { SnButton } from '@snui/vue-web'`
- Uni 端：easycom 自动注册，直接 `<sn-button>`
- 禁止引入 snail-aui 外的 UI 组件库（不混用）

**Token 引用规则**：
- 只能用 `var(--sn-*)` 变量，禁止字面量颜色
- 禁止在 inline style 中写颜色值
- 禁止直接引用 `--aui-*` 变量

**高保真原型输出格式**（标准三段式 SFC）：

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
    <SnButton type="primary" :loading="loading" @click="submit">
      提交
    </SnButton>
  </SnForm>
</template>

<style scoped>
/* 只用 var(--sn-*) 变量，不写字面量颜色 */
.page {
  padding: var(--sn-spacing-inset-lg);
}
</style>
```

**禁止事项（AI 不能做的）**：
- 不产出 `eval()` / `new Function()` / `document.write()`
- 不硬编码颜色值（一律 `var(--sn-*)`）
- 不直接操作 DOM（用 Vue 响应式）
- 不引入未经 `list_components` 确认的组件
- 不写 `!important`

---

## 3. MCP Server 规范

### 3.1 工具定义

**list_components**

```ts
interface Input { end: 'web' | 'uni' }
interface ComponentSummary {
  name: string          // SnButton / sn-button
  description: string   // 一句话用途
  import: string        // import 路径
}
interface Output { components: ComponentSummary[] }
```

**get_component_meta**

```ts
interface Input { name: string; end: 'web' | 'uni' }
interface Output {
  name: string
  description: string
  import: string
  props: Array<{ name: string; type: string; default: string; required: boolean; description: string }>
  events: Array<{ name: string; payload: string; description: string }>
  slots: Array<{ name: string; description: string }>
  tokens: Array<{ cssVar: string; purpose: string }>
  accessibility: string
}
```

**get_style_pack**

```ts
interface Input { name: string }   // 'ios' | 'doodle' | 'dark' | ...
interface Output {
  name: string
  label: string
  description: string
  snippet: string       // 可直接粘贴到 main.ts 的代码片段
  hasSkinCss: boolean   // 是否有皮肤 CSS 层
}
```

**render_preview**

```ts
interface Input {
  vueCode: string       // 完整的 Vue SFC 字符串
  packName?: string     // 可选，使用指定 Style Pack 渲染
}
interface Output {
  url: string           // 沙箱预览 iframe URL
  success: boolean
  error?: string        // 编译或运行时错误
}
```

### 3.2 安全约束

- Server 只读，不修改任何项目文件
- `render_preview` 在独立 iframe 沙箱中运行，`sandbox="allow-scripts allow-same-origin"`，无网络权限
- SFC 编译由 `@vue/compiler-sfc` 在服务端完成，不执行 `eval`
- 超时 15 秒，内存 64 MB 上限
- 沙箱不允许 `fetch` / `XMLHttpRequest` / `fs` 等副作用 API

> **注意**：`render_preview` 沙箱实现有一定工程复杂度，M2 阶段先实现基础版（`@vue/compiler-sfc` 编译 + 静态 iframe），M3 阶段再完善错误处理和超时机制。

### 3.3 MCP Server 启动

```bash
npx @snui/ai           # 直接运行

# MCP 配置（Cursor / Claude Desktop / Mavis 等）
{
  "mcpServers": {
    "snail-aui": {
      "command": "npx",
      "args": ["@snui/ai"]
    }
  }
}
```

**注意**：`@snui/cli` 和 `@snui/ai` 的 `package.json` 需要补充 `bin` 入口（AUI-TOOL-002 任务）。当前 cli 包没有 `bin` 字段，`pnpm snui *` 命令尚未可用。

---

## 4. ai-description.md 规范

### 4.1 维护策略（避免漂移）

手工维护 Props / Events / Slots 表格会与 `.vue` 源文件漂移。规范：

| 内容 | 维护方式 |
|---|---|
| Props / Events / Slots 表格 | `pnpm snui docs` 从 SFC 自动抽取，覆盖写入 |
| 组件用途描述（Purpose） | 手工维护，不被自动覆盖 |
| 使用场景 / 不适用场景 | 手工维护 |
| 代码示例 | 手工维护 |
| Tokens Consumed 表格 | `pnpm snui docs` 从组件 CSS 自动抽取 `var(--sn-*)` 引用 |
| Accessibility | 手工维护 |

**实现方式**：`ai-description.md` 使用注释边界标记：

```md
<!-- auto:props-start -->
| Name | Type | Default | ... |
| ... |
<!-- auto:props-end -->
```

`pnpm snui docs` 只替换 `auto:*` 边界内的内容，手工内容不受影响。

### 4.2 文件模板

```md
# Sn{Component} — AI-Friendly Component Description

> {一句话用途描述}

## Purpose

{详细用途，2-3 句}

## When to use

- {适用场景 1}
- {适用场景 2}

## When NOT to use

- {不适用场景}

## Import

​```ts
import { Sn{Component} } from '@snui/vue-web'
​```

<!-- auto:props-start -->
## Props
（由 pnpm snui docs 自动生成，勿手动编辑此区域）
<!-- auto:props-end -->

<!-- auto:events-start -->
## Events
<!-- auto:events-end -->

<!-- auto:slots-start -->
## Slots
<!-- auto:slots-end -->

<!-- auto:tokens-start -->
## Tokens Consumed
<!-- auto:tokens-end -->

## Accessibility

- {A11y 说明}

## Example

​```vue
{代码示例}
​```

## Versioning

`@snui/vue-web@{version}` — {描述}
```

---

## 5. ai-meta.json 规范

### 5.1 生成命令

```bash
pnpm snui ai-meta
# 输出到 apps/docs/public/ai-meta.json
```

### 5.2 文件结构

```json
{
  "version": "1.0",
  "generated": "2026-10-03T00:00:00Z",
  "web": {
    "library": "@snui/vue-web",
    "components": [
      {
        "name": "SnButton",
        "description": "主要交互按钮",
        "import": "import { SnButton } from '@snui/vue-web'",
        "props": [...],
        "events": [...],
        "slots": [...],
        "tokens": [...]
      }
    ]
  },
  "uni": {
    "library": "@snui/uni",
    "components": [...]
  },
  "stylePacks": [
    {
      "name": "ios",
      "label": "iOS 风格",
      "description": "...",
      "snippet": "...",
      "hasSkinCss": false
    }
  ],
  "tokens": {
    "semantic": ["--sn-color-action-primary", ...],
    "component": ["--sn-button-radius", ...]
  }
}
```

### 5.3 生成规则

- 从 `packages/vue-web/src/*/ai-description.md` 提取组件信息（auto 区域优先）
- 从 `packages/uni/src/components/*/ai-description.md` 提取 Uni 端信息
- 从 `@snui/style-packs` 所有 Pack 提取 Pack 信息
- 从 `@snui/tokens` 提取已声明的 CSS 变量名
- 每次 `pnpm build` 后自动重新生成（turbo 任务依赖链）

---

## 6. 修订记录

| 版本 | 日期 | 变更 |
|---|---|---|
| v1.0 | 2026-10-03 | 初始版本 |
| v1.1 | 2026-10-03 | 修正 ai-description 维护策略（自动抽取 + 手工描述分离）；补充 render_preview 安全边界；补充 bin 缺失问题说明 |
