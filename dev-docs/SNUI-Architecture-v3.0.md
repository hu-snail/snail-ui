# snail-aui 整体架构 v3.0

> ⚠️ **本文档已被 Architecture v3.1 取代（Superseded by `dev-docs/SNUI-Architecture-v3.1.md`）**  
> 请勿再据此做新功能决策。仅用于历史追溯。

**版本**：v3.0
**状态**：Superseded（被 SNUI-Architecture-v3.1.md 取代）  
**对应**：PRD v3.0 / ADR-0001 / ADR-0002  
**日期**：2026-10-03

---

## 1. 架构全景

```text
┌─────────────────────────────────────────────────────────────────┐
│                        AI 生态层                                 │
│  snail-ui.skill.md   MCP Server   ai-meta.json   llms.txt       │
│  (@snui/ai)                       (@snui/cli)                    │
└─────────────────────┬───────────────────────────────────────────┘
                      │ 读取元数据
┌─────────────────────▼───────────────────────────────────────────┐
│                      文档 / 预览层                                │
│  VitePress docs   StyleSwitcher   ThemeCopier   ComponentPreview │
│  (@snui/docs)     — Web: body.class + <style>                    │
│                   — uni: ConfigProvider skin prop                 │
└──────────┬──────────────────────────────┬────────────────────────┘
           │ import 组件                   │ 读取 Pack
┌──────────▼──────────┐       ┌───────────▼──────────────────────┐
│    组件实现层         │       │         Style Pack 层            │
│  @snui/vue-web       │       │  @snui/style-packs               │
│  @snui/uni           │       │                                  │
│                      │       │  1. Token 层（snCssVars()）      │
│  每个组件根元素上     │       │  2. 皮肤 CSS 层（.snui-skin-*）  │
│  暴露 data-snui-     │       │  3. 资源层（字体 / 纹理）         │
│  component 钩子      │       │                                  │
│                      │       │  默认/iOS/暗色：Token 层即可      │
└──────────┬───────────┘       │  涂鸦/便签/抖音：需三层           │
           │ 消费 --sn-*       └──────────────────────────────────┘
┌──────────▼──────────────────────────────────────────────────────┐
│                      Token 层（@snui/tokens）                    │
│                                                                  │
│  Primitive  →  Semantic  →  Component                           │
│  颜色/间距     action-primary   button-radius                    │
│  圆角/阴影     text-secondary   card-shadow                      │
│                                input-height                      │
│                                                                  │
│  Theme 轴（颜色）   Style 轴（形状）   Density 轴（尺寸间距）      │
│  CSS 变量生成：--aui-* 原始层 + --sn-* 品牌别名层                 │
└──────────────────────────────────────────────────────────────────┘
```

---

## 2. 分层说明

### 2.1 Token 层（基础设施，零运行时依赖）

**包**：`@snui/tokens`  
**职责**：CSS 变量的唯一真理来源

```text
Primitive Tokens    原始值，Tailwind 风格 50-950 色阶
      ↓
Semantic Tokens     语义名，指向 Primitive 的 CSS var 引用
      ↓
Component Tokens    组件级，Style 轴可替换此层
      ↓
--sn-* 别名层       品牌别名（一对一映射 --aui-*），组件唯一消费入口
```

三轴（Theme / Style / Density）独立覆盖各自层级，严禁交叉。

**当前问题（AUI-FOUND-001）**：组件消费的变量名（`--sn-button-radius` 等）与 tokens 包实际输出不匹配，导致组件依赖硬编码兜底值，风格切换对组件无效。M1 前必须先修复。

### 2.2 Style Pack 层（风格个性化）

**包**：`@snui/style-packs`  
**职责**：封装可替换的整体风格

Style Pack 由三层构成（详见 Spec-01 §2）：

| 层 | 内容 | 必须 |
|---|---|---|
| Token 层 | 颜色、圆角、间距覆盖（`snCssVars()`）| ✅ 所有 Pack |
| 皮肤 CSS 层 | `.snui-skin-{name}` 作用域 CSS（字体/特效/装饰）| 仅需视觉人格的 Pack |
| 资源层 | 字体文件、SVG 纹理 | 仅 douyin 等 M4 Pack |

**核心约束**：皮肤 CSS 只操作视觉，不修改组件 DOM / Props / 行为。

### 2.3 组件实现层

**包**：`@snui/vue-web`（Web 端）、`@snui/uni`（uni-app 端）  
**职责**：交付可用组件

