# MCP Server

`@snui/ai` 提供一个 MCP（Model Context Protocol）Server，让 AI 客户端（Cursor / Claude Desktop / Mavis）能调用工具直接获取组件元数据和 Style Pack 配置。

## 启动

```bash
npx @snui/ai
```

会启动一个 stdio-based MCP server。AI 客户端通过 stdio 与之通信。

## 在 AI 客户端中配置

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

重启客户端后生效。

## 4 个工具

### `list_components`

```ts
// Input
{ end: 'web' | 'uni' }

// Output
{
  components: [
    {
      name: 'SnButton',
      description: '主要交互按钮',
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
  label: 'iOS 风格',
  description: '...',
  snippet: `import { snCssVars } from '@snui/tokens'
import { iosPack } from '@snui/style-packs/ios'

const el = document.createElement('style')
el.textContent = snCssVars({ ... })
...`,
  hasSkinCss: false,
}
```

`snippet` 是粘贴到 `main.ts` 即生效的代码。

### `render_preview`

```ts
// Input
{
  vueCode: '<template><SnButton>OK</SnButton></template>',
  packName?: 'ios',
}

// Output
{
  url: '',       // sandbox iframe URL (M3 实装)
  success: false,
  error: 'render_preview is not implemented yet (M3 phase, AUI-AI-004).',
}
```

M0.5 状态：stub 实现，返回 `success: false` + "not implemented yet"。M3 阶段（AUI-AI-004）实装沙箱。

## 安全边界

- Server 是只读上下文，不修改任何项目文件
- `render_preview`（M3）将在独立 iframe 沙箱中运行：
  - `sandbox="allow-scripts allow-same-origin"`
  - 无网络权限
  - SFC 编译由 `@vue/compiler-sfc` 在服务端完成，不执行 `eval`
  - 超时 15 秒，内存 64MB 上限
- 沙箱不允许 `fetch` / `XMLHttpRequest` / `fs` 等副作用 API

## 当前状态（M0.5）

- ✅ Skill 文件
- ✅ MCP Server 4 个工具 stub（render_preview M3 实装）
- ✅ ai-meta.json 生成器

## 下一步

- [高保真原型](/ai/prototype)
- [Skill 文件](/ai/skill)