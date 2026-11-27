# AUI-POP-MP-001 — MP 组件宿主 wrapper 裁剪越界弹层（popover / tooltip 气泡不可见）

> **状态：sn-popover 已修复（2026-11-27）；sn-tooltip 同构问题仍未处理**
>
> ### 2026-11-27 修复（sn-popover，wot-ui 对齐重写之后的回归）
>
> 用户在微信小程序模拟器实测（截图）：隐藏副本以一张错位白卡泄漏到屏内并压在触发器上；
> 点击触发器后气泡本体不出现。编译产物取证，三条独立根因：
>
> 1. **隐藏测量副本失去定位基准**：它是 `position: absolute; left: -100vw`。小程序端组件根
>    不是定位元素（宿主 wrapper 只有 `:host{display:flex;flex-direction:column}`），绝对定位
>    往上找到页面级定位祖先，`-100vw` 与视口宽度算出的位置把它送回屏内。
>    → 修法：副本改 `position: fixed; top: 0; left: 0; visibility: hidden`，不再依赖任何祖先。
> 2. **气泡本体被宿主 wrapper 裁剪**：见下方根因链，与上一版相同。
>    → 修法：小程序端气泡走 `position: fixed` + **视口坐标**（`computeViewportPlacement`），
>    打开时重测触发器（视口坐标随页面滚动失效），首选方向放不下时翻转到对侧，最后才钳制。
>    H5 / App 保持组件根内的 `absolute`（根相对坐标，行为不变）。
> 3. **`options: { virtualHost: true }` 在 uni-app x 编译下不生效**：它在产物里只是被
>    `defineComponent` 展开的普通选项（`{ ...{ name, options: { virtualHost } } }`），没有进入
>    微信 `Component()` 的 json —— 本库 `sn-swipe-action` / `sn-step` 声明了它，产物 json 里同样没有。
>    所以参考库 wd-popover 靠它去掉 wrapper 的路径在 uni-app x 上走不通，**不要再试**。
>
> **实现约束（踩过的坑）**：
> - 平台分支不能用 `#ifdef MP` 切两个 `const` —— vitest 只剥离 `MP-WEIXIN` 块，两份声明会同时
>   存在并重复声明。改用运行时能力探测（`createCanvasContextAsync` 存在且无 `getElementById`）。
> - 视口尺寸读不到时必须保持 `null`，不能兜底成 `{0, 0}`：零尺寸视口会被钳制逻辑
>   当成真视口，把每个气泡都钉到屏幕原点。
> - `sn-transition` 的 `customClass` 是 `string`：传数组会被字符串化成 `"a,"`，定位类直接失效。
>
> **验证状态**：
> - 单测 75 全绿（定位模块 31：含视口坐标 / 翻转 / 钳制 / 视口未知；组件 44：含小程序宿主下
>   视口坐标、滚动后重测、翻转后箭头方向、视口未知四条回归）
> - uni 包全量 4194 过，8 败均为 `sn-avatar-group` 存量失败
> - uni-x 产物重建 + 物化，`check` 1503/1503 新鲜
> - **微信开发者工具 / 真机：NOT RUN** —— 需用户在 HBuilderX 重新运行后确认
>
> **遗留**：`sn-tooltip` 是同构问题（同样是组件根内的 absolute 气泡），本次未改，另行立项。
>
> ---
> ### 以下为历史记录（上一版 SVG chrome 修复，已被 wot-ui 对齐重写替换）
>
> 原状态：重新打开（2026-11-26）——上一版修复已被后续重写替换
> 历史修复（uni-app x MP 端 fixed 测量定位层 + SVG 单一轮廓 chrome + 烘焙色）已被
> **wot-ui 对齐重写**移除：`sn-popover` 现在在**所有端**都走组件根内的 `position: absolute`
>（隐藏测量副本 + 12 方向定位表 + CSS border 三角箭头）。这是一次 Human 决策
> （「全部走 absolute」），已知取舍：uni-app x MP 的宿主 wrapper 裁剪问题在本任务
> 的复现路径上会**再次出现**。下方「已证死的修复路径」与根因分析仍然有效，是下一次
> 修复的起点。候选方向：在 uni-x 侧对 sn-popover 做条件编译分支（仅 MP 提升为 fixed），
> 而不是改回共享源码的定位模型。
>
> ---
> ### 以下为上一版修复的记录（已被替换，留作根因与验证路径参考）
>
> 原状态：实现完成（2026-11-26，refactor/uni-popover-svg）；设备侧复验由用户执行
> 修复方式：uni-app x MP 端气泡改走 **fixed 测量定位层**（下方「修复方向」原定方案），
> 并以 **SVG 单一轮廓 chrome + 烘焙色** 配套解决 fixed 节点的调色链失效。
> 实现见 `packages/uni/src/components/sn-popover/sn-popover.vue`（测量管线 +
> `sn-popover-position.ts` / `sn-popover-chrome.ts` / `sn-popover-raster.ts`），
> uni-x 适配见 `packages/uni-x/src/transform/patches.ts`。
> 经典 uni-app MP / H5 端保持 flow-anchored，测量不可用时回落 CSS 几何（不劣化）。
>
> 验证状态：
> - 单测 139 全绿（chrome 几何 / 定位数学 / 光栅化 / 组件行为 / 契约）
> - uni-x transform 89 全绿，uvue 产物含 `<image :src="chromeAppUrl">` 与 helper 模块
> - H5（uni-demo）：亮色 fill=rgb(255,255,255)、暗色 fill=rgb(24,24,27) 均正确烘焙，
>   测量定位与 chrome 轮廓渲染通过
> - classic MP / uni-app x MP / uni-app x App：**NOT RUN**（wechatide 自动化在
>   reLaunch 后取不到页面节点，改由用户真机/模拟器自测）
>
> tooltip 的同构改造仍属遗留项，另行立项。

