# MCP Server

`@snui/ai` 提供一个 MCP（Model Context Protocol）Server，让 AI 客户端（Cursor / Claude Desktop / Mavis）能调用工具直接获取组件元数据和 Style Pack 配置。

> **v3.1 端独立**：所有工具都按 `end` 过滤。`list_components` / `get_component_meta` / `render_preview` 必须传 `end`；`get_style_pack` 验证 `pack.end` 与目标端匹配。

---

## 启动

```bash
npx @snui/ai
```

会启动一个 stdio-based MCP server。AI 客户端通过 stdio 与之通信。

---

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

### Mavis / 其他支持 MCP 的客户端

按各自 MCP 配置规范添加 `snail-aui` server，command + args 同上。

---

## 4 个工具（端独立）

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
      description: '主要交互按钮（Web 端）',
      importPath: 'import { SnButton } from "@snui/vue-web"',
    },
    // ...
    {
      name: 'sn-button',
      end: 'mp',
      description: '主要交互按钮（uni 端）',
      importPath: 'easycom 自动注册，无需 import',
    },
  ]
}
```

**`end` 过滤规则**：

| 输入 `end` | 返回 |
|---|---|
| `'web'` | `component.end === 'web'` |
| `'mp'` | `component.end === 'mp'` |
| `'both'` | 全部组件（Web + mp） |

> 跨端组件（`end: 'both'`）在两种 end 查询下都返回，但 importPath 按查询端给出。

### `get_component_meta`

```ts
// Input
{ name: 'SnButton', end: 'web' }
// 或: { name: 'sn-button', end: 'mp' }

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
    // 按端给出对应别名层
    { cssVar: '--sn-web-color-action-primary', purpose: '主色（Web 端）' },
    // 或
    { cssVar: '--sn-mp-color-action-primary', purpose: '主色（uni 端）' },
  ],
  accessibility: '...',
}
```

> 输入 `name` 与 `end` 不匹配（例如查 Web 元数据但用了 `sn-button` 名称）会返回 404。AI 必须先 `list_components({ end })` 再 `get_component_meta`。

### `get_style_pack`

```ts
// Input
{ name: 'ios', end: 'web' }   // ← 推荐传 end，会校验 pack.end 是否包含目标端
// 或: { name: 'ios' }         // 不传 end 则返回端无关数据（不附带 snippet）

// Output（end: 'web'）
{
  name: 'ios',
  end: 'both',
  label: 'iOS 风格',
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
// Output（end: 'mp'）
{
  name: 'ios',
  end: 'both',
  label: 'iOS 风格',
  snippet: `<!-- @snui/uni -->
<sn-config-provider skin="ios">
  <app />
</sn-config-provider>`,
  hasSkinCss: false,
}
```

**端约束**：如果 `pack.end === 'mp'`，但查询端是 `'web'`，会返回错误：`pack 'mp-taobao' not available for end 'web'`。

`snippet` 是粘贴到对应端项目即可生效的代码。

### `render_preview`

```ts
// Input
{
  vueCode: '<template><SnButton>OK</SnButton></template>',
  packName?: 'ios',
  end: 'web',   // ← 必填，选 Web / uni 沙箱
}

// Output
{
  url: '',       // sandbox iframe URL (M3 实装)
  success: false,
  error: 'render_preview is not implemented yet (M3 phase, AUI-AI-004).',
}
```

M0.5 状态：stub 实现，返回 `success: false` + "not implemented yet"。M3 阶段（AUI-AI-004）实装沙箱。

**端约束**：

- `end: 'web'` → 沙箱加载 `@snui/vue-web`（PC 布局，px 单位）
- `end: 'mp'` → 沙箱加载 `@snui/uni`（移动布局，rpx 单位）
- AI 传入 `vueCode` 与 `end` 不一致时会报错

---

## 安全边界

- Server 是只读上下文，不修改任何项目文件
- `render_preview`（M3）将在独立 iframe 沙箱中运行：
  - `sandbox="allow-scripts allow-same-origin"`
  - 无网络权限
  - SFC 编译由 `@vue/compiler-sfc` 在服务端完成，不执行 `eval`
  - 超时 15 秒，内存 64MB 上限
- 沙箱不允许 `fetch` / `XMLHttpRequest` / `fs` 等副作用 API

---

## 当前状态（M0.5）

- ✅ Skill 文件
- ✅ MCP Server 4 个工具 stub（render_preview M3 实装）
- ✅ ai-meta.json 生成器
- ✅ 端独立过滤（`list_components` / `get_component_meta` / `get_style_pack` / `render_preview`）

---

## 下一步

- [高保真原型](/ai/prototype)
- [Skill 文件](/ai/skill)