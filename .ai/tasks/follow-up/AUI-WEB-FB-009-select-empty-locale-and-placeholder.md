# AUI-WEB-FB-009 — SnSelect 空态英文 + filterable 占位重复

- 状态：FIXED
- 组件：`packages/vue-web/src/select/SnSelect.vue`（Web 端）
- 类型：视觉 / i18n 缺陷，无 API 破坏（`emptyText` 默认值改为跟随 locale）

## 现场

1. 中文站点上，`filterable` 下拉无匹配项时显示英文 **「No options」**。
2. `filterable` 且未选中时，占位文案**并排出现两次**（截图里「请选择城市 | 请选择城市」）。

## 两个独立根因

1. **空态文案硬编码**：`emptyText` 的 `withDefaults` 默认值是字面量 `'No options'`，
   而 `SnSelect` 从未接入 `useLocale()`。同库其它组件（SnTree / SnDataTable）走的是
   `locale.Empty.description`，所以只有 Select 在中文站点漏翻。

2. **占位渲染两处**：模板同时渲染了
   - `.sn-select__single-value > .sn-select__placeholder`（加 `.sn-select__placeholder` 的多选 span），
   - 以及 `.sn-select__filter-input` 的原生 `placeholder` 属性；
     `filterable` 时两者都在 DOM 里 → 视觉上是两段相同文字。非 filterable 只有一个占位，
     所以问题只在 `filterable` 形态复现。

## 修法

| 根因 | 修法                                                                                                                                                                                                                                          |
| ---- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1    | 新增 `Select` locale 命名空间（`zh-cn`「暂无数据」/ `en-us`「No options」）并在 `use-locale` 合并；`emptyText` 默认值改为 `undefined`，模板用 `resolvedEmptyText = props.emptyText ?? locale.value.Select.noOptions` 求值，显式 prop 仍然优先 |
| 2    | 占位只在「非 filterable」时渲染 label span；`filterable` 时由内部 input 的原生 placeholder 独自承担（同时避免了两份文字叠在同一行）                                                                                                           |

回归测试（`SnSelect.test.ts`）：

- `renders the placeholder once in filterable mode (input owns it)`
- `renders the placeholder once in filterable multiple mode`
- `localizes the empty state through <SnConfigProvider locale>`
- `keeps the explicit emptyText prop above the locale`

## 教训

- 组件的**空态 / 加载态文案**属于 i18n 范畴：默认值写死英文，中文站点必然漏翻；
  默认值应取自 `useLocale()`，prop 只做覆盖（同 SnTree / SnDataTable 的既有约定）。
- 「同一个文案出现两次」优先怀疑 **slot / placeholder 双来源**，而不是 CSS：
  `input::placeholder` 与相邻 span 在同一 flex 行会并排显示，DevTools 里选中节点即可分辨。
