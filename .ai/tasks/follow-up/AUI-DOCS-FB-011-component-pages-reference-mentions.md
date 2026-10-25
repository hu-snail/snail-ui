# AUI-DOCS-FB-011 — 组件文档页残留参考库名称（§114 违例清查）

- 状态：OPEN
- 范围：`apps/docs/components/**`（用户可见文档正文）
- 类型：文档合规（AGENTS.md §114）

## 现场

AUI-UNI-FB-009 改动 picker 文档页时的合规扫描（§114.5 grep）发现**既有**违例（非 FB-009 引入）：

- `apps/docs/components/uni/picker.md:3` —「默认（`immediateChange: false`）滚动只改草稿，点确认才写 `v-model`——与 wot-ui 一致」
- `apps/docs/components/uni/datetime-picker.md:18` —「`valueKey` / `labelKey` 为与 wot-ui 对齐的占位参数」
- `apps/docs/components/uni/datetime-picker.md:24` —「`rootPortal` 为 wot-ui 对齐的占位参数」

## 修法方向

1. 按 §114.3 把「与 wot-ui 一致 / 对齐」改写为行为描述（例：「滚动只改草稿，点确认才写回」即已完整，删掉比较从句）。
2. 全量跑 §114.5 的 grep（`apps/docs/ --include=*.md --include=*.vue`，排除 `node_modules`），把所有命中一次清零。
3. 把该 grep 纳入 CI gate（§114.5 要求）。

## 备注

按 §2 任务边界，FB-009 未顺手修这些既有行（保持 commit 原子性）。
