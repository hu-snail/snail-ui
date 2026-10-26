# 0003 — 模板生态：新增 `@snui/templates` 包（按需加载 + props 配置）

## Status

Accepted（Human 于 v3.2 任务中确认包名、`web/` + `uni/` 目录结构、Sn- 前缀命名与统一版本号）

## Date

2026-10-03

## Context

ADR-0001 确定了 Component First 底座：`@snui/vue-web` / `@snui/uni` 提供原子组件，
`@snui/tokens-*` 提供本端别名层，Style Pack 提供皮肤。

用户提出新的产品诉求：在组件库之上建立**模板生态**——可安装、可按需加载、
可通过 props 配置的「页面 / 区块级成品」。

关键诉求：

1. 用户安装模板后，**只导入用到的模板**（例如「登录页模板」就只导入登录页），
   不能因为安装而被拖入整套模板；
2. 模板支持 **props 配置**（例如 `<SnLogo layout="default" theme="default" />`），
   而不是让用户改模板源码；
3. Web 与 uni 双端共享同一套设计语言，但平台差异**不得靠复制代码**解决。

沿用约束：

- §113 禁止 emoji 作为 UI 图标，一律 inline SVG；
- §104 不为方便新增依赖；
- §59 Web / uni 共享 Protocol / Contract / Token，平台差异用 Capability 解决；
- §2.4 组件 CSS：Web 只用 `var(--sn-web-*)`，uni 只用 `var(--sn-mp-*)`。

### 为什么模板不能放进组件库

模板是**页面 / 区块级编排**，生命周期与原子组件不同：

- 原子组件（Button / Input）必须始终可 tree-shake，且不允许携带业务编排语义；
- 模板天然聚合多个组件 + 状态 + 异步流，体量与变更频率都更高。

若混入 `@snui/vue-web`，则「只想用 Button」的消费者也会把全部模板拉进依赖图，
直接违背诉求 1；同时违反 §58 Package Boundary（组件库不应承载页面级成品）。

## Options

| 方案                                   | 说明                                        | 取舍                                                           |
| -------------------------------------- | ------------------------------------------- | -------------------------------------------------------------- |
| A. 放进 `@snui/vue-web` / `@snui/uni`  | 模板与原子组件同包                          | ❌ 破坏按需加载；原子组件与页面成品生命周期混淆；违反 §58      |
| B. 每个模板独立包                      | `@snui/template-ai-chat` 等                 | ❌ 包数量爆炸、版本漂移、跨模板共享契约（消息 / 流式）无从安放 |
| C. 单包 `@snui/templates` + 子路径导出 | 一个包，`@snui/templates/web/chat` 等子路径 | ✅ 见 Decision                                                 |

## Decision

采用 **方案 C**：新增单包 `@snui/templates`，内部按端拆分目录，
以**子路径导出（subpath exports）**实现按需加载。

```text
@snui/templates/web/chat          → SnAiChat
@snui/templates/web/prompt        → SnAiPrompt
@snui/templates/web/message-list  → SnAiMessageList
@snui/templates/web/model-config  → SnModelConfig
@snui/templates/uni/chat          → SnAiChat（uni）
@snui/templates/uni/message-list  → SnAiMessageList（uni）
@snui/templates/styles            → 模板样式层
```

具体约定：

1. **按需加载由构建保证**：Vite multi-entry lib build 产出**按模板分包**
   （`dist/web/chat.js`、`dist/uni/message-list.js` …），未导入的模板不进入产物。
2. **不重新实现基础组件**：模板一律复用 `@snui/vue-web` / `@snui/uni`，
   不自造 Button / Input / Switch / Dropdown。
3. **共享契约框架无关**：消息模型与流式折叠放在 `src/shared/`，
   Web 与 uni 折叠 delta 的语义同源，避免两端行为分叉（§59）。
4. **图标框架无关**：以 `SnIconData { viewBox, paths }` 提供，
   uni 产物不 import `@snui/vue-web`。
5. **props 优先**：可配置项（`theme` / `title` / `agents` / `models` …）
   走 props，`theme` 转发给 `SnConfigProvider :skin` 接入 Style Pack 体系。

## Reason

- 单包 + 子路径导出 = 「按模板安装」：`import { SnAiChat } from '@snui/templates/web/chat'`
  只引入该模板，其余模板不进依赖图；
- 统一版本号避免多包版本漂移（诉求 1 的工程化前提）；
- `shared/` 层让双端复用同一份流式折叠与格式化逻辑，
  符合 §59「双端共享、差异用 Capability 解决」。

## Trade-offs

- `@snui/templates` 的**声明**是整包安装，实际产物体积由 tree-shaking + 子路径导出保证；
- 需要维护 `exports` 映射与 multi-entry 构建配置（新增模板时同步更新）；
- 模板与基础组件存在版本耦合，需与 `@snui/vue-web` / `@snui/uni` 同步升级。

## Consequences

