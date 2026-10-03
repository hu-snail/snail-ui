# 高保真原型

AI 用 snail-aui 产出**高保真原型**——不是截图，不是 Figma，是真实可运行的 Vue SFC。

> **v3.1 端独立**：同一需求必须产出**两份原型**（Web 一份 + uni 一份），**0 行源代码复用**。AI 接收任务后第一步是**端识别**，明确告诉用户"目标端是 Web 还是 uni"，然后按对应端的组件包和 Token 别名写代码。

---

## 原型 vs 设计稿

| 维度 | 设计稿 | 高保真原型 |
|---|---|---|
| 形态 | PNG / Figma | 真实 Vue 组件 |
| 交互 | 无 | 可点击 / 填写 / 切换状态 |
| 样式 | 静态 | Token 驱动（`--sn-web-*` / `--sn-mp-*`） |
| 修改 | 重画 | 改 SFC + 切 Style Pack |
| AI 产出 | 不可 | 是 |

---

## 产出流程（端独立）

```text
需求描述（自然语言）
    ↓
AI 加载 snail-ui.skill.md（行为契约，含端识别规则）
    ↓
AI 识别目标端（Web / uni），问用户确认
    ↓
MCP list_components({ end: <目标端> }) → 确认组件存在
    ↓
MCP get_component_meta({ name, end }) → 获取 Props / Events / Tokens
    ↓
AI 生成 Vue SFC：
    - Web → import from '@snui/vue-web' + var(--sn-web-*)
    - uni → easycom 自动注册 + var(--sn-mp-*)
    ↓
MCP render_preview({ vueCode, end })（M3 实装） → 沙箱验证渲染
    ↓
输出端独立可运行的 Vue SFC
```

---

## 原型输出格式（按端）

### Web 端（`@snui/vue-web`）

```vue
<script setup lang="ts">
// ✅ 只 import snail-aui 组件和 Vue 核心
import { SnButton, SnInput, SnForm, SnFormItem, SnCard } from '@snui/vue-web'
import '@snui/tokens-web/styles'
import { ref, reactive } from 'vue'

// 状态定义
const form = reactive({ name: '', email: '' })
const loading = ref(false)

// 事件处理（无真实 API 调用，只展示交互流程）
async function handleSubmit() {
  loading.value = true
  await new Promise(r => setTimeout(r, 1000)) // 模拟 loading
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
/* 只用 var(--sn-web-*) 变量 */
.page-layout {
  padding: var(--sn-web-spacing-inset-lg);
  max-width: 480px;
  margin: 0 auto;
}
</style>
```

### uni 端（`@snui/uni`）

```vue
<!-- easycom 自动注册 sn-button / sn-input / sn-form / sn-form-item / sn-card -->
<script setup lang="ts">
import '@snui/tokens-mp/styles'
import { ref, reactive } from 'vue'

const form = reactive({ name: '', email: '' })
const loading = ref(false)

async function handleSubmit() {
  loading.value = true
  await new Promise(r => setTimeout(r, 1000))
  loading.value = false
}
</script>

<template>
  <view class="page-layout">
    <sn-card>
      <sn-form :model="form">
        <sn-form-item label="姓名">
          <sn-input v-model="form.name" placeholder="请输入姓名" />
        </sn-form-item>
        <sn-form-item label="邮箱">
          <sn-input v-model="form.email" type="email" placeholder="请输入邮箱" />
        </sn-form-item>
        <sn-button type="primary" :loading="loading" @click="handleSubmit">
          提交
        </sn-button>
      </sn-form>
    </sn-card>
  </view>
</template>

<style scoped>
/* 只用 var(--sn-mp-*) 变量（rpx 单位） */
.page-layout {
  padding: var(--sn-mp-spacing-inset-lg);
}
</style>
```

**关键差异**：

| 项 | Web | uni |
|---|---|---|
| 容器 | `<div>` | `<view>` |
| 组件前缀 | `SnButton` / `SnCard` | `sn-button` / `sn-card` |
| 组件写法 | PascalCase import | kebab-case 标签 + easycom |
| Token 别名 | `--sn-web-*` | `--sn-mp-*` |
| 单位 | px | rpx |

---

## 多页面原型

多页面原型以页面为单位拆分文件，每个页面是独立的 SFC：

```text
prototype/
├── pages/
│   ├── HomePage.vue          # Web / uni 各自一份
│   ├── ListPage.vue
│   └── DetailPage.vue
├── App.vue                   # 路由切换（简单用 ref 控制，不引入 vue-router）
└── main.ts
```

`App.vue` 中使用简单的 `component :is` 切换页面（Web 端）。uni 端用 `<navigator>` 组件或简单 ref 控制：

