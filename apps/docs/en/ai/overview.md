# AI Ecosystem Overview

snail-aui is an **AI-Native** UI framework. AI can not only understand components, but also produce high-fidelity prototypes, application code, and switch entire visual styles online. `@snui/ai` exposes three artifacts.

> **v3.1 End-Independent**: All AI artifacts are end-aware. The Skill file describes Web / uni as two separate paths; MCP tools filter by `end: 'web' | 'mp'`; ai-meta.json groups components, Tokens, and Style Packs per-end, so AI parses by target end after loading.

---

## Three artifacts

### 1. Skill file (`snail-ui.skill.md`)

AI Skill is a structured **behavior contract**, not API documentation. It tells AI how to write code with snail-aui and what to forbid:

- End identification: confirm target end first (Web / uni), follow separate component package / Token alias paths
- Web component import rules (`Sn-` prefix, `import` from `@snui/vue-web`)
- uni component import rules (easycom auto-register, `<sn-xxx>` tag)
- Props naming conventions
- **Token reference rules (strongest)**: Web uses `var(--sn-web-*)`; uni uses `var(--sn-mp-*)`; never reference `--aui-*` base layer directly
- Hi-Fi prototype output format (standard three-section SFC)
- Forbidden: `eval`, hardcoded color, cross-layer reference

Location: `packages/ai/src/skill/skill.md`.

### 2. MCP Server (4 tools)

MCP (Model Context Protocol) lets any MCP-capable AI client (Cursor / Claude Desktop / Mavis) call tools directly. All tools support `end` filtering:

| Tool | Input | Output | end filter |
|---|---|---|---|
| `list_components` | `{ end: 'web' \| 'mp' \| 'both' }` | Component list | ✅ by end |
| `get_component_meta` | `{ name, end }` | Props / Events / Slots / Tokens / A11y | ✅ validates component end |
| `get_style_pack` | `{ name, end? }` | Pack + ready-to-paste `snCssVars` snippet | ✅ validates pack.end |
| `render_preview` | `{ vueCode, packName?, end }` | Sandbox preview URL (M3) | ✅ picks end sandbox |

Start:

```bash
npx @snui/ai
```

MCP config (Cursor / Claude Desktop / Mavis):

```json
{
  "mcpServers": {
    "snail-aui": {
      "command": "npx",
      "args": ["@snui/ai"]
    }
  }
}
```

### 3. ai-meta.json aggregate file

Packages component metadata + Tokens + Style Packs in one file for AI context loading:

```bash
pnpm snui ai-meta
# outputs apps/docs/public/ai-meta.json
```

`ai-meta.json` structure (v3.1 per-end grouping):

```json
{
  "version": "0.3.1",
  "tokens": {
    "base": "/* --aui-* unified base layer */",
    "web": "/* --sn-web-* alias layer */",
    "mp": "/* --sn-mp-* alias layer */"
  },
  "components": {
    "web": [
      { "name": "SnButton", "props": [...], "events": [...], "tokens": [...] },
      { "name": "SnCard", "props": [...], "events": [...], "tokens": [...] }
    ],
    "mp": [
      { "name": "sn-button", "props": [...], "events": [...], "tokens": [...] }
    ]
  },
  "stylePacks": [
    { "name": "default", "end": "both", "theme": {...}, "style": {...} },
    { "name": "mp-taobao", "end": "mp", "theme": {...}, "style": {...} }
  ]
}
```

After loading, AI pulls components from `components.web` or `components.mp` and Tokens from `tokens.web` or `tokens.mp` based on target end.

---

## Hi-Fi prototype workflow (end-independent)

```text
User requirement (natural language)
    ↓
AI reads snail-ui.skill.md (behavior contract with end ID)
    ↓
AI identifies target end (Web / uni)
    ↓
AI calls MCP list_components({ end: <target> })
    ↓
AI calls MCP get_component_meta({ name, end: <target> })
    ↓
AI generates Vue SFC (Web uses var(--sn-web-*), uni uses var(--sn-mp-*))
    ↓
AI calls MCP render_preview({ vueCode, end: <target> }) (M3 sandbox validation)
    ↓
Outputs end-independent runnable hi-fi prototype
```

---

## Application-level code generation

Building on the prototype to produce engineering code:

- Pinia Store (`defineStore` + state / getters / actions) — Web only
- API layer (`fetch` wrapper, typed returns)
- TypeScript type definitions
- Router config (Web vue-router, uni `pages.json`)
- uni additions: `pages.json` registration, prototype → application code conversion

See [Skill file](/ai/skill), [Hi-Fi prototype](/ai/prototype), and [MCP Server](/ai/mcp).

---

## End-independent AI workflow (core constraint)

> **AI must explicitly identify the target end when writing code**. For the same requirement, produce **two sets** of code for Web and uni — **zero source-code reuse**. Style Packs are shared, but component implementations, Token aliases, and file paths are per-end.

Wrong example (mixed ends):

```vue
<!-- ❌ wrong: importing both vue-web and uni -->
<script setup>
import { SnButton } from '@snui/vue-web'  // Web
import snButton from '@snui/uni/sn-button' // uni
</script>
```

Correct example (per-end files):

```vue
<!-- Web code (apps/web/src/pages/Home.vue) -->
<script setup lang="ts">
import { SnButton, SnCard } from '@snui/vue-web'
import '@snui/tokens-web/styles'
</script>

<style scoped>
.button { padding: var(--sn-web-spacing-inset-md); }
</style>
```

```vue
<!-- uni code (apps/uni/src/pages/home/home.vue) -->
<script setup lang="ts">
// easycom auto-registers sn-button / sn-card
import '@snui/tokens-mp/styles'
</script>

<style scoped>
.button { padding: var(--sn-mp-spacing-inset-md); }
</style>
```

---

## Next

- [Skill file](/ai/skill)
- [MCP Server](/ai/mcp)
- [Hi-Fi prototype](/ai/prototype)