# AI 生态总览

snail-aui 是 **AI-Native** UI 框架。AI 不仅能读懂组件，还能产出高保真原型、应用代码，以及在线切换整体风格。`@snui/ai` 包提供三类产物。

## 三类产物

### 1. Skill 文件（`snail-ui.skill.md`）

AI Skill 是一份结构化的**行为契约**，不是 API 文档。它告诉 AI 怎么用 snail-aui 写代码、禁止做什么：

- 组件引用规范（`Sn-` 前缀，easycom 路径）
- Props 命名约定
- Token 引用规则（只能用 `--sn-*`）
- 高保真原型输出格式（标准三段式 SFC）
- 禁止事项（`eval`、硬编码颜色、跨越 Token 层级）

位置：`packages/ai/src/skill/skill.md`。

### 2. MCP Server（4 个工具）

MCP（Model Context Protocol）让任何支持 MCP 的 AI 客户端（Cursor / Claude Desktop / Mavis）直接调用工具：

| 工具 | 输入 | 输出 |
|---|---|---|
| `list_components` | `{ end: 'web' \| 'uni' }` | 所有组件列表 |
| `get_component_meta` | `{ name, end }` | Props / Events / Slots / Tokens / A11y |
| `get_style_pack` | `{ name }` | Pack + 粘贴就绪的 `snCssVars` 片段 |
| `render_preview` | `{ vueCode, packName? }` | 沙箱预览 URL（M3 实装） |

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

## 高保真原型产出流程

```text
用户需求描述（自然语言）
    ↓
AI 读取 snail-ui.skill.md（行为契约）
    ↓
AI 调用 MCP list_components（确认组件存在）
    ↓
AI 调用 MCP get_component_meta（获取 Props / Tokens）
    ↓
AI 生成 Vue SFC 代码（符合 Skill 规范）
    ↓
AI 调用 MCP render_preview（M3，沙箱验证渲染）
    ↓
输出可运行的高保真原型
```

## 应用级代码生成

在原型基础上继续产出工程代码：

- Pinia Store（`defineStore` + state / getters / actions）
- API 调用层（`fetch` 封装，类型化返回）
- TypeScript 类型定义
- 路由配置

详见 [Skill 文件](/ai/skill) 与 [高保真原型](/ai/prototype)。

## 下一步

- [Skill 文件](/ai/skill)
- [MCP Server](/ai/mcp)
- [高保真原型](/ai/prototype)