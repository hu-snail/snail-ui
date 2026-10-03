# AI 生态总览

snail-aui 是 **AI-Native** UI 框架。AI 不仅能读懂组件，还能产出高保真原型、应用代码，以及在线切换整体风格。`@snui/ai` 包提供三类产物。

> **v3.1 端独立**：AI 全部产物按端感知。Skill 文件分别描述 Web / uni 两条路径；MCP 工具按 `end: 'web' | 'mp'` 过滤；ai-meta.json 把组件、Token、Style Pack 按端分组，AI 加载时按目标端解析。

---

## 三类产物

### 1. Skill 文件（`snail-ui.skill.md`）

AI Skill 是一份结构化的**行为契约**，不是 API 文档。它告诉 AI 怎么用 snail-aui 写代码、禁止做什么：

- 端识别：先确认目标端（Web / uni），分别走不同的组件包、Token 别名
- Web 端组件引用规范（`Sn-` 前缀，import 路径）
- Uni 端组件引用规范（easycom 自动注册，`<sn-xxx>` 标签）
- Props 命名约定
- **Token 引用规则（最强）**：Web 端用 `var(--sn-web-*)`；uni 端用 `var(--sn-mp-*)`；禁止直接引用 `--aui-*` 原始层
- 高保真原型输出格式（标准三段式 SFC）
- 禁止事项（`eval`、硬编码颜色、跨层引用）

位置：`packages/ai/src/skill/skill.md`。

### 2. MCP Server（4 个工具）

MCP（Model Context Protocol）让任何支持 MCP 的 AI 客户端（Cursor / Claude Desktop / Mavis）直接调用工具。所有工具都带 `end` 过滤：

| 工具 | 输入 | 输出 | end 过滤 |
|---|---|---|---|
| `list_components` | `{ end: 'web' \| 'mp' \| 'both' }` | 组件列表 | ✅ 按 end 返回 |
| `get_component_meta` | `{ name, end }` | Props / Events / Slots / Tokens / A11y | ✅ 验证组件 end |
| `get_style_pack` | `{ name, end? }` | Pack + 粘贴就绪的 `snCssVars` 片段 | ✅ 验证 pack.end |
| `render_preview` | `{ vueCode, packName?, end }` | 沙箱预览 URL（M3 实装） | ✅ 选端沙箱 |

启动方式：

```bash
npx @snui/ai
```

MCP 配置（Cursor / Claude Desktop / Mavis 等）：

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

### 3. ai-meta.json 聚合文件

把组件元数据 + Token + Style Pack 一次性打包，供 AI 一次性加载上下文：

```bash
pnpm snui ai-meta
# 输出 apps/docs/public/ai-meta.json
```

`ai-meta.json` 结构（v3.1 按端分组）：

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

AI 加载后，按目标端从 `components.web` 或 `components.mp` 取组件，从 `tokens.web` 或 `tokens.mp` 取 Token 别名。

---

## 高保真原型产出流程（端独立）

```text
用户需求描述（自然语言）
    ↓
AI 读取 snail-ui.skill.md（行为契约，含端识别）
    ↓
AI 识别目标端（Web / uni）
    ↓
AI 调用 MCP list_components({ end: <目标端> })
    ↓
AI 调用 MCP get_component_meta({ name, end: <目标端> })
    ↓
AI 生成 Vue SFC 代码（Web 用 var(--sn-web-*)，uni 用 var(--sn-mp-*)）
    ↓
AI 调用 MCP render_preview({ vueCode, end: <目标端> })（M3 沙箱验证）
    ↓
输出端独立可运行的高保真原型
```

---

## 应用级代码生成

在原型基础上继续产出工程代码：

- Pinia Store（`defineStore` + state / getters / actions）—— Web 端
- API 调用层（`fetch` 封装，类型化返回）
- TypeScript 类型定义
- 路由配置（Web vue-router，uni `pages.json`）
- uni 端补充：`pages.json` 注册、原型 → 应用 code 转换

详见 [Skill 文件](/ai/skill) 与 [高保真原型](/ai/prototype) 与 [MCP Server](/ai/mcp)。

---

## 端独立的 AI 工作流（核心约束）

> **AI 写代码时必须明确目标端**。同一段需求，针对 Web 和 uni 输出**两套**代码，**0 行源代码复用**。Style Pack 是两端共用层，但组件实现、Token 别名、文件路径都按端区分。

错误示例（混端）：

```vue
<!-- ❌ 错误：同时 import vue-web 和 uni -->
<script setup>
import { SnButton } from '@snui/vue-web'  // Web 端
import snButton from '@snui/uni/sn-button' // uni 端
</script>
```

正确示例（按端分文件）：

```vue
<!-- Web 端代码（apps/web/src/pages/Home.vue）-->
<script setup lang="ts">
import { SnButton, SnCard } from '@snui/vue-web'
import '@snui/tokens-web/styles'
</script>

<style scoped>
.button { padding: var(--sn-web-spacing-inset-md); }
</style>
```

```vue
<!-- uni 端代码（apps/uni/src/pages/home/home.vue）-->
<script setup lang="ts">
// easycom 自动注册 sn-button / sn-card
import '@snui/tokens-mp/styles'
</script>

<style scoped>
.button { padding: var(--sn-mp-spacing-inset-md); }
</style>
```

---

## 下一步

- [Skill 文件](/ai/skill)
- [MCP Server](/ai/mcp)
- [高保真原型](/ai/prototype)