# uni MP 同名插槽单出口分发 — 根因记录（AUI-POP-MP-002）

**日期**：2026-11-28　**组件**：`sn-popover`（模式适用于所有 uni / uni-x 组件）

## 现象

微信小程序端 `#content` 插槽气泡完全不可见（只有箭头露出）；H5 正常。

## 根因

1. 组件模板存在**两个同名** `<slot name="content">` 出口（隐藏测量副本 + 显示体）。
2. uni-app / uni-app x 生成的组件 json **不带 `multipleSlots: true`**（编译产物
   `sn-popover.json` 仅含 `component` + `usingComponents`，js 的 `Component()`
   options 亦无声明）。
3. 微信默认单插槽：页面分发内容只进入 wxml 中**第一个**同名声槽节点 → 内容
   落进 `visibility: hidden` 的隐藏副本，显示体渲染为空容器（高度≈0）→
   用户只见箭头。

## 修复（sn-popover）

- 隐藏副本**移除 slot 出口**，只保留 prop 正文（`normalText !== ''` 门控）。
- 插槽模式测量走**捕获回退链**：隐藏副本量到 0 高 → 判无效 → 回退测量显示体
  （`contentId`）；`resolvePlacement` 增加**有界重试**（3 × 60ms）等小程序
  异步渲染落地（§86）。
- `.sn-popover__pos` 基础 `width: max-content`：显示体在测量前被 trigger 尺寸
  包含块收缩适配**钳制**（实测量到 89px = 触发器宽）并锁死进内联宽度；
  max-content 解除钳制，solve 后内联宽度接管。

## 规约（其他组件）

- uni / uni-x 组件模板**禁止出现两个同名 slot 出口**（MP 必丢一个）。
- 需要"离屏测量插槽内容"时：不要复制出口，改走显示体测量回退 + 有界重试。
- 需要真正的多插槽分发时，必须确认编译产物 json 携带 `multipleSlots: true`
  并有真机验证，不能凭 H5 行为推断。

## 回归测试

`packages/uni/src/components/sn-popover/sn-popover.test.ts`：
- `keeps the slot outlet in the shown body ONLY — the hidden copy must not steal it`
- `re-captures with a bounded retry when the shown body is not laid out yet`
