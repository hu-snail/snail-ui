# 0010 — 内置颜色主题：五套预设 + `[data-theme]` 切换

## Decision

`@snui/tokens` 增加五个内置颜色主题（`azure` / `forest` / `ember` / `violet` /
`crimson`），通过 `BUILTIN_THEMES` 注册；`snCssVars()` 默认把每个预设渲染成
`[data-theme="<name>"]` 块，宿主改一个属性即可换主题。

## Context

- Theme / Style / Density 是三轴（PRD §36）。此前 Theme 轴只有 `LIGHT_THEME`
  （空覆盖）与 `DARK_THEME`（暗色），产品侧想要「同一套浅色、换品牌色」时只能
  自己写 CSS 覆盖 `--aui-*`。
- 风格包 `@snui/style-packs` 里 `dark` 同时承担了「暗色主题」与「风格」两个职责，
  与三轴模型冲突。
- 组件 CSS 已全部走 `--sn-*` 别名（`action-primary` / `border-focus` 等），
  换品牌色本来就有落点，缺的只是「一组被命名、被测试的预设」。

## Options

1. **只做主题包（style-packs）**：实现最快，但主题与风格继续混在一起，且
   `snCssVars` 消费方拿不到。
2. **每个主题新增独立 primitive 色阶**：表达力最强，但要为每套色阶安排全量
   对比度审计，且新增组件时容易漏审。
3. **复用现有 primitive 色阶，只换品牌语义槽（选中方案）**：主题 = 语义覆盖，
   中性色不动。

## Decision

选 3。每个预设只覆盖 `text.onPrimary`、`background.accent`、
`border.accent` / `border.focus`、`action.primary` / `primaryHover` /
`primaryActive`，其余沿用 `DEFAULT_SEMANTIC_TOKENS`。

## Reason

- **可审计**：中性色只有一份，对比度只需审一次；品牌色块的 50/400/500/600
  已在 primitive 层定义并被现有组件使用。
- **零组件改动**：组件读的是语义别名，换主题不需要碰任何 SFC。
- **可回退**：`withThemeBlocks: false` 时输出与今天完全一致。

## Trade-offs

- 五个预设共享同一套中性色，视觉差异主要来自品牌色；想要「暗色 + 品牌色」
  的组合需要宿主叠加 `data-theme` 与 `.dark`（暗色块最后输出，故暗色优先）。
- `ember`（琥珀）在实心填充上必须用深色文字，已通过 `text.onPrimary` 处理，
  这是唯一一个偏离「白字」的预设。

## Consequences

- `snCssVars()` 默认输出体积增加（5 个预设 × 2 块）；不需要的宿主可关闭。
- `@snui/style-packs` 的 `dark` 风格包按 Human 指令移除（主题轴已独立），
  暗色能力保留在 `DARK_THEME` / `.dark`。
- 文档站主题编辑器与 MCP 的 `list_style_packs` 需要同步暴露这五个预设。
