# AGENTS.md 修订清单（ADR-0002 Implementation Plan）

**版本**：v1.0  
**状态**：Proposed（待 Human Gate 审批后执行修订）  
**关联**：ADR-0002 / PRD v3.0 / WBS v3.0 M1-FOUND  
**日期**：2026-10-03

---

## 背景

AGENTS.md 是项目最高级别规则文件。当前规则基于 v1.x Schema-Runtime 架构制定，其中部分条款与 ADR-0001、ADR-0002 确立的新方向冲突。

按 AGENTS.md §74 规则，架构变更必须先经 Human Gate 审批。本文档是修订实施前置计划，列出冲突条款、修订方向、修订后条款草案**，等用户审批后再落地**。

---

## 冲突条款列表

| AGENTS.md 章节 | 当前规则概要 | 与 v3.0 冲突点 | 修订方向 |
|---|---|---|---|
| §16-§20 | Schema First / Runtime First / Schema 不得直接调用 Service | v3.0 是 Component First / Token First / Style Pack First | 改为「Component First / Token First / Style Pack First」并删除"Schema 不得直接调 Service"等已无意义的条款 |
| §21 | Schema 不得调用业务 Service（`{action: "userService.createUser"}` 改为 `{action: "create-user"}`）| 已无 schema 概念 | 删除 |
| §22 | Action Registry 必须通过注册表解析 | 无 Action Registry 概念 | 删除 |
| §23 | 禁止 `eval()` / `new Function()`；Schema 表达式沙箱 | 部分仍需保留（禁止动态执行），但 Schema 沙箱无意义 | 拆分为"禁止动态代码执行"（保留）+ 删除"Schema 表达式沙箱" |
| §24 | Binding 只能引用受控 Context（state / props / computed / context）| 无 Binding 概念 | 删除 |
| §25 | 所有核心 Schema 用 Zod 单一真理来源 | 已无 Schema | 替换为"组件 Props 类型用 TS interface，AI 元数据用 ai-description.md 维护" |
| §26 | Schema 必须 validate / normalize / execute | 无 Schema 概念 | 删除 |
| §27 | Normalizer 必须 deterministic / pure / idempotent | 无 Normalizer | 删除 |
| §28-§29 | AUIError 接口 + 错误码 | 错误系统仍需保留，但用 TS interface 而非 Zod | 改写为"TS interface + 字符串字面量联合作为错误码" |
| §30-§31 | Component Contract（name / version / props / events / slots / tokens / accessibility / capabilities） | 与 v3.0 一致，保留 | 保留并细化（加入 `data-snui-component` 钩子要求） |
| §32 | Vue 组件只负责渲染 / 交互 / DOM，不负责 Schema 校验 / 业务逻辑 / AI 逻辑 | 仍有效 | 保留 |
| §33-§34 | Token 层级 | 与 v3.0 一致，保留 | 保留 |
| §35 | CSS Token 优先 | 与 v3.0 一致 | 保留（补充："兜底值只允许 transparent/inherit/currentColor"） |
| §36-§43 | 命名 / 函数 / 异步 / Abort / Dispose 等代码规范 | 与 v3.0 兼容 | 保留 |
| §44-§47 | 测试规范 | 保留 | 保留 |
| §48 | AI 不得删除失败测试 | 保留 | 保留 |
| §49-§51 | Snapshot / E2E / Visual Regression | 保留 | 保留 |
| §52 | A11y 不是发布后再补 | 保留 | 保留 |
| §53-§55 | Git Commit | 保留 | 保留 |
| §56 | Dependency 原则 | 保留 | 保留 |
| §57 | Package Dependency 方向（protocol ← schema ← runtime ← renderer）| 已无这些包 | 改为"tokens ← style-packs/vue-web/uni/ai ← docs" |
| §58 | Package Boundary（protocol 不能 import vue-web 等）| 保留并改写（vue-web 不能 import ai） | 保留 |
| §59 | Web / Uni Boundary | 保留 | 保留 |
| §61-§64 | Studio 原则 / JSON Patch / AI Repair | 无 Studio，无 Patch 概念 | 删除 |
| §65 | Runtime Inspect | 无 Runtime | 改为"开发环境 Inspect 通过 ai-meta.json + MCP 工具" |
| §66-§68 | 敏感信息 / Logging / Reporter | 保留 | 保留 |
| §69-§72 | 文档 / 注释 / TODO / FIXME | 保留 | 保留 |
| §73-§74 | ADR 流程 | 保留（继续生效） | 保留 |
| §75 | AI Context 标准 | 保留 | 保留 |
| §76-§77 | Golden Schema / Regression | 已无 Schema | 删除 Golden Schema；保留 Regression（改为"组件 golden"）|
| §78-§79 | API Compatibility / Stability | 保留 | 保留（补充 Style Pack 也属于 Public API）|
| §80-§81 | Performance / Bundle Size | 保留 | 保留 |
| §82 | Memory Leak | 保留 | 保留 |
| §83-§85 | Error Recovery / Capability / Fallback | 保留 | 保留 |
| §86-§87 | AI 自修复机制 | 保留 | 保留 |
| §88-§89 | Review Agent / Checklist | 保留 | 保留（增加"皮肤 CSS 不依赖 DOM 深层选择器"检查项） |
| §90 | Human Gate | 保留（继续生效） | 保留（补充 Style Pack 调整 token 变量名需 Human Gate） |
| §91-§92 | 普通任务 + Merge Gate | 保留 | 保留 |
| §93 | Stop-the-Line | 保留（大部分仍生效） | 改写：删除"Schema 直接调 Service"等已无意义条款；保留 eval / TypeScript / Dispose / Inspect 数据等核心条款 |
| §94-§95 | Agent 输出标准 / 不得声称未执行验证为通过 | 保留 | 保留 |
| §96-§97 | 完成标准 / 核心规则 | 保留 | 保留（补充"AI 不得绕开 tokens 包直接写 --aui-*"）|
| §98 | Agent 工作模型 | 保留 | 保留 |
| §99 | Human vs AI 决策边界 | 保留 | 保留（补充：Style Pack 调整属于 Human Gate） |
| §100 | Rule Priority | 保留 | 保留 |
| §101-§103 | Git 回退 / 评审 / Bug 记录 | 保留 | 保留 |
| §104 | 避免重复造轮子 | 保留 | 保留 |
| §105-§108 | 代码质量高标准 / 无废代码 / 无未用 | 保留 | 保留 |
| §109 | 补充规则 | 保留 | 保留 |
| §110 | 组件文档自动同步（VitePress）| 大部分仍生效 | 修订：删除"`framework-web.js` esbuild bundle"（FOUND-002 重建后不再用 schema bundle）；保留双语 × 双端 + ComponentPreview 真实渲染 |

