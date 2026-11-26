# AUI-POP-MP-001 — MP 组件宿主 wrapper 裁剪越界弹层（popover / tooltip 气泡不可见）

> **状态：重新打开（2026-11-26）——上一版修复已被后续重写替换**
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
