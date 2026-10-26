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
  --demo-page-bg: #eef1f8;
  /* 玻璃卡：浅色透明渐变 + 白描边 + 柔影 */
  --demo-card-bg: linear-gradient(135deg, rgba(255, 255, 255, 0.82), rgba(255, 255, 255, 0.46));
  --demo-card-border: rgba(255, 255, 255, 0.72);
  --demo-card-shadow: 0 12rpx 40rpx rgba(31, 41, 82, 0.08);
  --demo-btn-bg: rgba(255, 255, 255, 0.66);
  --demo-btn-border: rgba(255, 255, 255, 0.85);
  --demo-title: #1c2030;
  --demo-text: #565d73;
  --demo-text-3: #8f97ad;
  /* 渐变弥散背景色块（radial 自带柔边，避免 filter blur 的 MP 兼容差） */
  --demo-blob-1: radial-gradient(closest-side, rgba(124, 77, 255, 0.2), transparent);
  --demo-blob-2: radial-gradient(closest-side, rgba(0, 145, 255, 0.16), transparent);
  --demo-blob-3: radial-gradient(closest-side, rgba(255, 122, 89, 0.16), transparent);
  background-color: #eef1f8;
}

/* 深色主题：demo 骨架变量替换（挂在使用方根节点 demo-shell--dark 上）；
 * 组件库 token 由 `@snui/uni/styles` 内置的 `.dark` 块翻转（49 变量，含
 * soft tints / sunken），根节点同时挂 `dark` 类即可作用到所有 demo 组件。
 * 这里只补组件库深色块没有的一处：开关/复选的旋钮在两种主题下都保持浅色
 * （tokens-mp 对该插槽的设计约定——rail 是品牌色实底）。 */
.demo-shell--dark {
  --sn-mp-color-control-knob: #e4e4e7;
  --demo-page-bg: #10131c;
  --demo-card-bg: linear-gradient(135deg, rgba(255, 255, 255, 0.09), rgba(255, 255, 255, 0.04));
  --demo-card-border: rgba(255, 255, 255, 0.1);
  --demo-card-shadow: 0 12rpx 40rpx rgba(0, 0, 0, 0.4);
  --demo-btn-bg: rgba(255, 255, 255, 0.1);
  --demo-btn-border: rgba(255, 255, 255, 0.16);
  --demo-title: #eef1fa;
  --demo-text: #a7aec4;
  --demo-text-3: #6d7488;
  --demo-blob-1: radial-gradient(closest-side, rgba(124, 77, 255, 0.32), transparent);
  --demo-blob-2: radial-gradient(closest-side, rgba(0, 145, 255, 0.26), transparent);
  --demo-blob-3: radial-gradient(closest-side, rgba(255, 122, 89, 0.22), transparent);
}

/* 玻璃卡：透明渐变 + 圆角 + 描边；backdrop-filter 渐进增强（不支持时降级为半透明底）。 */
.demo-glass {
  background: var(--demo-card-bg);
  border: 1px solid var(--demo-card-border);
  border-radius: 24rpx;
  box-shadow: var(--demo-card-shadow);
  backdrop-filter: blur(24rpx);
  -webkit-backdrop-filter: blur(24rpx);
}

@keyframes demo-fade-in {
  from {
    opacity: 0;
    transform: translateY(16rpx);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 呼吸：缓慢的缩放 + 透明度往复（背景色块用）。 */
@keyframes demo-breathe {
  0% {
    transform: scale(1);
    opacity: 0.7;
  }
  50% {
    transform: scale(1.15);
    opacity: 1;
  }
  100% {
    transform: scale(1);
    opacity: 0.7;
  }
}
</style>
