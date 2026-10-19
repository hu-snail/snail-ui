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

| 方案 | 说明 | 取舍 |
|---|---|---|
| A. 放进 `@snui/vue-web` / `@snui/uni` | 模板与原子组件同包 | ❌ 破坏按需加载；原子组件与页面成品生命周期混淆；违反 §58 |
| B. 每个模板独立包 | `@snui/template-ai-chat` 等 | ❌ 包数量爆炸、版本漂移、跨模板共享契约（消息 / 流式）无从安放 |
| C. 单包 `@snui/templates` + 子路径导出 | 一个包，`@snui/templates/web/chat` 等子路径 | ✅ 见 Decision |

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
