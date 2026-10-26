# AUI-UNI-FB-009 — uni 端 picker 滚轮在桌面浏览器无法滚动选择

- 状态：FIXED
- 组件：`packages/uni/src/components/sn-picker-view/sn-picker-view-drag.ts`（引擎）、`sn-picker-view.vue` / `sn-datetime-picker-view.vue`（SFC 接线）、`apps/docs/.vitepress/utils/uni-preview-shims.ts`（预览桥）
- 类型：交互缺陷（输入通道缺失 + 预览桥误杀手势），API 无变更，另含一条 additive 能力登记（AGENTS.md §112.3a）

## 现场

用户在文档站手机预览面板（桌面 Chrome，鼠标操作）反馈「uni 端 picker 无法滚动选择」。浏览器实测（文档站 `/components/uni/picker-view`，探针计数）：

| 手势 | 事件流 | 结果 |
|---|---|---|
| 鼠标向上拖 88px（2 行） | `touchstart:1 → touchmove:1 → touchcancel:1` | transform 纹丝不动，选中行不变 |

## 两个独立根因

1. **组件层：滚轮引擎只监听 touch 事件。** `createRollerDrag` 只有 `onTouchStart/Move/End/Cancel`。uni H5 页面在桌面浏览器打开时鼠标不产生 touch 事件 → 拖拽、滚轮全部无效（移动端触摸正常）。这是「需要兼容 H5 浏览器和移动设备」需求的缺口。

2. **预览层：鼠标→触摸桥接的 capture 阶段 `mouseleave` 监听误杀手势。** `bindMouseToTouch` 用 `document.addEventListener('mouseleave', …, true)` 结束「离开窗口」的手势。capture 监听对**所有元素级** `mouseleave` 都触发（`mouseleave` 不冒泡，但 capture 相位照走完整传播路径）——指针一离开起始元素（滚轮一行只有 ~44px）就触发 `touchcancel`，手势立刻终止、滚轮弹回。探针复现：`touchmove:1` 后即 `touchcancel:1`。

## 修法

| 根因 | 修法 |
|---|---|
| 1 | 引擎新增 `bindMouseGestures(root: HTMLElement)`：mousedown 锚定同一拖拽核心（提取 `beginDrag` / `dragTo` / `settleDrag` 共享体），document 级 mousemove/mouseup/mouseleave(窗口)/blur followers 随手势挂载、随结束/卸载解除（§41/§42）；wheel 每 100px 累计一格前进一行（跳过禁用行、两端收边、`preventDefault` 接管页面滚动）。触摸后 500ms 内的合成鼠标事件被时间窗抑制，避免双重驱动。仅浏览器宿主安装（`typeof document` 守卫），小程序零影响 |
| 2 | 预览桥 `onMouseLeave` 只在 `event.target === document \|\| documentElement`（真正离开窗口）时取消；组件根节点新增 `data-snui-mouse-gesture` 标记，桥接对其跳过（自管鼠标输入，避免双重驱动） |

## Regression Test

- 引擎：`sn-picker-view-drag.test.ts` 「mouse + wheel (desktop H5)」16 条（拖拽提交/锚定跟随/原地点击不提交/非左键/文本选择阻止/触摸抑制/跨元素边界不取消/离开窗口取消/dispose/滚轮四条/preventDefault）
- 组件：`sn-picker-view.test.ts` + `sn-datetime-picker-view.test.ts`「desktop H5 mouse + wheel」各 4-5 条（标记、拖拽、点击不提交、滚轮、unmount 清理）
- 预览桥：`uni-preview-shims.test.ts` 3 条（跨元素边界不取消 / 离开窗口取消 / 标记元素不桥接）

## 教训

- **capture 监听非冒泡事件（mouseleave/focus/blur）= 收到全页所有元素的目标事件**，必须按 target 收窄，否则会把「元素级信号」当成「窗口级信号」。
- 触摸手势组件在 H5 宿主要可用，必须同时覆盖 mouse + wheel 输入通道（uni-app H5 runtime 不做这个转换）。
- 手势引擎新增输入通道时，必须复用同一拖拽核心并在两个通道间做互斥（时间窗 + 单一手势状态），否则桥接/合成事件会双重驱动。

## 附带修复

- docs 的 `test` script 原为 `echo noop`，shims 测试从未进 CI——本次接线（`vitest run .vitepress/utils` + 新增 `apps/docs/vitest.config.ts`，排除 macOS `._*` AppleDouble 文件；turbo.json test inputs 补 `.vitepress/**`）。
- 已知既有 flake（非本次引入）：picker 组件测试中 `touchstart → touchend` 两 trigger 之间的真实时钟间隔在负载下偶发 >16ms 触发动量投影（`packages/uni` 合并跑 4 文件时偶见 2 例失败，单文件/重跑均过；HEAD 与改动分支行为一致）。后续可给组件测试注入时钟根治，登记为 AUI-UNI-FB-010。
