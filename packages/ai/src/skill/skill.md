# snail-aui Skill — AI 界面创作行为契约

> 这是 AI Agent（Cursor / Claude Code / Mavis 等）在使用 snail-aui 时必须遵守的行为规范。  
> 不是 API 文档（API 文档走 MCP `get_component_meta`），而是 **怎么用 + 不能做**。

---

## 1. 组件引用规范

- Web 端：`import { SnButton } from '@snui/vue-web'`
- Uni 端：easycom 自动注册，直接写 `<sn-button>`
- 禁止引入 snail-aui 外的 UI 组件库（Ant Design / Element Plus / Naive UI / Vant 等）
- 禁止混用其他前缀（`A-` / `El-` / `N-` / `Van-`）

## 2. Props 命名约定

- 全部 camelCase
- 布尔 prop 优先 `disabled` / `loading` / `block`，不写 `isDisabled`
- 受控组件用 `modelValue` + `update:modelValue`（v-model）
- slot 名 camelCase（`icon` / `loading` / `header` / `footer`）

## 3. Token 引用规则

**这是最强约束**：

- 在 `<style>` 中只能用 `var(--sn-*)` 变量
- 禁止写 hex 字面量（`#1677ff`、`#fff` 等）
- 禁止写 `rgb()` / `rgba()` / `hsl()` 字面量
- 禁止在 inline style 中写颜色值
- 禁止直接引用 `--aui-*` 变量（这是设计系统原始层，组件只能消费 `--sn-*` 别名）
- 唯一允许的兜底值：`transparent` / `inherit` / `currentColor`

## 4. Style Pack 接入方式

如需切换风格（iOS / 暗色 / 涂鸦等）：

```ts
import { snCssVars } from '@snui/tokens'
import { iosPack } from '@snui/style-packs/ios'

const el = document.createElement('style')
el.id = 'snui-pack'
el.textContent = snCssVars({
  theme: iosPack.theme,
  style: iosPack.style,
  density: iosPack.density,
})
document.head.appendChild(el)
```

不要手动覆盖 `--sn-*` CSS 变量值（应通过 Pack）。

## 5. 高保真原型输出格式

标准三段式 Vue SFC：

```vue
<script setup lang="ts">
import { SnButton, SnInput } from '@snui/vue-web'
import { ref } from 'vue'
// 只 import snail-aui 组件和 Vue 核心
// 不引入 axios / pinia / router（原型阶段用 setTimeout 模拟异步）
</script>

<template>
  <!-- 使用 Sn 前缀组件，camelCase props -->
  <SnInput v-model="value" placeholder="请输入" />
  <SnButton type="primary" :loading="loading" @click="submit">提交</SnButton>
</template>

<style scoped>
/* 只用 var(--sn-*) 变量，不写字面量颜色 */
.page { padding: var(--sn-spacing-inset-lg); }
</style>
```

## 6. 应用级代码生成规范

在原型基础上产出工程代码时，补充：

- Pinia Store（`defineStore` + state / getters / actions）
- API 调用层（`fetch` 封装，类型化返回）
- TypeScript 类型定义（`src/types/` 目录）
- 路由配置（按框架选择 vue-router 或 uni pages.json）

## 7. 禁止事项

- ❌ `eval()` / `new Function()` / `document.write()`
- ❌ 硬编码颜色值（违反 §3）
- ❌ 直接操作 DOM（用 Vue 响应式）
- ❌ 引入 snail-aui 未提供的组件（先用 `list_components` 确认）
- ❌ 写 `!important`
- ❌ 修改组件 .vue 内部实现
- ❌ 跳过 ai-description.md 直接创建组件

## 8. MCP 工具使用说明

AI Agent 应优先通过 MCP 工具获取最新元数据：

| 工具 | 用途 |
|---|---|
| `list_components` | 列出所有组件（先确认存在） |
| `get_component_meta` | 获取单个组件的完整 Props / Events / Slots / Tokens |
| `get_style_pack` | 获取 Style Pack 定义 + 完整 `snCssVars(...)` 代码片段 |
| `render_preview` | 在沙箱中预览 SFC 渲染结果（render_preview 在 M3 阶段实装） |

## 9. 验证流程

AI 产出原型后，应调用 `render_preview` 验证：

- TypeScript 编译 0 error
- 沙箱渲染无运行时报错
- 视觉效果符合预期

## 10. 版本

`@snui/ai@0.1.0` — initial Skill spec.

此文件由人类维护，AI 不得自动覆盖。如需修改，由人类提交 PR。