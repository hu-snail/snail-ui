# AUI-UNI-FB-024 follow-up — 双钮滑动行滑不开：测量静默失败，行永远用 88px 兜底宽度

## 现象

uni 端「滑动操作」cell-group 场景（一行两个胶囊钮：静音 + 删除）真机左滑后
只露出最右侧的「删除」，「静音」几乎被卡片盖住（只漏一条竖缝）；卡片被推得
比预期更靠左，左缘文字被屏幕裁掉。单钮场景（basic / card）看不出异常。

## 根因

行的打开距离 = 实测动作区宽度，测量失败时落 `FALLBACK_ACTION_WIDTH`（88px）。
cell-group 的双钮动作区实际 ~138px（312rpx），88px 只够露出最右一个钮——
单钮场景 88px ≈ 真实宽度，把问题藏住了。测量在所有端都静默失败：

1. **MP**：`measureSide()` 从 `touchstart` 调用，函数内现场
   `getCurrentInstance()`——事件处理器里它返回 `null`，于是 `.in($scope)` 的
   scoped 变体全被跳过，只剩页面级查询；经典 mp 的页面级查询**看不到自定义
   组件内部**（标准行为），查询永远落空。
2. **H5 / docs 预览**：DOM 兜底路径读的是模板 ref——H5 上它是 uni-view
   **组件实例**，没有 `getBoundingClientRect`（元素在 `$el` 上），条件不成立
   直接跳过；而 H5 的 `uni` 全局没有 `createSelectorQuery`，查询路径也走不通。

结果：所有端都活在 88px 兜底上。

## 修复

- 组件实例在 setup 一次捕获（`const componentInstance = getCurrentInstance()`），
  `measureSide` 用捕获值——scoped 变体恢复，经典 mp 的 `.in($scope)` 命中
  （模拟器实测：`createSelectorQuery().in(行 scope)` 查到动作区 138px）；
  uni-app x mp 保留页面级查询变体（其运行时拒绝 scoped 查询）。
- DOM 兜底解包 `$el`：H5 的测量变为**同步**正确，手势起步不再用陈旧距离。
- `onMounted` 一次性测量两侧：`v-model` 驱动的展开（初始 `modelValue`、宿主
  直接置状态）没有手势，此前同样落 88px；挂载测量补齐这条路径（一次性查询，
  无观察器，§41）。

## 验证

- H5（390 视口）：cell-group 首行滑开后 content `translateX(-139.344px)`
  （= 实测动作区宽度，非 88），「静音」「删除」两钮完整露出。
- mp-weixin（开发者工具模拟器）：`wx.createSelectorQuery().in(行实例)`
  查 `.sn-swipe-action__actions--right` → 138px（行宽 364px）；修复前该
  scoped 变体根本不会被发起。
- `@snui/uni`：swipe-action 单测 52/52、typecheck、lint、build 通过；
  `@snui/uni-x` build + `@snui/uni-demo-x gen/check` 通过。

## 通用教训

**事件处理器里 `getCurrentInstance()` 是 `null`**——凡是 setup 阶段拿实例、
回调里使用的模式，必须在 setup 捕获存成闭包常量。同类陷阱：`ref` 拿到的
H5 组件实例不是元素（元素在 `$el`），做 DOM 兜底前先解包。

## 反模式

- 在手势 / 事件回调里现场调 `getCurrentInstance()` 再做 scoped 查询；
- 测量失败静默落兜底常量，且兜底值恰好接近单钮宽度——错误被最常用的场景
  掩盖，只在多钮场景暴露。
