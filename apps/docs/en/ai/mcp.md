# MCP Server

`@snui/ai` ships an MCP (Model Context Protocol) Server so AI clients (Cursor / Claude Desktop / Mavis) can call tools to fetch component metadata and Style Pack configurations directly.

> **v3.1 End-Independent**: All tools filter by `end`. `list_components` / `get_component_meta` / `render_preview` require `end`; `get_style_pack` validates `pack.end` against the target end.

---

## Start

```bash
npx @snui/ai
```

Launches a stdio-based MCP server. AI clients communicate over stdio.

---

## Configure AI clients

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

Restart the client to apply.

### Mavis / other MCP-capable clients

Add `snail-aui` server following each client's MCP config spec; command + args same as above.

---

## 4 tools (end-independent)

### `list_components`

```ts
// Input
{ end: 'web' | 'mp' | 'both' }

// Output
{
  components: [
    {
      name: 'SnButton',
      end: 'web',
      description: 'Primary action button (Web)',
      importPath: 'import { SnButton } from "@snui/vue-web"',
    },
    // ...
    {
      name: 'sn-button',
      end: 'mp',
      description: 'Primary action button (uni)',
      importPath: 'easycom auto-register, no import needed',
    },
  ]
}
```

**`end` filter rules**:

| Input `end` | Returns |
|---|---|
| `'web'` | `component.end === 'web'` |
| `'mp'` | `component.end === 'mp'` |
| `'both'` | All components (Web + mp) |

> Cross-end components (`end: 'both'`) return for either query, but `importPath` adapts to the queried end.

### `get_component_meta`

```ts
// Input
{ name: 'SnButton', end: 'web' }
// or: { name: 'sn-button', end: 'mp' }

// Output
{
  name: 'SnButton',
  end: 'web',
  description: '...',
  importPath: 'import { SnButton } from "@snui/vue-web"',
  props: [
    { name: 'type', type: "'primary' | 'default'", default: "'default'", required: false, description: '...' },
    // ...
  ],
  events: [{ name: 'click', payload: '(event: MouseEvent) => void', description: '...' }],
  slots: [{ name: 'default', description: '...' }],
  tokens: [
    // per-end alias layer
    { cssVar: '--sn-web-color-action-primary', purpose: 'Primary (Web)' },
    // or
    { cssVar: '--sn-mp-color-action-primary', purpose: 'Primary (uni)' },
  ],
  accessibility: '...',
}
```

> A mismatched `name` vs `end` (e.g. querying Web meta but using `sn-button` name) returns 404. AI must call `list_components({ end })` first, then `get_component_meta`.

### `get_style_pack`

```ts
// Input
{ name: 'ios', end: 'web' }   // ← recommended: pass end to validate pack.end
// or: { name: 'ios' }         // omit end → end-independent data (no snippet)

// Output (end: 'web')
{
  name: 'ios',
  end: 'both',
  label: 'iOS Pack',
  description: '...',
  snippet: `import { snCssVars } from '@snui/tokens'
import '@snui/tokens-web/styles'
import { iosPack } from '@snui/style-packs/ios'

const el = document.createElement('style')
el.textContent = snCssVars({
  end: 'web',
  theme: iosPack.theme,
  style: iosPack.style,
  density: iosPack.density,
})
document.head.appendChild(el)`,
  hasSkinCss: false,
}
```

```ts
// Output (end: 'mp')
{
  name: 'ios',
  end: 'both',
  label: 'iOS Pack',
  snippet: `<!-- @snui/uni -->
<sn-config-provider skin="ios">
  <app />
</sn-config-provider>`,
  hasSkinCss: false,
}
```

**End constraint**: If `pack.end === 'mp'` but queried end is `'web'`, returns error: `pack 'mp-taobao' not available for end 'web'`.

`snippet` is ready-to-paste code for the target end.

### `render_preview`

```ts
// Input
{
  vueCode: '<template><SnButton>OK</SnButton></template>',
  packName?: 'ios',
  end: 'web',   // ← required: Web / uni sandbox
}

// Output
{
  url: '',       // sandbox iframe URL (M3)
  success: false,
  error: 'render_preview is not implemented yet (M3 phase, AUI-AI-004).',
}
```

M0.5 status: stub returning `success: false` + "not implemented yet". M3 phase (AUI-AI-004) implements the sandbox.

**End constraint**:

- `end: 'web'` → sandbox loads `@snui/vue-web` (PC layout, px units)
- `end: 'mp'` → sandbox loads `@snui/uni` (mobile layout, rpx units)
- AI passing `vueCode` inconsistent with `end` raises an error

---

## Safety boundary

- Server is read-only context; never modifies project files
- `render_preview` (M3) runs in an isolated iframe sandbox:
  - `sandbox="allow-scripts allow-same-origin"`
  - No network permission
  - SFC compilation via `@vue/compiler-sfc` server-side, no `eval`
  - 15s timeout, 64MB memory cap
- Sandbox disallows `fetch` / `XMLHttpRequest` / `fs` and other side-effect APIs

---

## Current status (M0.5)

- ✅ Skill file
- ✅ MCP Server 4 tools stub (render_preview M3)
- ✅ ai-meta.json generator
- ✅ End-independent filtering (`list_components` / `get_component_meta` / `get_style_pack` / `render_preview`)

---

## Next

- [Hi-Fi prototype](/ai/prototype)
- [Skill file](/ai/skill)