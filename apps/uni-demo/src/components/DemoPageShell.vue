<script setup lang="ts">
/**
 * DemoPageShell —— 演示工程页面壳：渐变弥散背景 + 渐显呼吸动画 +
 * 语言/主题图标按钮（ADR-0005 演示工程全局 UI）。
 *
 * - 弥散背景：三个 radial-gradient 色块（radial 自带柔边，不依赖 filter
 *   blur 的小程序兼容性），缓慢呼吸 + 入场渐显。
 * - 主题：根节点挂 `demo-shell--dark` 切换 CSS 变量（见 App.vue 全局段）；
 *   同步导航栏颜色（尽力而为）。
 * - 语言：中/英切换，文案与导航栏标题联动；组件中文名/描述暂无英文数据，
 *   英文模式下组件名用 key 的 Title Case（gen-pages 生成 titleEn）。
 *
 * 图标数据内联自 lucide（ISC，与 packages/uni sn-icon-set 同源约定）。
 */
import { computed, onMounted, watch } from 'vue';
import SnIcon from '@snui/uni-src/components/sn-icon/sn-icon.vue';
import type { IconData } from '@snui/uni-src/components/sn-icon/sn-icon.vue';
import { useDemoUi } from '../state/demo-ui';

const props = withDefaults(
  defineProps<{
    /** 首页品牌区（标题 + 副标题）。 */
    brand?: boolean;
    /** 导航栏标题（中文，组件页传入；空串表示交给 pages.json 原标题）。 */
    titleZh?: string;
    /** 导航栏标题（英文）。 */
    titleEn?: string;
  }>(),
  { brand: false, titleZh: '', titleEn: '' },
);

const { lang, isDark, t, toggleLang, toggleTheme, applyNavBar, setNavTitle } = useDemoUi();

// lucide.dev — ISC license（ Redistribution 说明见 sn-icon-set.ts 头注）
const GlobeIcon: IconData = {
  viewBox: '0 0 24 24',
  paths: [
    '<circle cx="12" cy="12" r="10" />',
    'M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20',
    'M2 12h20',
  ],
};
const SunIcon: IconData = {
  viewBox: '0 0 24 24',
  paths: [
    '<circle cx="12" cy="12" r="4" />',
    'M12 2v2',
    'M12 20v2',
    'm4.93 4.93 1.41 1.41',
    'm17.66 17.66 1.41 1.41',
    'M2 12h2',
    'M20 12h2',
    'm6.34 17.66-1.41 1.41',
    'm19.07 4.93-1.41 1.41',
  ],
};
const MoonIcon: IconData = {
  viewBox: '0 0 24 24',
  paths: ['M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z'],
};

const langLabel = computed(() => t('切换语言', 'Switch language'));
const themeLabel = computed(() =>
  isDark.value ? t('切换到浅色', 'Switch to light') : t('切换到深色', 'Switch to dark'),
);

function syncNavBar(): void {
  applyNavBar();
  if (props.titleZh !== '') {
    setNavTitle(lang.value === 'en' && props.titleEn !== '' ? props.titleEn : props.titleZh);
  }
}

onMounted(() => {
  syncNavBar();
});

watch(
  () => lang.value,
  () => syncNavBar(),
);
</script>

<template>
  <view class="demo-shell" :class="{ 'demo-shell--dark': isDark }">
    <!-- 渐变弥散背景：radial 色块自带柔边，随呼吸动画缓慢起伏 -->
    <view class="demo-shell__blobs" aria-hidden="true">
      <view class="demo-shell__blob demo-shell__blob--1" />
      <view class="demo-shell__blob demo-shell__blob--2" />
      <view class="demo-shell__blob demo-shell__blob--3" />
    </view>

    <view class="demo-shell__bar">
      <view v-if="brand" class="demo-shell__brand">
        <text class="demo-shell__brand-title">{{ t('snui 组件演示', 'snui Components') }}</text>
        <text class="demo-shell__brand-sub">
          {{ t('真实 uni 运行时 · H5 / 小程序', 'Real uni runtime · H5 / Mini Program') }}
        </text>
      </view>
      <view class="demo-shell__actions">
        <view class="demo-shell__btn" role="button" :aria-label="langLabel" @tap="toggleLang">
          <SnIcon :icon="GlobeIcon" :size="16" />
          <text class="demo-shell__btn-text">{{ lang === 'zh' ? 'EN' : '中' }}</text>
        </view>
        <view class="demo-shell__btn" role="button" :aria-label="themeLabel" @tap="toggleTheme">
          <SnIcon :icon="isDark ? SunIcon : MoonIcon" :size="16" />
        </view>
      </view>
    </view>

    <view class="demo-shell__body">
      <slot />
    </view>
  </view>
</template>

<style scoped>
.demo-shell {
  position: relative;
  min-height: 100vh;
  overflow: hidden;
  background-color: var(--demo-page-bg);
  color: var(--demo-title);
}

/* ── 弥散色块 ─────────────────────────────────────────────────────────── */
.demo-shell__blobs {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  pointer-events: none;
}

.demo-shell__blob {
  position: absolute;
  border-radius: 50%;
  /* 入场渐显 + 呼吸往复（相位错开，避免整齐划一） */
  animation:
    demo-fade-in 0.9s ease both,
    demo-breathe 7s ease-in-out 0.9s infinite;
}

.demo-shell__blob--1 {
  width: 560rpx;
  height: 560rpx;
  top: -160rpx;
  left: -160rpx;
  background: var(--demo-blob-1);
}

.demo-shell__blob--2 {
  width: 480rpx;
  height: 480rpx;
  top: 180rpx;
  right: -180rpx;
  background: var(--demo-blob-2);
  animation-delay: 0.9s, 2.4s;
}

.demo-shell__blob--3 {
  width: 420rpx;
  height: 420rpx;
  top: 620rpx;
  left: 80rpx;
  background: var(--demo-blob-3);
  animation-delay: 0.9s, 4.6s;
}

/* ── 顶栏：品牌区 + 切换按钮 ──────────────────────────────────────────── */
.demo-shell__bar {
  position: relative;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 32rpx 32rpx 8rpx;
}

.demo-shell__brand {
  display: flex;
  flex-direction: column;
}

.demo-shell__brand-title {
  font-size: 36rpx;
  font-weight: 700;
  color: var(--demo-title);
}

.demo-shell__brand-sub {
  margin-top: 6rpx;
  font-size: 22rpx;
  color: var(--demo-text-3);
}

.demo-shell__actions {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 16rpx;
}

.demo-shell__btn {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 8rpx;
  height: 64rpx;
  padding: 0 22rpx;
  border-radius: 32rpx;
  background: var(--demo-btn-bg);
  border: 1px solid var(--demo-btn-border);
  backdrop-filter: blur(16rpx);
  -webkit-backdrop-filter: blur(16rpx);
  color: var(--demo-title);
  transition: opacity 0.15s ease;
}

.demo-shell__btn:active {
  opacity: 0.7;
}

.demo-shell__btn-text {
  font-size: 24rpx;
  font-weight: 600;
}

/* 内容位于色块之上 */
.demo-shell__body {
  position: relative;
}
</style>
