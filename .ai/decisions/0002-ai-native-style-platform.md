# 0002 — AI-Native Style Platform：风格包三层结构 + AI 生态层

## Status
Proposed（待 Human Gate 审批后转 Accepted）

## Date
2026-10-03

## Context

ADR-0001 建立了 Component First / Token First 底座。当前状态：

- `@snui/tokens` 三层 Token 级联（Primitive → Semantic → Component）可运行
- `SnButton` 双端 demo 验证通过
- VitePress 文档站真实渲染组件
- `ComponentPreview.vue` 仍是 v1 schema renderer（`createVueRenderer`），需要重建
- Button 消费的 `--sn-radius-button`、`--sn-button-size-*`、`--sn-color-focus-ring` 在 tokens 包中未定义——组件依赖硬编码兜底值，Token 系统形同虚设

用户提出新的产品诉求：

1. **AI 生态**：AI 能产出高保真原型和应用代码，不只是读文档
2. **在线风格替换**：涂鸦风、便签风、iOS 风、淘宝风、抖音风，在文档站可实时预览并一键复制配置
3. **组件文档风格预览**：文档页在不同风格下实时渲染
4. **AI 生态工具**：Skill 文件 + MCP Server

### 关键约束（决策前确认）

涂鸦、便签、抖音风格**无法只靠修改 Token 变量**实现：

- 涂鸦：手绘感边框（非规则曲线）、手写字体、黑白主色
- 便签：纸张纹理感背景、偏转阴影、大段留白
- 抖音：霓虹发光效果、深色底、红青双色光晕

这些视觉特征需要 CSS 动画、额外的 CSS 类、伪元素、字体资源。  
纯 Token 覆盖只能改颜色、圆角、间距，做不出视觉人格（visual personality）。

同时，uni-app 小程序端（WXSS）**不支持**：
- `:root {}` CSS 变量作用域（只能在 page 或组件 scoped 中声明）
- `[data-theme="dark"]` 属性选择器
- `@layer`

因此文档站注入 `<style>` 替换 `:root` 的方案对小程序无效，必须单独设计。

## Options

### A. 风格包 = 纯 Token 覆盖层（v3.0 初稿方案）

只改 CSS 变量，组件零修改。  
**问题**：做不出涂鸦 / 便签 / 抖音风格，承诺无法兑现。与现有 Token 命名不对齐（组件用的变量名 tokens 包未输出）。

### B. 风格包 = Token + 皮肤 CSS + 资源（chosen）

每个风格包由三层组成：

1. **Token 层**：覆盖颜色、圆角、间距、字号（通过 `snCssVars()`）
2. **皮肤 CSS 层**：提供 `.snui-skin-{name}` 作用域下的 CSS 类，可以叠加伪元素、动画、字体、特殊边框等
3. **资源层**（可选）：字体文件、SVG 纹理、CSS 动画变量

硬约束：皮肤 CSS **不能修改组件内部 DOM 结构、Props、行为、事件**，只能通过 CSS 覆盖视觉层。

**组件侧**：在根元素上暴露皮肤钩子点（`data-skin` 或 BEM 修饰符），皮肤 CSS 只靠这些钩子选择器，不依赖 DOM 深层结构。

**Web 端**：`<body class="snui-skin-doodle">` 全局生效。  
**uni 端**：通过 ConfigProvider 组件向下传递 `skin` prop，组件根元素加 class，无需 `:root` 注入。

### C. 只做 iOS / 暗色（稳妥但功能残缺）

这两个靠纯 Token 能实现，其他风格全砍。用户诉求明确包含涂鸦和抖音，直接排除。

## Decision

选 **B**：风格包 = Token + 皮肤 CSS + 资源三层。

具体执行：

**第一步（地基，M1 前必须完成）**：

1. 修复 Token 命名对齐问题：统一组件消费的变量名与 `@snui/tokens` 实际输出一致
2. 重建 ComponentPreview.vue：移除 schema renderer，直接 `import` 和 mount Vue 组件
3. 补全 ConfigProvider：提供 `skin` prop（web 端加 body class，uni 端向下传递）

**第二步（M2，Style Pack 系统）**：

1. 新建 `@snui/style-packs`，定义 `StylePackDefinition`（含 Token 覆盖 + 皮肤 CSS 路径 + 描述）
2. 按方案 B 实现 default / ios / dark（Token 层即可）
3. 实现 doodle / sticky-note（需要皮肤 CSS 层）
4. 实现 taobao / douyin（需要皮肤 CSS + 资源层）

**第三步（M2，AI Layer）**：

1. `snail-ui.skill.md` — AI 行为契约
2. MCP Server — 4 个工具
3. `ai-meta.json` 生成器

## Reason

- Token 三层级联已有成熟实现，皮肤 CSS 是自然延伸，不破坏架构
- 组件侧只需要在根元素加 `class`，改动最小
- uni 端通过 ConfigProvider prop 传递，不依赖 WXSS 不支持的全局选择器
- 皮肤 CSS 有明确边界约束（不修改 DOM / Props / 行为），Review Checklist 可验证

## Trade-offs

- 每个风格包除 Token 覆盖外还需维护皮肤 CSS，不同浏览器渲染差异需要测试
- 皮肤 CSS 的字体资源需要 CDN 托管或 base64 内嵌，影响包体积
- uni 端皮肤受 WXSS 能力限制，效果不如 Web 端丰富，需要显式降级策略
- `data-skin` 或 BEM 修饰符需要在每个组件 SFC 中添加

## Consequences

### 地基任务（M1 前）

| ID | 任务 |
|---|---|
| AUI-FOUND-001 | Token 命名对齐：统一 `--sn-*` 变量名与 `@snui/tokens` 输出 |
| AUI-FOUND-002 | 重建 ComponentPreview.vue（移除 schema renderer） |
| AUI-FOUND-003 | ConfigProvider 双端 `skin` prop |
| AUI-FOUND-004 | 组件根元素暴露 `data-skin` 皮肤钩子 |

### M2 任务

| ID | 任务 |
|---|---|
| AUI-PACK-001 | StylePackDefinition 类型 + 包骨架 |
| AUI-PACK-002 | default Pack（Token 层） |
| AUI-PACK-003 | dark Pack（Token 层） |
| AUI-PACK-004 | ios Pack（Token 层） |
| AUI-PACK-005 | doodle Pack（Token + 皮肤 CSS） |
| AUI-PACK-006 | sticky-note Pack（Token + 皮肤 CSS） |
| AUI-PACK-007 | taobao Pack（Token + 皮肤 CSS） |
| AUI-PACK-008 | douyin Pack（Token + 皮肤 CSS + 资源） |
| AUI-AI-001 | Skill 文件 |
| AUI-AI-002 | MCP Server |
| AUI-AI-003 | ai-meta.json 生成器 |

### 不变

- ADR-0001 Component First 底座不变
- Token 三层级联（Primitive / Semantic / Component）结构不变
- AGENTS.md §93 Stop-the-Line 规则不变
- 皮肤 CSS 只改视觉，不改 Props / 行为 / DOM 结构

### 文档同步

- PRD v2.0 → Superseded by PRD v3.0
- Master Plan v4.0 → Superseded by Master Plan v5.0
- WBS v2.0 → Superseded by WBS v3.0
