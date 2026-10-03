# Skill file

AI Skill (`snail-ui.skill.md`) is a structured behavior contract, **not** API documentation. It lives at `packages/ai/src/skill/skill.md`.

> **v3.1 End-Independent**: Every rule inside Skill is per-end. AI must **identify the target end first** (Web or uni) before writing code, then follow the corresponding end's rules. The two ends share **zero lines of source code**.

---

## Key contents

### 1. End identification (do this first)

When AI receives a task, it must first determine the target end:

| Keywords | Target end |
|---|---|
| PC / desktop / web / browser / Vue 3 | `web` |
| mobile / miniprogram / wechat / alipay / H5 / uni-app / uniapp | `mp` |

If ambiguous, ask "Is this for Web (PC) or uni (mobile)?". **Never default to Web.**

### 2. Component import rules

**Web (`@snui/vue-web`)**:

```ts
import { SnButton, SnInput, SnForm, SnCard } from '@snui/vue-web'
import '@snui/tokens-web/styles'
```

- All `Sn-` prefix, PascalCase imports
- Single-file components (no easycom), rely on build tool tree-shaking

**uni (`@snui/uni`)**:

```vue
<template>
  <!-- easycom auto-register -->
  <button type="primary">Button</button>
  <form :model="form">
    <input v-model="form.name" />
  </form>
</template>
```

- All `sn-` prefix, kebab-case tags
- easycom auto-register (convention: `components/{name}/{name}.vue` or `sn-{name}` SFC)
- Must explicitly `import '@snui/tokens-mp/styles'` to import rpx alias layer

**Forbidden**:

- Other UI libraries (Ant Design / Element Plus / Naive UI / Vant, etc.)
- Mixed prefixes (`A-` / `El-` / `N-` / `Van-`)
- **Cross-end imports** (`@snui/vue-web` must not appear in `@snui/uni` projects, and vice versa)

### 3. Props naming

- camelCase
- Boolean props: prefer `disabled` / `loading` / `block`, not `isDisabled`
- Controlled: `modelValue` + `update:modelValue` (v-model)

### 4. Token reference rules (strongest constraint)

Per-end:

| End | Only allowed Token |
|---|---|
| **Web** (`@snui/vue-web`) | `var(--sn-web-*)` alias layer (px) |
| **uni** (`@snui/uni`) | `var(--sn-mp-*)` alias layer (rpx) |

Forbidden:

- Hex literals (`#1677ff` / `#fff`, etc.)
- `rgb()` / `rgba()` / `hsl()` literals
- Color values in inline styles
- Direct reference to `--aui-*` base layer (internal to tokens package, invisible to components)
- Using `--sn-mp-*` in Web code, or `--sn-web-*` in uni code
- Using `--sn-web-*` or `--sn-mp-*` in Style Pack skin CSS (skin CSS is shared across ends)

Only allowed fallback values: `transparent` / `inherit` / `currentColor`.

### 5. Hi-Fi prototype output format (per-end)

**Web**:

```vue
<script setup lang="ts">
import { SnButton, SnInput, SnForm, SnCard } from '@snui/vue-web'
import '@snui/tokens-web/styles'
import { ref } from 'vue'
// only snail-aui + Vue core
// no axios/pinia/router (use setTimeout to simulate async in prototype)
</script>

<template>
  <!-- Sn-prefix components, camelCase props -->
  <SnCard>
    <SnForm :model="form">
      <SnInput v-model="form.name" placeholder="Name" />
      <SnButton type="primary" :loading="loading" @click="submit">Submit</SnButton>
    </SnForm>
  </SnCard>
</template>

<style scoped>
/* only var(--sn-web-*), no literal colors */
.page { padding: var(--sn-web-spacing-inset-lg); }
</style>
```

**uni**:

```vue
<!-- easycom auto-registers sn-button / sn-input / sn-form / sn-card -->
<script setup lang="ts">
import '@snui/tokens-mp/styles'
import { ref } from 'vue'
</script>

<template>
  <sn-card>
    <sn-form :model="form">
      <sn-input v-model="form.name" placeholder="Name" />
      <sn-button type="primary" :loading="loading" @click="submit">Submit</sn-button>
    </sn-form>
  </sn-card>
</template>

<style scoped>
/* only var(--sn-mp-*), auto rpx */
.page { padding: var(--sn-mp-spacing-inset-lg); }
</style>
```

### 6. Forbidden

- `eval()` / `new Function()` / `document.write()`
- Hardcoded color values
- Direct DOM manipulation (use Vue reactivity)
- Using components not provided by snail-aui (call `list_components` first)
- `!important`
- Modifying component `.vue` internal implementation
- **Cross-end imports** (vue-web in uni project / uni in vue-web project)
- **Cross-end Token references** (`--sn-mp-*` in vue-web code)

---

## Using Skill in code

Skill is exported from `@snui/ai/skill`:

```ts
import { SKILL_VERSION, SKILL_CONTENT, loadSkill } from '@snui/ai/skill'

const text = loadSkill()
// prepend to AI prompt
const prompt = `${SKILL_CONTENT}\n\n## User request\n${userInput}`
```

---

## Version

- `@snui/ai@0.1.0` — initial
- `@snui/ai@0.3.0` — v3.1 end-independent (Active)

Skill is human-maintained. AI must not auto-overwrite. Any modification requires a human PR.

---

## Next

- [MCP Server](/ai/mcp)
- [Hi-Fi prototype](/ai/prototype)