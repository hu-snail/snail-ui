# Skill file

The AI Skill (`snail-ui.skill.md`) is a structured **behavior contract** — NOT an API reference. Located at `packages/ai/src/skill/skill.md`.

## Key sections

### Component import rules

- Web: `import { SnButton } from '@snui/vue-web'`
- Uni: easycom auto-registration, just write `<sn-button>`
- Forbidden: importing UI libraries other than snail-aui (Ant Design / Element Plus / Naive UI / etc.)
- Forbidden: mixing other prefixes (`A-` / `El-` / `N-` / `Van-`)

### Props naming conventions

- All camelCase
- Boolean props prefer `disabled` / `loading` / `block`, not `isDisabled`
- Controlled components use `modelValue` + `update:modelValue` (v-model)

### Token rules (the strongest constraint)

- In `<style>` only use `var(--sn-*)` variables
- Forbidden: hex literals (`#1677ff` / `#fff` etc.)
- Forbidden: `rgb()` / `rgba()` / `hsl()` literals
- Forbidden: writing colors in inline style
- Forbidden: directly referencing `--aui-*` variables
- Only allowed fallback keywords: `transparent` / `inherit` / `currentColor`

### Hi-fi prototype output format

```vue
<script setup lang="ts">
import { SnButton, SnInput, SnForm } from '@snui/vue-web'
import { ref } from 'vue'
// import only snail-aui components + Vue core
// don't import axios / pinia / router (use setTimeout to mock async in prototypes)
</script>

<template>
  <!-- Sn-prefix components, camelCase props -->
  <SnForm :model="form">
    <SnInput v-model="form.name" placeholder="Enter name" />
    <SnButton type="primary" :loading="loading" @click="submit">Submit</SnButton>
  </SnForm>
</template>

<style scoped>
/* only var(--sn-*); no color literals */
.page { padding: var(--sn-spacing-inset-lg); }
</style>
```

### Forbidden

- ❌ `eval()` / `new Function()` / `document.write()`
- ❌ Hardcoded color values (breaks Token rules)
- ❌ Direct DOM manipulation (use Vue reactivity)
- ❌ Importing non-snail-aui components (confirm with `list_components` first)
- ❌ `!important`
- ❌ Modifying component .vue internals

## Using the Skill in code

The Skill is exported by `@snui/ai/skill`:

```ts
import { SKILL_VERSION, SKILL_CONTENT, loadSkill } from '@snui/ai/skill'

const text = loadSkill()
// prepend to AI prompt
const prompt = `${SKILL_CONTENT}\n\n## User request\n${userInput}`
```

## Version

- `@snui/ai@0.1.0` — initial release

The Skill is human-maintained. AI must not auto-modify it; changes require a human PR.

## Where to next

- [MCP Server](/en/ai/mcp)
- [Hi-fi prototype](/en/ai/prototype)