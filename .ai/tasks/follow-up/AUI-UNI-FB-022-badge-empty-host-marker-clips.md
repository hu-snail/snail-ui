# AUI-UNI-FB-022 follow-up — sn-badge 空内容时宿主盒塌缩，marker 一半出盒被真机裁掉

## 现象

`cell-mp-basic` demo 的「未读通知」行（`<SnBadge :value="8" :max="99" type="danger" />`
直接塞进 cell 默认插槽，不包裹任何内容）在真机（mp-weixin 截图）上角标只显示
约一半，其余被裁掉 / 遮住。包裹内容的徽标（badge 全部官方 demo、tabbar / sidebar
场景）全部正常。

## 根因

sn-badge 的骑跨几何契约是「marker 一半压内容角、一半留在 root 盒的预留余量里，
**永不出 root 盒**」。余量由 `__host` 子元素的 `margin-top / margin-right`
预留（root 自身必须零 padding，否则 App 端 content-area 锚定与 web 端
padding-box 锚定分叉）。

空内容时这条链断裂：

- `__host` 无内容 → 高宽为 0；
- root（inline-flex）收缩到只剩 margin：16×16rpx；
- 32×32rpx 的 marker 锚 root 外角（top:0 / right:0），一半落在 root 盒外
  （左 + 下）；

「marker 永不出盒」的前提是盒里有内容撑出宿主面积——空内容时盒只剩余量本身，
marker 反而悬空，出盒的一半在真机上被平台裁剪 / 层叠遮挡（正是该契约设计时
要消灭的失败模式，sn-avatar `__body` 拆分的同款结论）。

## 修复

`__host` 加 `min-width / min-height`（计数徽标 16rpx、dot 模式同步减半 8rpx）：
root 恒 ≥ marker 盒，marker 全部落在盒内，空内容徽标全端确定性渲染。
min 只在内容小于阈值时生效，包裹内容的既有几何完全不变。

## 通用教训

**用子元素 margin 预留的"余量"在内容为空时会塌缩**——余量只对"内容 + 余量"
的盒子成立；纯余量盒必须再用 min 尺寸兜底。凡"骑跨 / 突出"几何
（badge、avatar 状态点、角标类）都要回答"不裹内容时盒多大"。

## 反模式

- 只靠 margin 预留突出量，没有 min 尺寸兜底；
- 用 demo 侧"给徽标塞个占位内容"绕过组件几何缺陷（掩盖而非修复）。

## 踩坑补充：修复"看起来没生效"

第一轮修复提交后真机依旧被裁——根因不在修复本身，而在产物链：
demo 应用消费的是 `@snui/uni-x` **build 产物**（transform 后的 .uvue），
改完 `packages/uni` 源码只跑 `uni-demo-x gen` 不会刷新它。组件修复的完整
发布链是：

```text
改 packages/uni 源码
  ↓ pnpm -F @snui/uni-x build      ← 重新 transform 出 dist .uvue
  ↓ pnpm -F @snui/uni-demo-x gen   ← 重新物化 node_modules/@snui/uni-x
  ↓ HBuilderX 重新编译
```

漏掉第二步 = 真机跑旧组件（gen-x 的 hint 有提示，但跑完 gen 容易当成已
完成）。验证产物是否新鲜：直接 grep
`apps/uni-demo-x/node_modules/@snui/uni-x/dist/components/<comp>/<comp>.uvue`
里的目标声明。

## 回归守卫

`packages/uni/src/components/sn-badge/sn-badge.test.ts`
`corner straddle via host headroom (every end)` →
`keeps a contentless badge marker inside the root box via host min sizes`。

## 对应代码

- `packages/uni/src/components/sn-badge/sn-badge.vue`（`.sn-badge__host` min 尺寸）
- `apps/uni-demo-x/pages/basic/demos/cell-mp-basic.uvue`（触发场景）
