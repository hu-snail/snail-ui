# AUI-UNI-FB-011 — sn-paging 开发期两处编译/默认值陷阱（已修复）

- 状态：CLOSED（随 sn-paging 首版落地）
- 组件：`packages/uni/src/components/sn-paging/sn-paging.vue`
- 类型：实现根因留档（AGENTS.md §103）

## 根因 1：布尔 prop 缺省 = false，`??` 兜底失效

`loadMoreEnabled?: boolean` 未写默认值时，Vue 运行时对 Boolean prop 的缺省是
`false`（非 undefined），`props.loadMoreEnabled ?? true` 永远拿不到 true →
上拉加载整体静默关闭。`withDefaults` 里显式写 `undefined` 默认值又被
vue-tsc 拒绝。修法：默认值显式 `loadMoreEnabled: true`；原计划的
`loadingMoreEnabled` 废弃别名因「Boolean 无法区分未传/显式 false」直接砍掉
（z-paging 例外参考库下别名非必需）。

Regression：`sn-paging.test.ts` 的 load-more 组（未传 prop 默认开启 +
`loadMoreEnabled=false` 显式关闭两条都有断言）。

## 根因 2：custom element 上的 `#refresher` 具名插槽使 VitePress SSR 崩溃

docs 把 `scroll-view` 注册为 custom element，`<template #refresher>` 在
SSR codegen 崩溃（`genNodeCall: Cannot read properties of undefined`）。
修法：改用 uni 官方写法 `<view slot="refresher">`——SSR 当普通属性输出，
uni 各端编译器原生识别 refresher 槽；浏览器预览中该条常驻列表顶部
（无法下拉手势），属可接受的预览降级。

Regression：docs `pnpm build`（SSR 全量编译）即回归验证；uni-x 侧由
PORTING-REPORT 的 sn-paging 段守着（无新增禁止类 issue）。

## 记忆条目

两条均已写入 User Memory（跨项目通用）：Boolean 缺省 / custom element
具名插槽 SSR 崩溃，见 `/Users/mac/.minimax/memory/user.md`。