- 只用 `var(--sn-*)` 引用样式，兜底值只允许 `transparent`/`inherit`/`currentColor`
- 每个组件根元素暴露 `data-snui-component="{name}"` 皮肤钩子（AUI-FOUND-004）
- 每个组件配 `ai-description.md`
- 双端同名 Props / Events API

### 2.4 文档 / 预览层

**包**：`@snui/docs`、`@snui/preview`

**v3.0 关键修复（AUI-FOUND-002）**：  
`ComponentPreview.vue` 当前是 v1 schema renderer（`createVueRenderer` / `UISchema`），不能正常渲染当前组件。必须重建为直接 `import` Vue 组件并 mount 的方式。

**新增组件**：
- `StyleSwitcher.vue`：在线 Pack 切换面板，Web 端注入 `<style>` + `body.class`，文档站专用
- `ThemeCopier.vue`：展示 `snCssVars(...)` 代码片段，一键复制

**uni 文档预览**：不能用 `<style>` 注入方式，需要 ConfigProvider 包裹 + `skin` prop 传递。

### 2.5 AI 生态层

**包**：`@snui/ai`  
**三类产物**：

- `snail-ui.skill.md`：AI 行为契约（组件引用规范、Token 规则、禁止事项、输出格式）
- MCP Server：`list_components` / `get_component_meta` / `get_style_pack` / `render_preview` 四个工具
- `ai-meta.json`：聚合文件，由 `@snui/cli` 生成

**关于 ai-description.md 的维护策略**：  
手写 `ai-description.md` 与 `.vue` 文件会产生漂移。规范：
- Props / Events / Slots 表格由 `@snui/cli` 从 SFC `defineProps`/`defineEmits`/`defineSlots` 自动抽取
- 组件用途描述（Purpose）、使用场景（When to use / When not to use）、反例由人工维护
- CLI 在生成时合并两部分，Props 以自动抽取为准

**关于 render_preview 安全边界**：  
`render_preview` 接收任意 Vue SFC 字符串，存在安全风险。实现约束：
- 运行在独立 sandbox iframe，`sandbox="allow-scripts allow-same-origin"` 无网络权限
- SFC 编译由 `@vue/compiler-sfc` 在服务端完成，不执行 `eval`
- 超时 15 秒，内存 64MB 上限
- 不允许 `fetch` / `XMLHttpRequest` / `fs` 等副作用 API

### 2.6 CLI 工具层

**包**：`@snui/cli`  
**当前缺少 `bin` 入口**，`pnpm snui *` 命令需要在 AUI-TOOL-002 中补充。

| 命令 | 说明 |
|---|---|
| `snui llms` | 生成 llms.txt |
| `snui ai-meta` | 生成 ai-meta.json |
| `snui docs` | 从 SFC 提取 Props 等，生成 / 更新组件文档 |
| `snui new SnFoo` | 组件脚手架 |
| `snui pack validate` | 校验 Style Pack 合法性 |
| `snui token check` | 检查组件 CSS 无字面量颜色兜底 |

---

## 3. 地基任务（M1 前必须完成）

这四个任务是 Style Pack 和 ComponentPreview 的前置条件，不做好整个 v3.0 的核心功能都无法工作。

| ID | 任务 | 阻塞点 |
|---|---|---|
| AUI-FOUND-001 | Token 命名对齐（变量名统一 + 组件对齐）| 风格切换无效 |
| AUI-FOUND-002 | 重建 ComponentPreview.vue（移除 schema renderer）| 文档预览不可用 |
| AUI-FOUND-003 | ConfigProvider 双端 `skin` prop | uni 风格切换无路径 |
| AUI-FOUND-004 | 组件根元素 `data-snui-component` 钩子 | 皮肤 CSS 无选择器 |

---

## 4. 数据流

### 4.1 Web 端：用户在文档站切换风格

```text
点击 StyleSwitcher → 选择 "doodle" Pack
    ↓
注入 Token 层：snCssVars(pack) → <style id="snui-pack"> 替换 :root 变量
    ↓
激活皮肤：document.body.classList.add('snui-skin-doodle')
    ↓
加载皮肤 CSS：<link id="snui-skin" href="/packs/doodle.skin.css">
    ↓
组件 CSS：
  - 颜色/圆角/间距 → Token 层生效
  - 手写字体/偏移阴影 → 皮肤 CSS 生效（.snui-skin-doodle [data-snui-component="button"]）
    ↓
ThemeCopier 展示对应代码片段，用户复制
```

### 4.2 uni 端：风格切换

