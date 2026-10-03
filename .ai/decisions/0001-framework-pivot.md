# 0001 — Framework Pivot: Schema-Runtime → Traditional UI Component Library

## Status
Accepted

## Date
2026-10-03

## Context

snail-aui v1.x 通过 35 个任务交付了一套 "Schema First / Runtime First / Renderer" 三段式框架：
- `@snui/protocol` —— UISchema / UINode / UIBinding / UIAction / ComponentContract 的 Zod 定义
- `@snui/schema` —— Validator + Normalizer + Version
- `@snui/runtime` —— schema 解释器 / 上下文 / 生命周期 / 错误系统
- `@snui/ai` —— AI 生成 schema + JSON Patch 修复
- `@snui/vue-web` —— schema → Vue DOM 的渲染器
- `@snui/uni` —— schema → uni-app 组件的渲染器

PRD v1.2 第 0.1 节明确说明：

> AUI 是一个以 **Schema First** 为核心的现代 UI 框架体系。AUI 的核心目标不是创建一个传统的 Vue UI Component Library，也不是构建一个完整 Low-Code 平台，而是建立一套：
> Schema → Contract → Runtime → Renderer 的 UI 基础设施……

用户实际诉求：交付一个**传统形态的 Vue 多端 UI 组件库**（参考 naive-ui 的 web 端 API、wot-ui 的 uni 端 API），用户写 `<SnButton>` 这种 Vue SFC，而不是 JSON schema。截图证据：用户对当前文档中 "AUI 是一个 AI-native 的多端 UI 框架。它将 UI 当作 schema 而不是代码" 这段描述直接质疑为"框架定位是不是有问题"。

需求与当前定位根本不兼容：用户要的不是"框架无关的 UI 基础设施"，而是可直接 import 的 Vue 组件包。

## Options

### A. 继续 schema-driven，文档加 "传统模式" 包装层

把 schema-driven 作为底层，用户可选"不用 schema、直接 import 组件"。问题：用户根本不需要 schema 这一层，加包装层会让包体翻倍、API 模糊、增加维护成本。

### B. 全部推翻，重写为传统组件库（chosen）

删掉 protocol / runtime / schema / ai 包，把 vue-web / uni 包从 renderer 改写成 component library。Schema 降级为开发阶段内部工具（生成 TS 类型 + 文档），不入 bundle。

### C. 双形态共存，schema 当高级模式

保留 schema-driven 作为高级用法，组件库作为基础用法。问题：双形态会带来两套 API 心智、双倍维护工作量，且 schema-driven 没人用就成死代码。

## Decision

选 **B. 全部推翻，重写为传统组件库**。

具体改造：

1. **定位**：AUI = AI-friendly 多端 UI 组件库
   - 不再是 "Schema First / Runtime First"
   - 改为 "Component First / Token First / DX First"
   - AI-friendly 体现在：每个组件配 `ai-description.md` + 文档生成器自动出 llms.txt（参考 wot-ui）

2. **包结构**：
   - 删除：`@snui/protocol`、`@snui/runtime`、`@snui/ai`
   - 归档：旧代码挪到 `.ai/archive/v1-runtime/` 留底
   - 保留并强化：`@snui/tokens`（CSS 变量 token 给 web + uni 共用）
   - 改写：`@snui/vue-web`、`@snui/uni` 改为组件库形态
   - 新建：`@snui/cli`（unplugin resolver + docs 生成 + llms.txt 生成）

3. **对外 API 风格**：
   - web 端：`SnButton` API 参考 **naive-ui**（TS 推导、组合式 API、n- 前缀换成 Sn-）
   - uni 端：`SnButton` API 参考 **wot-ui**（移动端场景、easycom 自动注册、wd- 前缀换成 Sn-）
   - 前缀统一 `Sn-`，保证品牌一致；API 风格分别向各自生态最佳实践靠拢

4. **按需加载**：提供 `unplugin-vue-components` resolver + ESM tree-shake

5. **文档站**：`apps/docs/` 用 VitePress，**真实组件渲染**（每个组件页 = 一个 `.md` 里写 `<script setup>` 真实渲染组件）

6. **起步节奏**：web + uni **双端同步**，每个组件出两套实现，token + API 设计共享

## Reason

- **用户诉求明确**：截图证明用户希望"传统 UI 组件库"，不是 "schema-driven 运行时"
- **行业最佳实践**：参考 naive-ui (web) + wot-ui (uni) 是两个生态最成熟的组件库形态
- **降低认知负担**：开发者心智统一（`<SnButton>` 一致），不需要学 schema 语言
- **生态复用**：按需加载 / 暗色模式 / 主题 / 国际化这些都已经有成熟方案，组件库直接接
- **AI-friendly 仍然保留**：通过 `ai-description.md` + 自动 llms.txt 生成，让 AI 能理解组件 API

## Trade-offs

- **推翻 35 个任务**：v1.x 已交付的工作全部归零，重新从 0 开始
- **schema 价值损失**：之前投入的 schema 设计（contract / validator / normalizer）只在开发阶段保留极少量能力（props 校验、文档生成）
- **双端维护成本**：web + uni 同步出组件，每组件工作量翻倍
- **API 不一致**：web 端和 uni 端 API 风格分别参考不同框架，跨端迁移需要学习

## Consequences

### 必须执行（Phase 0 架构反转）
- AUI-REV-001 重写 PRD v2.0
- AUI-REV-002 重写 Master Plan v4.0
- AUI-REV-003 重写 WBS v2.0
- AUI-ARC-001 归档旧包到 `.ai/archive/v1-runtime/`
- AUI-ARC-002 重写 `@snui/vue-web` 为组件库
- AUI-ARC-003 重写 `@snui/uni` 为 easycom 组件库
- AUI-ARC-004 强化 `@snui/tokens` 共享 CSS 变量
- AUI-ARC-005 新建 `@snui/cli`（resolver + llms.txt）
- AUI-ARC-006 重写 `apps/docs/` 文档站
- AUI-DEMO-001 第一个组件 `Button` 端到端跑通（web + uni + docs）

### 后续执行（Phase 1 组件批量）
- AUI-CORE-001~020 按 wot-ui 体系补 20+ 核心组件（基础 / 导航 / 录入 / 反馈 / 展示）

### 文档同步
- `dev-docs/AUI-PRD-v1.2.md` 标记为 Superseded by PRD v2.0
- `dev-docs/AUI-Master-Plan-v3.0.md` 标记为 Superseded by Master Plan v4.0
- `dev-docs/AUI-WBS-v1.0.md` 标记为 Superseded by WBS v2.0

### 反转锁定
本次决策为单向门（one-way door）。Phase 1 之后任何 "回滚到 schema-driven" 的提议必须由用户明确提交新 ADR 才能评估。