---

## 修订后条款草案（节选）

### 草案 §16（新）

```text
# 16. 设计原则

Component First    每个组件是独立的 .vue 文件，直接 import
Token First        CSS 变量三层级联驱动颜色 / 圆角 / 间距
Style Pack First   风格是 Token + 皮肤 CSS + 资源三层可组合
AI Native          AI 通过 Skill 文件 + MCP Server 理解组件
```

### 草案 §23（新）

```text
# 23. 禁止动态代码执行

禁止：
  eval()
  new Function()
  document.write()
  setTimeout/setInterval 中传入字符串参数

需要动态生成代码时（如 MCP render_preview）必须：
  - 在独立 sandbox iframe 中运行
  - 编译由 @vue/compiler-sfc 在服务端完成
  - 沙箱无网络权限
  - 超时 15 秒，内存 64 MB 上限
```

### 草案 §30（修订）

```text
# 30. Component 开发标准

每个官方组件必须至少拥有：
  component.ts              主组件 SFC
  component.test.ts         单元测试
  ai-description.md         AI 友好组件说明

组件必须同时支持：
  Props
  Events
  Slots
  Tokens
  A11y
  Capability（Web / Uni 差异）
  Schema（ai-description）

新增：AUI-FOUND-004 要求每个组件根元素带：
  data-snui-component="{component-name}"

皮肤 CSS 通过该钩子选择组件，禁止依赖深层 DOM 选择器。
```

### 草案 §57（修订）

```text
# 57. Package Dependency

依赖方向：

  tokens  ←  style-packs
         ←  vue-web
         ←  uni
         ←  ai
         ←  cli
  docs    →  vue-web + uni + style-packs

禁止循环依赖。turbo lint 强制校验。

核心原则：
  - tokens 不依赖任何 package（叶子节点）
  - ai 不修改 vue-web / uni（只读元数据）
  - vue-web / uni 不依赖 ai
  - 皮肤 CSS 不修改组件 .vue（只看 data-snui-* 钩子）
```

### 草案 §65（修订）

```text
# 65. AI Context / Inspect

开发环境：
  - 通过 @snui/ai MCP Server 提供组件元数据
  - 通过 ai-meta.json 聚合文件一次性加载
  - 通过 snail-ui.skill.md 加载 AI 行为契约

生产环境：
  - MCP Server 默认不向生产应用暴露
  - ai-meta.json 可作为文档站静态资源发布

禁止：
  - 把包含敏感信息的组件元数据（业务 ID / 用户数据）写入 ai-meta.json
  - 在生产 bundle 中引入 @snui/ai 运行时
```

### 草案 §93（修订后保留核心条款）

```text
# 93. Stop-the-Line

出现以下任一情况必须 STOP THE LINE：

  eval() / new Function() 仍在任何包中出现
  组件 .vue CSS 包含字面量颜色值（除 transparent / inherit / currentColor）
  皮肤 CSS 修改组件 DOM 结构 / Props / 行为
  组件缺少 data-snui-component 钩子
  Public API 未审批
  Dispose / Abort 泄漏
  Component 缺 ai-description.md
  Production Inspect 泄露数据
  AI 修改组件内部状态（而不是通过 JSON Patch 等原子操作）
  删除失败测试
  关闭 CI
  绕过 TypeScript
  Style Pack 修改 @snui/tokens 已声明的 ComponentTokens 字段以外的属性
```

---

## 实施步骤

1. **Human Gate 审批**（AGENTS.md §74 / §90）：本清单交给用户审阅，签字确认修订方案
2. **执行修订**：按用户确认的方案改写 AGENTS.md 章节，单 commit 完成
3. **同步检查**：所有 dev-docs/ 中引用 AGENTS.md 章节号的文档（Spec / WBS / Dev Guide）逐一校对章节号是否仍正确
4. **回归**：跑 pnpm typecheck / lint / test / build 确认无回归

---

## 不在本修订范围内

- 不删除"Security / Architecture / Contract / Task Scope / Testing"优先级原则（§100）
- 不删除"AI Agent 不得声称未执行验证为通过"（§95）
- 不删除 Bug 修复三份记录规则（§103）
- 不删除 Stop-the-Line 核心机制
- 不重写 AGENTS.md 整体结构（保留 110 章节序号框架）

---

## 修订记录

| 版本 | 日期 | 变更 |
|---|---|---|
| v1.0 | 2026-10-03 | 初始版本（Proposed，待审批） |