```text
用户选择 Pack
    ↓
ConfigProvider :skin="doodle"
    ↓
ConfigProvider 根元素：<view class="snui-skin-doodle">
    ↓
子组件根元素加上 class（通过 provide/inject 或 skin prop 传递）
    ↓
皮肤 CSS 中 .snui-skin-doodle .sn-button {} 生效
    ↓
（Token 层：通过 ConfigProvider 注入 CSS Variables，
  在 page 级别的 style block 内声明，绕过 :root 限制）
```

### 4.3 AI 产出高保真原型

```text
用户需求（自然语言）
    ↓
AI 加载 snail-ui.skill.md
    ↓
AI 调用 MCP list_components → 确认组件存在
    ↓
AI 调用 MCP get_component_meta → 获取 Props / Tokens
    ↓
AI 生成 Vue SFC（符合 Skill 规范）
    ↓
AI 调用 MCP render_preview → 沙箱编译渲染验证
    ↓
输出可运行高保真原型
```

---

## 5. 包边界规则

| 规则 | 说明 |
|---|---|
| tokens ← 无依赖 | 叶子节点，零运行时依赖 |
| style-packs → tokens（类型） | 只依赖 Token 类型，不依赖运行时 |
| vue-web / uni → tokens（CSS 变量） | 通过 CSS 变量消费，不 import TS |
| ai → cli + tokens（类型） | 读取 ai-description + Token 类型 |
| docs → vue-web + uni + style-packs | Application 层 |
| 禁止 vue-web / uni → ai | 组件不引入 AI 逻辑 |
| 禁止 tokens → vue / ai | Token 层 Framework Agnostic |
| 禁止循环依赖 | turbo lint 强制 |

---

## 6. uni / 小程序平台差异

| 能力 | Web 端 | uni H5 | 微信/支付宝小程序 |
|---|---|---|---|
| `:root {}` CSS 变量 | ✅ | ✅ | ❌（只支持 page / 组件级）|
| `[data-theme="dark"]` | ✅ | ✅ | ❌ |
| `document.body.classList` | ✅ | ✅（H5）| ❌ |
| 动态注入 `<style>` | ✅ | ✅（H5）| ❌ |
| 皮肤 CSS（BEM class）| ✅ | ✅ | ✅（组件 scoped 级别）|

**小程序皮肤策略**：ConfigProvider 根元素 class 传递 → 组件 scoped CSS 内声明 `.snui-skin-{name}` 覆盖 → 覆盖范围局限于 ConfigProvider 的 DOM 子树。皮肤效果不如 Web 端完整，但有明确的降级路径。

---

## 7. CI 流水线

```text
PR 提交
  ↓
typecheck（turbo run typecheck，0 error）
  ↓
lint（turbo run lint，0 warning）
  ↓
test（turbo run test，100% pass）
  ↓
build（turbo run build，0 error）
  ↓
token check（snui token check，无字面量颜色兜底）
  ↓
pack validate（新增/修改 Pack 时，snui pack validate）
  ↓
视觉回归（M4，关键组件截图比对）
  ↓
Review Agent（§88 Checklist）
  ↓
Human Gate（架构变更 / Public API 变更）
  ↓
merge main
```

---

## 8. 技术选型

| 层 | 技术 | 原因 |
|---|---|---|
| Token 系统 | TypeScript + CSS Custom Properties | 零运行时，类型安全，浏览器原生 |
| Style Pack | TS 数据对象 + 独立 CSS 文件 | Token 层零运行时；皮肤 CSS 异步加载，按需 |
| 组件（Web） | Vue 3 SFC + `<script setup>` | naive-ui 风格 API |
| 组件（Uni） | Vue 3 SFC + easycom | wot-ui 风格 API |
| 文档站 | VitePress | 真实组件渲染 |
| MCP Server | Node.js + @modelcontextprotocol/sdk | MCP 标准协议 |
| 构建 | Turbo + tsc + vue-tsc + esbuild | Monorepo 并行 |
| 测试 | Vitest + @vue/test-utils + happy-dom | 轻量，与 Vite 生态一致 |

---

## 9. 修订记录

| 版本 | 日期 | 变更 |
|---|---|---|
| v1.0 | 2026-09 | Schema-Runtime 三段式架构 |
| v2.0 | 2026-10-03 | Component First + Token First |
| v3.0 | 2026-10-03 | 新增 Style Pack 三层结构（Token+CSS+资源）+ AI 层 + 地基任务 + uni 平台差异 |
