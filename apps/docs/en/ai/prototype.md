# Hi-fi Prototypes

AI uses snail-aui to produce **hi-fi prototypes** — not screenshots, not Figma, but real runnable Vue SFCs.

## Prototypes vs mockups

| Dimension | Mockup | Hi-fi Prototype |
|---|---|---|
| Form | PNG / Figma | Real Vue components |
| Interaction | Static | Clickable / fillable / stateful |
| Style | Static | Token-driven (`--sn-*`) |
| Modify | Redraw | Edit SFC + switch Style Pack |
| AI output | No | Yes |

## Output workflow

```text
User requirement (natural language)
    ↓
AI loads snail-ui.skill.md (behavior contract)
    ↓
MCP list_components → confirm components exist
    ↓
MCP get_component_meta → fetch Props / Events / Tokens
    ↓
AI generates Vue SFC (compliant with Skill)
    ↓
MCP render_preview (M3) → sandbox verifies rendering
    ↓
Outputs runnable Vue SFC
```

## Prototype quality checklist

AI must self-check before delivery:

```text
[ ] All components come from @snui/vue-web or @snui/uni
[ ] No literal color values (everything uses var(--sn-*))
[ ] No inline color styles
[ ] Props match get_component_meta output exactly
[ ] Passes vue-tsc --noEmit
[ ] Full interaction states (loading / disabled / error / empty)
[ ] Responsive layout (mobile-first, or explicitly desktop-only)
[ ] No eval() / new Function()
[ ] No direct DOM manipulation (Vue reactivity only)
```

## Standard output format

```vue
<script setup lang="ts">
import { SnButton, SnInput, SnForm } from '@snui/vue-web'
import { ref, reactive } from 'vue'

const form = reactive({ name: '', email: '' })
const loading = ref(false)

async function handleSubmit() {
  loading.value = true
  await new Promise(r => setTimeout(r, 1000))  // mock in prototypes
  loading.value = false
}
</script>

<template>
  <div class="page-layout">
    <SnCard>
      <SnForm :model="form">
        <SnFormItem label="Name">
          <SnInput v-model="form.name" placeholder="Enter name" />
        </SnFormItem>
        <SnFormItem label="Email">
          <SnInput v-model="form.email" type="email" placeholder="Enter email" />
        </SnFormItem>
        <SnButton type="primary" :loading="loading" @click="handleSubmit">
          Submit
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

## Application-level code generation

Build on top of prototypes to produce project-ready code:

| Prototype part | Application code addition |
|---|---|
| `<script setup>` state | Pinia Store (`defineStore` + state / getters / actions) |
| `setTimeout` mock | Real API layer (`fetch` + TypeScript types) |
| Single file | Multi-file (router / views / components) |
| No routing | Vue Router / uni-app pages.json |
| No error handling | Error boundary + Toast feedback |

## Platform-neutral

A prototype should run on both Web and uni (H5):

- Use Flex / Grid for layout, never `<table>`
- Use Sn components (Web) and separate ones (uni/H5); avoid raw HTML tags
- Sizes prefer rpx (mobile) or var(--sn-*) (desktop)

## Current status

- ✅ Skill file
- ✅ MCP Server stub
- 🔄 render_preview sandbox — M3 (AUI-AI-004)

## Where to next

- [AI Ecosystem Overview](/en/ai/overview)
- [Skill file](/en/ai/skill)
- [MCP Server](/en/ai/mcp)