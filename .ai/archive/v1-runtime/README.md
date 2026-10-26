# v1-runtime 归档

AUI v1.x (2026-08 ~ 2026-10) 的 schema-driven 运行时框架代码归档。

## 归档背景

ADR-0001（2026-10-03）推翻 v1.x 的 "Schema First / Runtime First / Renderer" 定位，将项目重定位为「AI-friendly 多端 UI 组件库」（参考 naive-ui web 端 API、wot-ui uni 端 API）。

本次归档包含 4 个 v1.x 包（35 个任务交付的代码）：

| 归档路径 | 原始包 | 内容摘要 |
|---|---|---|
| `protocol/` | `@snui/protocol` | UISchema / UINode / UIBinding / UIAction / UIAccessibility / UICapability + ButtonContract / InputContract / FormContract / CardContract / ComponentContract |
| `schema/` | `@snui/schema` | Validator + Normalizer + Version compat |
| `runtime/` | `@snui/runtime` | AUIRuntime + RuntimeContext + Lifecycle + Error system + PlatformAdapter |
| `ai/` | `@snui/ai` | Context index + Schema generation + JSON Patch + Repair + Inspection |

## 为什么归档而不是直接删

1. **历史可追溯**：v1.x 是用户提出的最初架构方向，代码量大且含完整测试。保留作为设计决策的实物证据。
2. **可复用零件**：少量代码（如 token 级联、Zod schema 模式）有可能在开发工具链（CLI / 文档生成器）中复用。
3. **commit 友好**：用 `git mv` 重命名而非删除，git blame / log 仍能跟踪。

## 如何处理

- ❌ **不再依赖**：v2.0 的 `package.json` 已经移除对归档包的所有 `workspace:*` 引用
- ❌ **不进入 bundle**：没有 import 路径能引用归档代码
- ✅ **保留 git 历史**：`git log --follow .ai/archive/v1-runtime/protocol/...` 仍能查 v1.x 提交
- ✅ **可查阅源码**：作为设计参考保留，工程师想了解"为什么我们不做 schema-driven"，可以读这里的实现作反面教材

## 对应 PRD / ADR

- ADR: `.ai/decisions/0001-framework-pivot.md`
- PRD v2.0: `dev-docs/AUI-PRD-v2.0.md`（supersedes v1.2）

## 复用机会（v2.0）

| v1.x 资产 | v2.0 复用方式 |
|---|---|
| `protocol/src/component-contract.ts` 的 `defineComponentContract<T>` 模式 | CLI 工具 `extractComponentMeta()` 解析 .vue 文件，复用 contract 概念（不依赖 Zod） |
| `tokens/src/theme.ts` 的 Theme / Style / Density 三轴设计 | 保留，作为 v2.0 主题切换系统 |
| `runtime/src/error.ts` 的 AUIError 结构 | 简化为 `SnError` 工具函数，给组件库内部使用 |
| `protocol/src/button-contract.ts` 的 ButtonProps 类型 | **直接读这里**作为 v2.0 SnButton 的 props 设计参考（v1 已经设计过完整 schema，避免重新设计遗漏） |

---

归档日期：2026-10-03
执行：AUI-REV-001..003 任务的一部分
