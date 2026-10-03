# Hi-Fi Prototype

AI uses snail-aui to produce **hi-fi prototypes** — not screenshots, not Figma, but real runnable Vue SFCs.

> **v3.1 End-Independent**: The same requirement produces **two prototypes** (one Web + one uni), **zero source-code reuse**. AI's first step after receiving a task is **end identification** — clarify with the user whether the target is Web or uni, then write code using that end's component package and Token aliases.

---

## Prototype vs design

| Dimension | Design | Prototype |
|---|---|---|
| Form | PNG / Figma | Real Vue components |
| Interaction | None | Clickable / fillable / state-toggleable |
| Style | Static | Token driven |
| Modification | Re-render | Edit SFC + switch Style Pack |
| AI output | No | Yes |

---

## Workflow (end-independent)

```text
Requirement (natural language)
    ↓
AI loads snail-ui.skill.md (behavior contract with end ID rules)
    ↓
AI identifies target end (Web / uni), confirms with user
    ↓
MCP list_components({ end: <target> }) → confirm components exist
    ↓
MCP get_component_meta({ name, end }) → get Props / Events / Tokens
    ↓
AI generates Vue SFC:
    - Web → import from '@snui/vue-web' + var(--sn-web-*)
    - uni → easycom auto-register + var(--sn-mp-*)
    ↓
MCP render_preview({ vueCode, end }) (M3) → sandbox validation
    ↓
Output end-independent runnable Vue SFC
```

---

## Prototype output format (per-end)

### Web (`@snui/vue-web`)

```vue
<script setup lang="ts">
// ✅ only snail-aui components + Vue core
import { SnButton, SnInput, SnForm, SnFormItem, SnCard } from '@snui/vue-web'
import '@snui/tokens-web/styles'
import { ref, reactive } from 'vue'

const form = reactive({ name: '', email: '' })
const loading = ref(false)

async function handleSubmit() {
  loading.value = true
  await new Promise(r => setTimeout(r, 1000)) // simulated loading
  loading.value = false
}
</script>

<template>
  <div class="page-layout">
    <SnCard>
      <SnForm :model="form">
        <SnFormItem label="Name">
          <SnInput v-model="form.name" placeholder="Name" />
        </SnFormItem>
        <SnFormItem label="Email">
          <SnInput v-model="form.email" type="email" placeholder="Email" />
        </SnFormItem>
        <SnButton type="primary" :loading="loading" @click="handleSubmit">
          Submit
        </SnButton>
      </SnForm>
    </SnCard>
  </div>
</template>

<style scoped>
/* only var(--sn-web-*) */
.page-layout {
  padding: var(--sn-web-spacing-inset-lg);
  max-width: 480px;
  margin: 0 auto;
}
</style>
```

### uni (`@snui/uni`)

```vue
<!-- easycom auto-registers sn-button / sn-input / sn-form / sn-form-item / sn-card -->
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
        <sn-form-item label="Name">
          <sn-input v-model="form.name" placeholder="Name" />
        </sn-form-item>
        <sn-form-item label="Email">
          <sn-input v-model="form.email" type="email" placeholder="Email" />
        </sn-form-item>
        <sn-button type="primary" :loading="loading" @click="handleSubmit">
          Submit
        </sn-button>
      </sn-form>
    </sn-card>
  </view>
</template>

<style scoped>
/* only var(--sn-mp-*) (rpx) */
.page-layout {
  padding: var(--sn-mp-spacing-inset-lg);
}
</style>
```

**Key differences**:

| Item | Web | uni |
|---|---|---|
| Container | `<div>` | `<view>` |
| Component prefix | `SnButton` / `SnCard` | `sn-button` / `sn-card` |
| Component syntax | PascalCase import | kebab-case tag + easycom |
| Token alias | `--sn-web-*` | `--sn-mp-*` |
| Unit | px | rpx |

---

## Multi-page prototype

Split by page into independent SFCs:

```text
prototype/
├── pages/
│   ├── HomePage.vue       # Web or uni version
│   ├── ListPage.vue
│   └── DetailPage.vue
├── App.vue
└── main.ts
```

`App.vue` uses simple `component :is` (Web). uni side uses `<navigator>` or ref-based switching:

```vue
<!-- Web App.vue -->
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
<!-- uni App.vue -->
<script setup lang="ts">
import { ref } from 'vue'
import HomePage from './pages/home.vue'
import ListPage from './pages/list.vue'

const pages = { home: HomePage, app: ListPage }
const current = ref<'home' | 'list'>('home')
</script>

<template>
  <component :is="pages[current]" @navigate="current = $event" />
</template>
```

---

## Prototype quality checklist (end-independent)

AI self-check after output:

```text
[ ] End identification: target end explicit (Web or uni)
[ ] Web imports from @snui/vue-web; uni uses easycom auto-register
[ ] Web imports '@snui/tokens-web/styles'; uni imports '@snui/tokens-mp/styles'
[ ] No literal colors (all var(--sn-web-*) or var(--sn-mp-*))
[ ] No inline-style color values
[ ] Token alias matches end: Web no --sn-mp-*; uni no --sn-web-*
[ ] Props match get_component_meta({ end }) exactly
[ ] vue-tsc --noEmit passes (vue-tsc for Web, uni-app vue-tsc for uni)
[ ] Interaction states complete (loading / disabled / error / empty)
[ ] No eval() / new Function() / document.write()
[ ] No direct DOM manipulation (use Vue reactivity)
[ ] No cross-end imports (vue-web package in uni project / uni package in vue project)
[ ] No !important
```

---

## Application code generation (Web)

Add engineering code on top of Web prototype:

| Prototype part | Application addition |
|---|---|
| `<script setup>` state | Pinia Store (`defineStore` + state / getters / actions) |
| `setTimeout` simulation | Real API layer (`fetch` + TS types) |
| Single file | Multi-file (router / views / components / api / types) |
| No router | Vue Router |
| No error handling | Error boundary + Toast |

Pinia Store convention:

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
    catch (e) { error.value = 'Load failed, please retry' }
    finally { loading.value = false }
  }

  return { user, loading, error, isLoggedIn, loadUser }
})
```

API layer:

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

## Application code generation (uni)

Add uni engineering code on top of uni prototype:

| Prototype part | Application addition |
|---|---|
| `<script setup>` state | `useXxxStore` pattern or page-local ref |
| `setTimeout` simulation | Real `uni.request` / `wx.request` |
| Single file | `pages/{name}/index.vue` + `pages.json` registration |
| No router | `pages.json` route config |
| No error handling | `uni.showToast` / `uni.showModal` |

```json
// src/pages.json
{
  "pages": [
    {
      "path": "pages/home/index",
      "style": { "navigationBarTitleText": "Home" }
    },
    {
      "path": "pages/list/index",
      "style": { "navigationBarTitleText": "List" }
    }
  ]
}
```

---

## Current status

- ✅ Skill file (with end ID + end-independent constraints)
- ✅ MCP Server stub (4 tools, end filter)
- ✅ ai-meta.json generator (per-end grouping)
- 🔄 render_preview sandbox — M3 (AUI-AI-004, picks sandbox by end)

---

## Next

- [AI ecosystem overview](/ai/overview)
- [Skill file](/ai/skill)
- [MCP Server](/ai/mcp)