```vue
<!-- Web 端 App.vue -->
<script setup lang="ts">
import { ref } from 'vue'
import HomePage from './pages/HomePage.vue'
import ListPage from './pages/ListPage.vue'

const pages = { home: HomePage, list: ListPage }
const current = ref<'home' | 'list'>('home')
</script>

<template>
  <component :is="pages[current]" @navigate="current = $event" />
</template>
```

```vue
<!-- uni 端 App.vue -->
<script setup lang="ts">
import { ref } from 'vue'
import HomePage from './pages/home.vue'
import ListPage from './pages/list.vue'

const pages = { home: HomePage, list: ListPage }
const current = ref<'home' | 'list'>('home')
</script>

<template>
  <component :is="pages[current]" @navigate="current = $event" />
</template>
```

---

## 原型质量检查清单（端独立）

AI 产出后必须自检：

```text
[ ] 端识别：明确目标端是 Web 还是 uni（避免输出混合代码）
[ ] Web 端 import 来自 @snui/vue-web；uni 端用 easycom 自动注册
[ ] Web 端 import '@snui/tokens-web/styles'；uni 端 import '@snui/tokens-mp/styles'
[ ] 无字面量颜色值（全部 var(--sn-web-*) 或 var(--sn-mp-*)）
[ ] 无内联 style 中写颜色值
[ ] Token 别名层匹配端：Web 端不允许出现 --sn-mp-*；uni 端不允许出现 --sn-web-*
[ ] Props 与 get_component_meta({ end }) 返回完全一致
[ ] 代码通过 vue-tsc --noEmit（Web 端用 vue-tsc；uni 端用 uni-app vue-tsc）
[ ] 交互状态完整（loading / disabled / error / empty）
[ ] 无 eval() / new Function() / document.write()
[ ] 无直接操作 DOM（只用 Vue 响应式）
[ ] 无跨端 import（vue-web 包到 uni 项目 / uni 包到 vue-web 项目）
[ ] 无 !important
```

---

## 应用级代码生成（Web 端）

在原型基础上继续产出 Web 端工程代码：

| 原型部分 | 应用代码补充 |
|---|---|
| `<script setup>` 状态 | Pinia Store（`defineStore` + state / getters / actions） |
| `setTimeout` 模拟 | 真实 API 调用层（`fetch` + TypeScript 类型） |
| 单文件 | 多文件（router / views / components / api / types） |
| 无路由 | Vue Router |
| 无错误处理 | 错误边界 + Toast 提示 |

Pinia Store 规范：

```ts
// stores/user.store.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { User } from '../types/user.types'
import { fetchUser } from '../api/user.api'

export const useUserStore = defineStore('user', () => {
  const user = ref<User | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)
  const isLoggedIn = computed(() => user.value !== null)

  async function loadUser(id: string) {
    loading.value = true
    error.value = null
    try { user.value = await fetchUser(id) }
    catch (e) { error.value = '加载失败，请重试' }
    finally { loading.value = false }
  }

  return { user, loading, error, isLoggedIn, loadUser }
})
```

API 层：

```ts
// api/user.api.ts
import type { User } from '../types/user.types'

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '/api'

export async function fetchUser(id: string): Promise<User> {
  const res = await fetch(`${BASE_URL}/users/${id}`)
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.json() as Promise<User>
}
```

---

## 应用级代码生成（uni 端）

在原型基础上产出 uni 端工程代码：

| 原型部分 | 应用代码补充 |
|---|---|
| `<script setup>` 状态 | `useXxxStore` 模式或 pages 局部 ref |
| `setTimeout` 模拟 | 真实 `uni.request` / `wx.request` 调用 |
| 单文件 | `pages/{name}/index.vue` + `pages.json` 注册 |
| 无路由 | `pages.json` 路由配置 |
| 无错误处理 | `uni.showToast` / `uni.showModal` |

```json
// src/pages.json
{
  "pages": [
    {
      "path": "pages/home/index",
      "style": { "navigationBarTitleText": "首页" }
    },
    {
      "path": "pages/list/index",
      "style": { "navigationBarTitleText": "列表" }
    }
  ]
}
```

---

## 当前状态

- ✅ Skill 文件（含端识别 + 端独立约束）
- ✅ MCP Server stub（4 个工具，end 过滤）
- ✅ ai-meta.json 生成器（按端分组）
- 🔄 render_preview 沙箱 — M3（AUI-AI-004，按 end 选沙箱）

---

## 下一步

- [AI 生态总览](/ai/overview)
- [Skill 文件](/ai/skill)
- [MCP Server](/ai/mcp)