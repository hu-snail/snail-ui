# 高保真原型

AI 用 snail-aui 产出**高保真原型**——不是截图，不是 Figma，是真实可运行的 Vue SFC。

## 原型 vs 设计稿

| 维度 | 设计稿 | 高保真原型 |
|---|---|---|
| 形态 | PNG / Figma | 真实 Vue 组件 |
| 交互 | 无 | 可点击 / 填写 / 切换状态 |
| 样式 | 静态 | Token 驱动（`--sn-*`） |
| 修改 | 重画 | 改 SFC + 切 Style Pack |
| AI 产出 | 不可 | 是 |

## 产出流程

```text
需求描述（自然语言）
    ↓
AI 加载 snail-ui.skill.md（行为契约）
    ↓
MCP list_components → 确认组件存在
    ↓
MCP get_component_meta → 获取 Props / Events / Tokens
    ↓
AI 生成 Vue SFC（符合 Skill 规范）
    ↓
MCP render_preview（M3 实装） → 沙箱验证渲染
    ↓
输出可运行的 Vue SFC
```

## 原型质量清单

AI 产出后必须自检：

```text
[ ] 所有组件均来自 @snui/vue-web 或 @snui/uni
[ ] 无字面量颜色值（全部 var(--sn-*)）
[ ] 无内联 style 中写颜色值
[ ] Props 与 get_component_meta 返回完全一致
[ ] 代码通过 vue-tsc --noEmit
[ ] 交互状态完整（loading / disabled / error / empty）
[ ] 响应式布局（mobile-first 或明确仅桌面）
[ ] 无 eval() / new Function()
[ ] 无直接操作 DOM（只用 Vue 响应式）
```

## 输出格式标准

```vue
<script setup lang="ts">
import { SnButton, SnInput, SnForm } from '@snui/vue-web'
import { ref, reactive } from 'vue'

const form = reactive({ name: '', email: '' })
const loading = ref(false)

async function handleSubmit() {
  loading.value = true
  await new Promise(r => setTimeout(r, 1000))  // 原型阶段模拟
  loading.value = false
}
</script>

<template>
  <div class="page-layout">
    <SnCard>
      <SnForm :model="form">
        <SnFormItem label="姓名">
          <SnInput v-model="form.name" placeholder="请输入姓名" />
        </SnFormItem>
        <SnFormItem label="邮箱">
          <SnInput v-model="form.email" type="email" placeholder="请输入邮箱" />
        </SnFormItem>
        <SnButton type="primary" :loading="loading" @click="handleSubmit">
          提交
        </SnButton>
      </SnForm>
    </SnCard>
  </div>
</template>

<style scoped>
.page-layout {
  padding: var(--sn-spacing-inset-lg);
  max-width: 480px;
  margin: 0 auto;
}
</style>
```

## 应用级代码生成

在原型基础上继续产出工程代码：

| 原型部分 | 应用代码补充 |
|---|---|
| `<script setup>` 状态 | Pinia Store（`defineStore` + state / getters / actions） |
| `setTimeout` 模拟 | 真实 API 调用层（`fetch` + TypeScript 类型） |
| 单文件 | 多文件（router / views / components） |
| 无路由 | Vue Router / uni-app pages.json |
| 无错误处理 | 错误边界 + Toast 提示 |

## 平台中立

原型应能同时跑 Web 和 uni（H5）端：

- 布局用 Flex / Grid，不用 `<table>`
- 用 Sn 组件前缀（Web）和 uni（有/H5）；避免原生 HTML 标签
- 尺寸优先用 rpx（移动端）或 var(--sn-*) 变量（桌面端）

## 当前状态

- ✅ Skill 文件
- ✅ MCP Server stub
- 🔄 render_preview 沙箱 — M3（AUI-AI-004）

## 下一步

- [AI 生态总览](/ai/overview)
- [Skill 文件](/ai/skill)
- [MCP Server](/ai/mcp)