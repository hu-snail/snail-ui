# AUI-UNI-FB-013 — 两个浏览器 API demo 未迁入 uni-demo（img-cropper / switch）

- 状态：OPEN
- 工程：`apps/uni-demo`（ADR-0005）
- 类型：demo 覆盖缺口

## 现场

docs 迁移引导（`fork-demos.mjs` EXCLUDE）跳过了 2 个依赖浏览器 API 的 demo：

- `img-cropper-mp-basic` — `new Image()` 加载图片到 canvas，MP 端 canvas
  API 不同，需按 uni canvas 重写。
- `switch-mp-before-change` — `window.confirm`；且 sn-switch 的
  `before-change` 契约是同步返回 boolean，`uni.showModal` 是异步，无法直接
  等价替换（可考虑组件支持 Promise 语义，或改写 demo 场景）。

影响：docs 对应组件页的这两个场景显示「用法源码整理中」提示 + 无在线预览
条目；uni-demo 不生成对应页面。

## 修法方向

- img-cropper-mp-basic：用 `uni.getImageInfo` + canvas 2d（type=2d）重写，
  裁剪交互部分对照 docs 版 demo 逻辑移植。
- switch-mp-before-change：先决策组件契约（是否支持异步 beforeChange），
  再改写 demo；若契约不变，demo 改用同步确认场景并补一节说明。
- 修完后从 `fork-demos.mjs` EXCLUDE 移除，重跑 `gen:demos` + `gen:pages`。

## Regression

双端构建全过；docs 对应页面恢复用法源码与预览。
