# sn-navbar · placeholder 与 safeAreaInsetTop 组合高度不匹配

> 现象：`fixed + placeholder + safe-area-inset-top` 同开时，占位元素固定
> `height: 88rpx`，而导航栏本体在 safe-area 下是 `height: auto; min-height:
> 88rpx; padding-top: var(--status-bar-height, 44rpx)`。H5 端
> `--status-bar-height` 为 0 掩盖了问题；MP 真机（自定义导航，状态栏为实际
> 高度）首屏内容顶部会被压进导航栏/状态栏下方约一个状态栏高度。

## 根因

- 占位元素的职责是「镜像导航栏的文档流占位」（wot-ui `wd-navbar` placeholder
  契约），但样式只写了 88rpx 基准盒，没有跟随 safe-area 变体一起长高。
- 组件自身的 `sn-navbar--safe-area` 修饰类改了导航栏盒子，占位元素是独立的
  兄弟节点，不会有任何自动同步——必须由组件显式镜像。

## 修复

- `packages/uni/src/components/sn-navbar/sn-navbar.vue`：占位元素按
  `safeAreaInsetTop` 追加 `sn-navbar__placeholder--safe-area`（`height: auto;
  min-height: 88rpx; padding-top: var(--status-bar-height, 44rpx)`），与
  导航栏本体逐属性对齐。
- 回归测试：`sn-navbar.test.ts` "mirrors the safe-area box on the placeholder
  when safeAreaInsetTop is on"（开启 → 镜像类存在；未开启 → 不存在）。

## 教训

成对的「本体 + 占位」结构（placeholder / 撑高容器）在引入任何影响本体高度的
修饰（safe-area、密度、字号档位）时，占位侧必须同步审查；否则桌面端（变量
为 0 / 默认值）不可见，只在真机暴露。

## 发现场景

uni-demo-x 组件详情页头部切换为 sn-navbar（fixed + placeholder + safe-area +
透明背景）时排查发现——见 ADR 演示工程全局 UI（ADR-0005）后续改造。