## 现象（wechatide 模拟器实测，uni-demo-x → MP-Weixin）

- `sn-popover` / `sn-tooltip` 展开后，气泡（`position: absolute`，`bottom: 100%` /
  `top: 100%` 越出组件根盒）在 MP 上完全不渲染；逻辑层 vdom 已是
  `sn-popover--shown`，像素层没有任何气泡。
- H5（生产包，浏览器逐像素实测）同一几何完全正常：间隙 15.5px（28rpx）、
  箭头顶点距触发器下缘 3.6px。

## 根因链（全部实证）

1. `uvue.wxss`（HBuilderX 生成的元素默认层）给 **所有 `view` 强制
   `overflow: hidden`**（uni-app x view 默认裁剪的 MP 形态）。
2. uni-app x vapor MP 为每个组件生成 **宿主 wrapper 盒**（编译产物 json 无
   `virtualHost` 选项；wrapper 携带 `virtual-host-class="<parent-scope>"`），
   wrapper 紧贴组件根 → 越出根盒的气泡被 wrapper 裁掉。
   - 实测：气泡强制 `position: fixed` → 渲染 ✓；`position: absolute` 且
     `top: 0`（root 盒内）→ 渲染 ✓；`top: -20rpx`（越出根盒上缘）→ 消失 ✗。
3. 组件自身根节点的 `overflow: visible` 无法解除 wrapper 的裁剪——wrapper 在
   组件渲染树之外一层。

### 已证死的修复路径（不要再试）

| 路径 | 结果 |
| --- | --- |
| 组件源码写 `:host { overflow: visible }` | HBuilderX 丢弃一切**源码** `:host` 规则，只保留自己从根节点提升合成的 `:host{display:flex;flex-direction:column}`（组件与 demo 两层均实测） |
| demo 样式写 `[virtual-host-class] { overflow: visible }` | gen-x / uni-x 的样式管线按 App 约束丢弃**属性选择器**规则， twin 里根本没有 |
| demo 给 `<SnPopover class="...">` 加类 | uni-app x vapor 把外部类合并到**组件根 view**（inheritAttrs），wrapper 拿不到 |
| uni-x transform 镜像 `:host`（css.ts） | 同第一行，HBuilderX 剥掉，死代码（已回退） |

## 修复方向（follow-up 任务）

**MP 端气泡改走 fixed 定位层**（各 MP 弹层库的通行做法）：

- 触发器 `uni.createSelectorQuery().boundingClientRect()` 测量 + 页面滚动
  偏移换算视口坐标，气泡 `position: fixed` 渲染（fixed 不受任何祖先
  overflow 裁剪——本任务 v2 探针已实证 fixed 可画）。
- 需要处理：滚动/resize 跟随、视口 clamp、`closeOutside` 命中判定改为
  坐标法、App/H5 端保持现有 absolute 锚定（条件编译分端）。
- tooltip 同构（14rpx 间隙链已是静态值，见 849b1859）。

## 关联

- 849b1859 fix(uni-popover): static placement gap（MP var 嵌套失效 → 间隙静态化）
- 1d360d72 fix(uni-x): compact split end tags（uts 解析器不接受闭合标签内换行）
- 071208dd fix(uni-picker-view): #ifndef MP-WEIXIN 块必须在根闭合之前
  （MP 条件剥离连根闭合一起删 → uts "Element is missing end tag" @568:3）

## 复现/验证路径

```bash
# HBuilderX 打开 apps/uni-demo-x 编译到微信开发者工具；或：
wechatide -c ZCode open_project_window --project \
  /Users/mac/Desktop/snail-aui/apps/uni-demo-x/unpackage/dist/dev/mp-weixin
# reLaunch /pages/navigation/popover → tap 对齐方式 demo 触发器 → 截图。
# 注意：HBuilderX 每次重编译后 wechatide 自动化 tap 会失效，需
# close_project_window → open_project_window → simulator_refresh 后重试。
```
