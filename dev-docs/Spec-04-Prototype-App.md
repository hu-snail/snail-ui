# Spec-04：高保真原型与应用产出规范

**版本**：v1.0  
**状态**：Active  
**对应**：PRD v3.0 §4.2-4.3 / Architecture v3.0 §2.5  
**日期**：2026-10-03

---

## 1. 高保真原型定义

高保真原型（Hi-Fi Prototype）是指：

- 使用 snail-aui 真实组件（而非占位 div）
- Token 驱动样式（无硬编码颜色）
- 可在浏览器中直接运行（无需额外配置）
- 视觉效果与最终产品接近

与设计稿截图和静态 HTML 的区别：原型中的组件可以点击、填写、切换状态，是真实可交互的 Vue SFC。

---

## 2. 原型输出格式规范

### 2.1 单页原型（最常见）

```vue
<script setup lang="ts">
// ✅ 只 import snail-aui 组件和 Vue 核心
import { SnButton, SnInput, SnForm, SnFormItem, SnCard } from '@snui/vue-web'
import { ref, reactive } from 'vue'

// 状态定义
const form = reactive({
  name: '',
  email: '',
})
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
/* 只用 var(--sn-*) 变量 */
.page-layout {
  padding: var(--sn-spacing-inset-lg);
  max-width: 480px;
  margin: 0 auto;
}
</style>
```

### 2.2 多页面原型

多页面原型以页面为单位拆分文件，每个页面是独立的 Vue SFC：

```text
prototype/
├── pages/
│   ├── HomePage.vue
│   ├── ListPage.vue
│   └── DetailPage.vue
├── App.vue             # 路由切换（简单用 ref 控制，不引入 vue-router）
└── main.ts
```

`App.vue` 中使用简单的 `component :is` 切换页面，避免引入路由依赖：

```vue
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

---

## 3. 原型质量检查清单

AI 产出原型后，必须满足：

```text
[ ] 所有组件均来自 @snui/vue-web 或 @snui/uni
[ ] 无硬编码颜色值（全部用 var(--sn-*)）
[ ] 无内联 style 中写颜色字面量
[ ] Props 与 get_component_meta 返回完全一致
[ ] 代码通过 vue-tsc --noEmit（TypeScript 类型正确）
[ ] render_preview 调用成功，无运行时报错
[ ] 交互状态完整（loading / disabled / error / empty）
[ ] 响应式布局（mobile-first，或明确说明仅桌面）
[ ] 无 eval()、new Function()、document.write()
[ ] 无直接操作 DOM（只用 Vue 响应式）
```

---

## 4. 应用级代码生成规范

在原型基础上产出可集成的工程代码时，需要补充以下内容：

### 4.1 目录结构

```text
src/
├── views/
│   ├── {PageName}.vue         # 页面组件
│   └── ...
├── components/
│   └── {ComponentName}.vue    # 业务组件（封装）
├── stores/
│   └── {feature}.store.ts     # Pinia Store
├── api/
│   └── {feature}.api.ts       # API 调用层
├── types/
│   └── {feature}.types.ts     # 业务类型定义
├── router/
│   └── index.ts               # Vue Router 配置
└── main.ts
```

### 4.2 Pinia Store 规范

```ts
// stores/user.store.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { User } from '../types/user.types'
import { fetchUser } from '../api/user.api'

export const useUserStore = defineStore('user', () => {
  // State
  const user = ref<User | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Getters
  const isLoggedIn = computed(() => user.value !== null)

  // Actions
  async function loadUser(id: string) {
    loading.value = true
    error.value = null
    try {
      user.value = await fetchUser(id)
    } catch (e) {
      error.value = '加载失败，请重试'
    } finally {
      loading.value = false
    }
  }

  return { user, loading, error, isLoggedIn, loadUser }
})
```

### 4.3 API 层规范

```ts
// api/user.api.ts
import type { User } from '../types/user.types'

// API 基础配置（由用户补充真实地址）
const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '/api'

export async function fetchUser(id: string): Promise<User> {
  const res = await fetch(`${BASE_URL}/users/${id}`)
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.json() as Promise<User>
}
```

### 4.4 TypeScript 规范

- 所有业务类型在 `src/types/` 中定义
- 不允许 `any`（用 `unknown` + 类型守卫替代）
- Props 使用 `defineProps<{}>()` 泛型语法
- 异步函数返回值必须有类型标注

### 4.5 uni-app 页面产出

uni-app 页面产出额外需要：

```json
// src/pages.json（追加）
{
  "pages": [
    {
      "path": "pages/{name}/index",
      "style": {
        "navigationBarTitleText": "{页面标题}"
      }
    }
  ]
}
```

---

## 5. 原型与应用的边界

| 能力 | 原型 | 应用代码 |
|---|---|---|
| 真实组件 | ✅ | ✅ |
| 真实交互 | ✅（模拟） | ✅（真实） |
| API 调用 | ❌（setTimeout 模拟） | ✅（真实 fetch） |
| Pinia Store | ❌（本地 ref 代替） | ✅ |
| 路由 | ❌（component :is 代替） | ✅（vue-router） |
| 表单验证 | ✅（SnForm rules） | ✅（可用 Zod 集成） |
| TypeScript 类型 | 基础（Props 正确即可） | 完整严格 |

---

## 6. 修订记录

| 版本 | 日期 | 变更 |
|---|---|---|
| v1.0 | 2026-10-03 | 初始版本（Active） |
