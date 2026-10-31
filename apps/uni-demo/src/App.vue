<script setup lang="ts">
import { onHide, onLaunch, onShow } from '@dcloudio/uni-app';
// 组件 token 样式（--sn-mp-* CSS 变量）。dist 产物，需先构建 @snui/uni。
import '@snui/uni/styles';

onLaunch(() => {});
onShow(() => {});
onHide(() => {});
</script>

<style>
/* 全局主题变量与动画（demo-shell / demo-glass 体系，见 DemoPageShell）。 */
page {
  --demo-page-bg: #f8f8f8;
  /* 卡片：近白渐变 + 白描边 + 柔影（首页双列卡与组件页玻璃卡共用） */
  --demo-card-bg: linear-gradient(150deg, rgba(255, 255, 255, 0.95), rgba(255, 255, 255, 0.7));
  --demo-card-border: rgba(255, 255, 255, 0.9);
  --demo-card-shadow: 0 12rpx 32rpx rgba(76, 60, 140, 0.08);
  --demo-btn-bg: rgba(255, 255, 255, 0.66);
  --demo-btn-border: rgba(255, 255, 255, 0.85);
  --demo-search-bg: rgba(255, 255, 255, 0.88);
  --demo-chip-bg: rgba(255, 255, 255, 0.66);
  --demo-chip-border: rgba(255, 255, 255, 0.9);
  --demo-icon-bg: linear-gradient(135deg, #eaf1ff, #dbe7ff);
  --demo-icon-fg: #4c7cf0;
  --demo-title: #1c2030;
  --demo-text: #565d73;
  --demo-text-3: #8f97ad;
  background-color: #f8f8f8;
}

/* 组件 token 锚定（关键修复）：tokens-mp 的 --sn-mp-* 颜色别名在某些环境
 *（系统深色 + uni h5 的 page 样式注入）会在 body 层被深色字面污染，导致
 * 浅色模式下组件面板发黑。在 shell 根节点把全部 --sn-mp-color-* 重新锚定到
 * --aui 链——元素自身的声明优先于继承值，污染被就近覆盖；深色时 .dark 翻转
 * --aui，锚定链自动跟随（与 @snui/uni/styles 内置 .dark 块的值一致）。 */
.demo-shell {
  --sn-mp-color-text-primary: var(--aui-color-text-primary);
  --sn-mp-color-text-secondary: var(--aui-color-text-secondary);
  --sn-mp-color-text-disabled: var(--aui-color-text-disabled);
  --sn-mp-color-text-tertiary: var(--aui-color-text-tertiary);
  --sn-mp-color-text-on-primary: var(--aui-color-text-on-primary);
  --sn-mp-color-background-surface: var(--aui-color-background-surface);
  --sn-mp-color-background-subtle: var(--aui-color-background-subtle);
  --sn-mp-color-background-elevated: var(--aui-color-background-elevated);
  --sn-mp-color-background-overlay: var(--aui-color-background-overlay);
  --sn-mp-color-background-soft: var(--aui-color-background-subtle);
  --sn-mp-color-background-sunken: var(--aui-color-background-sunken);
  --sn-mp-color-background-inverse: var(--aui-color-background-inverse);
  --sn-mp-color-border-default: var(--aui-color-border-default);
  --sn-mp-color-border-subtle: var(--aui-color-border-subtle);
  --sn-mp-color-action-primary: var(--aui-color-action-primary);
  --sn-mp-color-action-primary-hover: var(--aui-color-action-primary-hover);
  --sn-mp-color-action-primary-soft: var(--aui-color-action-primary-soft);
  --sn-mp-color-feedback-success: var(--aui-color-feedback-success);
  --sn-mp-color-feedback-success-soft: var(--aui-color-feedback-success-soft);
  --sn-mp-color-feedback-warning: var(--aui-color-feedback-warning);
  --sn-mp-color-feedback-warning-soft: var(--aui-color-feedback-warning-soft);
  --sn-mp-color-feedback-danger: var(--aui-color-feedback-danger);
  --sn-mp-color-feedback-danger-hover: var(--aui-color-feedback-danger-hover);
  --sn-mp-color-feedback-danger-soft: var(--aui-color-feedback-danger-soft);
  --sn-mp-color-feedback-info: var(--aui-color-feedback-info);
  --sn-mp-color-input-bg: var(--aui-color-background-surface);
  --sn-mp-color-input-text: var(--aui-color-text-primary);
  --sn-mp-color-input-placeholder: var(--aui-color-text-disabled);
  --sn-mp-color-input-border: var(--aui-color-border-default);
  --sn-mp-color-input-border-focus: var(--aui-color-action-primary);
  --sn-mp-color-control-unchecked: var(--aui-color-border-default);
  --sn-mp-color-control-knob: var(--aui-color-background-elevated);
  --sn-mp-color-volcano: var(--aui-color-volcano);
  --sn-mp-color-volcano-soft: var(--aui-color-volcano-soft);
  --sn-mp-color-lightblue: var(--aui-color-lightblue);
  --sn-mp-color-lightblue-soft: var(--aui-color-lightblue-soft);
  --sn-mp-color-cyan: var(--aui-color-cyan);
  --sn-mp-color-cyan-soft: var(--aui-color-cyan-soft);
  --sn-mp-color-pink: var(--aui-color-pink);
  --sn-mp-color-pink-soft: var(--aui-color-pink-soft);
  --sn-mp-color-purple: var(--aui-color-purple);
  --sn-mp-color-purple-soft: var(--aui-color-purple-soft);
}

/* 深色主题：demo 骨架变量替换（挂在使用方根节点 demo-shell--dark 上）；
 * 组件库 token 由 `@snui/uni/styles` 内置的 `.dark` 块翻转（49 变量，含
 * soft tints / sunken），根节点同时挂 `dark` 类即可作用到所有 demo 组件。
 * 这里只补组件库深色块没有的一处：开关/复选的旋钮在两种主题下都保持浅色
 * （tokens-mp 对该插槽的设计约定——rail 是品牌色实底）。 */
.demo-shell--dark {
  --sn-mp-color-control-knob: #e4e4e7;
  --demo-page-bg: #121020;
  --demo-card-bg: linear-gradient(150deg, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.03));
  --demo-card-border: rgba(255, 255, 255, 0.1);
  --demo-card-shadow: 0 12rpx 40rpx rgba(0, 0, 0, 0.4);
  --demo-btn-bg: rgba(255, 255, 255, 0.1);
  --demo-btn-border: rgba(255, 255, 255, 0.16);
  --demo-search-bg: rgba(255, 255, 255, 0.07);
  --demo-chip-bg: rgba(255, 255, 255, 0.08);
  --demo-chip-border: rgba(255, 255, 255, 0.12);
  --demo-icon-bg: rgba(124, 92, 252, 0.22);
  --demo-icon-fg: #a9bcff;
  --demo-title: #eef1fa;
  --demo-text: #a7aec4;
  --demo-text-3: #6d7488;
}

/* 玻璃卡：透明渐变 + 圆角 + 描边。
 * 注意：这里刻意**不用** backdrop-filter——它会为 position: fixed 的后代
 * 创建 containing block，把弹窗类 demo（calendar / popup / dialog …）钉在
 * 卡片坐标系里，配合 overflow 裁切显示不全。玻璃感由透明渐变 + 描边 + 柔影
 * 承担；需要真实毛玻璃的容器（搜索框）单独加 blur。 */
.demo-glass {
  background: var(--demo-card-bg);
  border: 1px solid var(--demo-card-border);
  border-radius: 24rpx;
  box-shadow: var(--demo-card-shadow);
}

@keyframes demo-fade-in {
  from {
    opacity: 0;
    transform: translateY(16rpx);
  }
  to {
    opacity: 1;
    /* none 而非 translateY(0)：动画结束后的 fill 保留值若带 transform，
     * 会把 .home 变成 fixed 弹窗的 containing block。 */
    transform: none;
  }
}
</style>
