# AI Ecosystem Overview

snail-aui is an **AI-Native** UI framework. AI can read components, produce hi-fi prototypes, generate application code, and swap whole visual identities. `@snui/ai` provides three artifacts.

## Three artifacts

### 1. Skill file (`snail-ui.skill.md`)

The AI Skill is a structured **behavior contract** — not an API reference. It tells AI how to use snail-aui and what is forbidden:

- Component import rules (`Sn-` prefix, easycom path)
- Props naming conventions
- Token rules (only `var(--sn-*)`, no hardcoded colors)
- Hi-fi prototype output format (standard three-section SFC)
- Forbidden patterns (`eval`, literal colors, breaking Token layering)

Location: `packages/ai/src/skill/skill.md`.

### 2. MCP Server (4 tools)

MCP (Model Context Protocol) lets any MCP-capable AI client (Cursor / Claude Desktop / Mavis) call tools directly:

| Tool | Input | Output |
|---|---|---|
| `list_components` | `{ end: 'web' \| 'uni' }` | All component list + summary |
| `get_component_meta` | `{ name, end }` | Props / Events / Slots / Tokens / A11y |
| `get_style_pack` | `{ name }` | Pack + ready-to-paste `snCssVars(...)` snippet |
| `render_preview` | `{ vueCode, packName? }` | Sandbox preview URL (M3 phase) |

Start it:

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

### 3. ai-meta.json aggregation

All component metadata + Tokens + Style Packs bundled into one JSON for one-shot AI context loading:

```bash
pnpm snui ai-meta
# outputs apps/docs/public/ai-meta.json
```

## Hi-fi prototype workflow

```text
User requirement (natural language)
    ↓
AI loads snail-ui.skill.md (behavior contract)
    ↓
AI calls MCP list_components (confirm components exist)
    ↓
AI calls MCP get_component_meta (get Props / Tokens)
    ↓
AI generates Vue SFC (compliant with Skill rules)
    ↓
AI calls MCP render_preview (M3, sandbox verification)
    ↓
Outputs a runnable hi-fi prototype
```

## Application-level code generation

Build on top of prototypes to produce project-ready code:

- Pinia Store (`defineStore` + state / getters / actions)
- API layer (typed `fetch` wrapper)
- TypeScript types
- Router config

See [Skill file](/en/ai/skill) and [Hi-fi prototype](/en/ai/prototype).

## Where to next

- [Skill file](/en/ai/skill)
- [MCP Server](/en/ai/mcp)
- [Hi-fi prototype](/en/ai/prototype)