- 模板 CSS 只用本端别名变量，由 `@snui/cli token-check --end web|mp` 强制校验；
- `tokens-web` / `tokens-mp` 必须补齐共享语义刻度
  （spacing / radius / shadow / typography / line-height），
  否则模板会退化为硬编码数值、背离 8pt 节奏（§34）；
- uni 端线高 / 字重属于无单位比值，不能混入「尺寸别名必为 rpx」的映射，
  需单独分组（本决策落地时新增 `snMpUnitlessMap`）；
- 文档站新增「模板」菜单与 zh / en 双语文档页（§110）；
- 后续可扩展：模板 `ai-description.md`、CLI `llms-txt` 集成、
  AI Repair 模板 Patch 通道（AUI-TPL-005 / 006）。

## References

- WBS：`dev-docs/SNUI-WBS-v3.1.md` — AUI-TPL-001 .. AUI-TPL-004
- ADR-0001（Component First 底座）、ADR-0002（Style Pack + AI Layer）
- Spec-01 v1.2 §2.4（端别名层）、Spec-02 v1.1 §3.3（uni 只用 `--sn-mp-*`）

## Revision (v3.2.1) — per-template CSS + the unified AI assistant

1. **样式按模板切分，不再只有一个大样式文件。** `vite.config.js` 打开
   `cssCodeSplit: true`（Vite 在库模式下默认关闭），再由
   `scripts/emit-template-styles.mjs` 插件把「某个 entry 的 chunk 闭包 CSS」
   合并成 `dist/styles/<template>.css`，token 层单独输出为
   `dist/styles/tokens.css`；插件同时把 `import '…/tokens.css'` 与
   `import '…/<template>.css'` 追加到对应 entry chunk，因此
   `import { SnAiChat } from '@snui/templates/web/chat'` 会自动带上该模板
   自己的样式，且不会顺带打进其它模板的样式。
   - 旧形态：单个 `dist/styles/index.css` = token 31.8 kB + 全部模板 43.2 kB = 75 kB；
   - 新形态：`tokens.css` ~31 kB + 单模板 6.6–28.7 kB，按需加载；
   - `@snui/templates/styles` 现在指向 token 层（应用入口引一次），
     `@snui/templates/styles/web-chat.css` 等仍可手动单独引入。
2. **AI 套件收敛为一个统一模板 `SnAiAssistant`**
   （`@snui/templates/web/assistant`）：页头 + 转录 + 输入区 + 模型配置抽屉。
   `SnAiChat` 保留为「纯对话页」；`SnAiPrompt` / `SnModelConfig` /
   `SnAiMessageList` 仍可单独按需引入。`SnAiAssistant` 只声明自己的 props，
   其余 props / 事件经 `$attrs` 透传给 `SnAiChat`。
3. **文档按大分类组织**：模板菜单一级为「AI 套件」，二级为模板
   （AI 助手 / AI 对话页 / AI 输入框 / 消息列表 / 模型配置）；Web 与
   uni-app 差异写在同一页内，路径统一为 `/templates/ai/*`。

后果：

- 消费者不再需要「引一次全量样式」；多个模板共存时 token 层是同一个模块，
  只加载一次；
- 新增模板时必须同时登记 `vite.config.js` 的 entry 与 `package.json`
  `exports`，否则子路径不可达 / 样式不会随模板加载；
- 旧的 `/templates/web/*`、`/templates/uni/*` 路径不再存在（文档站尚未发布，
  未做重定向）。

## Revision (v3.2.2) — 助手改为真正的组装

原先 `SnAiAssistant` 是「包一层」：内部渲染 `SnAiChat`，再加一个模型配置抽屉。它虽然能用，
但组装关系是隐藏的——助手依赖一个同级页面，而不是依赖那些零件，`SnAiChat` 里的调度也无法被
另一种布局复用。

改成：

1. **抽出轮次引擎 `useAiTurnQueue`**（`src/web/use-ai-turn-queue.ts`）：排队、轮次分发、
   流式折叠、结构化错误、中断与卸载回收，全部集中在这里。`SnAiChat` 与 `SnAiAssistant`
   都只挂载它，不再各写一份。
2. **两个页面模板都是组装页**：
   - `SnAiChat` = 消息列表模板 + 输入框模板 + 引擎；
   - `SnAiAssistant` = 消息列表模板 + 输入框模板 + 模型配置模板（抽屉）+ 引擎。
     助手不再包含 `SnAiChat`。
3. **引擎作为公开子路径**：`@snui/templates/web/turn-queue`，使用方可以拿零件 + 引擎
   自己组装页面，行为与两个页面模板一致（同一个实现）。

后果：

- `SnAiChat` 从 434 行降到 ~205 行（§105 的 400 行上限恢复达标）；助手多出的样式是页面
  框架，不是逻辑；
- 助手的 props / 事件与 `SnAiChat` 同名同语义，两者互换仍只需改标签名；
- 新增页面模板时必须接入同一个引擎，否则排队 / 中断语义会与既有页面分叉；
- uni 端仍是独立的 `sn-ai-chat` / `sn-ai-message`（本次未做引擎共享）。
