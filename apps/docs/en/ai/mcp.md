# MCP Server

`@snui/ai` ships a MCP (Model Context Protocol) Server so AI clients (Cursor / Claude Desktop / Mavis) can call tools to fetch component metadata and Style Pack configs directly.

## Start it

```bash
npx @snui/ai
```

A stdio-based MCP server starts and communicates with the AI client over stdio.

## Configure in your AI client

### Cursor / Claude Desktop

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

Restart the client to take effect.

## Four tools

### `list_components`

```ts
// Input
{ end: 'web' | 'uni' }

// Output
{
  components: [
    {
      name: 'SnButton',
      description: 'Primary interactive button',
      importPath: 'import { SnButton } from "@snui/vue-web"',
    },
    // ...
  ]
}
```

### `get_component_meta`

```ts
// Input
{ name: 'SnButton', end: 'web' }

// Output
{
  name: 'SnButton',
  description: '...',
  importPath: '...',
  props: [
    { name: 'type', type: "'primary' | 'default'", default: "'default'", required: false, description: '...' },
    // ...
  ],
  events: [{ name: 'click', payload: '(event: MouseEvent) => void', description: '...' }],
  slots: [{ name: 'default', description: '...' }],
  tokens: [{ cssVar: '--sn-color-action-primary', purpose: '...' }],
  accessibility: '...',
}
```

### `get_style_pack`

```ts
// Input
{ name: 'ios' | 'doodle' | 'dark' | ... }

// Output
{
  name: 'ios',
  label: 'iOS style',
  description: '...',
  snippet: `import { snCssVars } from '@snui/tokens'
import { iosPack } from '@snui/style-packs/ios'

const el = document.createElement('style')
el.textContent = snCssVars({ ... })
...`,
  hasSkinCss: false,
}
```

`snippet` is a copy-paste-ready snippet for `main.ts`.

### `render_preview`

```ts
// Input
{
  vueCode: '<template><SnButton>OK</SnButton></template>',
  packName?: 'ios',
}

// Output
{
  url: '',       // sandbox iframe URL (lands in M3)
  success: false,
  error: 'render_preview is not implemented yet (M3 phase, AUI-AI-004).',
}
```

M0.5 status: stub — returns `success: false` + "not implemented yet". The real sandbox lands in M3 (AUI-AI-004).

## Security boundaries

- The Server only reads — never modifies any project files
- `render_preview` (M3) runs in a dedicated iframe sandbox:
  - `sandbox="allow-scripts allow-same-origin"`
  - No network access
  - SFC compilation via `@vue/compiler-sfc` server-side, no `eval`
  - 15s timeout, 64MB memory cap
- Sandbox disallows side-effect APIs (`fetch` / `XMLHttpRequest` / `fs` / etc.)

## M0.5 status

- ✅ Skill file
- ✅ MCP Server 4 tools (render_preview stubbed for M3)
- ✅ ai-meta.json aggregator

## Where to next

- [Hi-fi prototype](/en/ai/prototype)
- [Skill file](/en/ai/skill)