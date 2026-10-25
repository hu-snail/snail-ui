# AUI-UNI-FB-010 — picker 组件测试偶发动量 flake（真实时钟采样窗口）

- 状态：OPEN
- 组件：`packages/uni/src/components/sn-picker-view/sn-picker-view.test.ts` / `sn-datetime-picker-view.test.ts`
- 类型：测试稳定性

## 现场

`packages/uni` 内合并跑多个测试文件（并行 happy-dom 启动负载高）时，偶发 2 例失败：`touchstart` 与 `touchend` 两个 `await trigger(...)` 之间的真实间隔被拉到 >16ms（`MIN_SAMPLE_MS`），动量投影把提交行多推 1 行（banana → cherry）。单文件跑 / 重跑均通过；HEAD 与 AUI-UNI-FB-009 修复分支行为一致（3/3 复跑验证），**非 FB-009 引入**。

## 根因

组件级手势测试没有注入时钟，`createRollerDrag` 内 `now()` 落回 `Date.now()`，事件间隔受测试负载影响。

## 修法方向

- 组件测试中拖拽序列改为同步 `dispatchEvent` 批（FB-009 新增的 mouse 用例已如此，零 flake），或
- 给 `SnPickerView` / `SnDatetimePickerView` 暴露测试用时钟注入（与引擎 `now` option 贯通），或
- 既有 `await column.trigger('touchstart'/'touchend')` 用例在两事件之间显式 `vi.advanceTimersByTime` / 冻结 `Date.now`。

## Regression

修复时先在负载下复现（合并跑 4 文件循环 ≥10 次），再验证 0 失败。
