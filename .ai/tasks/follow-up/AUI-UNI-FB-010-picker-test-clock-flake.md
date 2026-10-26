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

## 追记（ADR-0005，2026-10-26）

MP 兼容改造移除了 `sn-picker-view` / `sn-datetime-picker-view` 模板中的
`v-memo`（MP 编译器不支持，见 ADR-0005）。渲染路径变重后，本 flake 在全量
合并跑下的出现频率上升（同一负载下 2/3 复现；单文件跑稳定通过）。不影响
正确性判定（动量投影逻辑未动），但优先级建议提高——按上面第二/三条方向
做时钟注入是根治路径。

### 追记二：冻结 Date.now 的实测结论（否决捷径）

实测把 `Date.now` 冻结为常量（touchstart/touchend 间隔 = 0）不可行：
`velocityPxPerMs` 的 `dt < MIN_SAMPLE_MS` 守卫虽然让动量归零，但 datetime
用例的提交值变成 NaN、picker-view 用例完全不 emit——引擎/组件内还有第二处
时间使用路径（NaT 值提交、无提交），冻结全局时钟会踩进去。

**正确修法（方案二细化）**：引擎已具备 `options.now` 时钟注入点
（`sn-picker-view-drag.ts:243`），但组件未把它暴露出来。做法：
`SnPickerView` / `SnDatetimePickerView` 增加内部注入通道（provide key 或
仅测试可见的 instance 字段，标注 `@internal`），贯通到
`createRollerDrag({ now })`；测试里注入阶跃时钟（touchstart=T、
touchend=T+8ms，8 < MIN_SAMPLE_MS=16，动量归零且避免 0 间隔路径）。
涉及两个组件 + 两个测试文件，工作量 ≈ 半个任务。

### 追记三：包体卫生对测试的影响（已修）

同卷 AppleDouble 垃圾（`._index.test.ts` 等）会被 vitest 当测试文件解析
（`Unexpected "\x00"`）导致 style-packs 套件必挂；`@snui/tokens` 的静态
CSS 漂移测试按精确字符串比较，prettier 规范化 rgba 空格后误报漂移。
已修：全部 vitest 配置补 `exclude: ['**/._*']`（style-packs / ai 此前缺失）、
漂移测试改去空白比较、仓库 `._` 垃圾一次性清理。

## Regression

修复时先在负载下复现（合并跑 4 文件循环 ≥10 次），再验证 0 失败。
