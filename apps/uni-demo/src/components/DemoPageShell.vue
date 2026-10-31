<script setup lang="ts">
/**
 * DemoPageShell —— 演示工程页面壳：中性浅灰画布 +
 * 语言/主题图标按钮（ADR-0005 演示工程全局 UI）。
 *
 * - 背景：纯色浅灰（`--demo-page-bg`，浅色 #f8f8f8 / 深色 #121020），
 *   组件预览的中性画布；装饰色块已移除。
 * - 主题：根节点挂 `demo-shell--dark` 切换 CSS 变量（见 App.vue 全局段）；
 *   同步导航栏颜色（尽力而为）。
 * - 语言：中/英切换，文案与导航栏标题联动；组件中文名/描述暂无英文数据，
 *   英文模式下组件名用 key 的 Title Case（gen-pages 生成 titleEn）。
 * - 切换按钮（风格包 / 语言 / 深浅色）只保留在总览页（`brand`）：
 *   组件演示页是纯净预览，顶栏按钮会挤占 demo 视口并干扰截图对比；
 *   语言与主题状态本身仍是模块级单例，切完回演示页依旧生效。
 *
 * 图标数据内联自 lucide（ISC，与 packages/uni sn-icon-set 同源约定）。
 */
import { computed, onMounted, watch } from 'vue';
import SnIcon from '@snui/uni-src/components/sn-icon/sn-icon.vue';
import type { IconData } from '@snui/uni-src/components/sn-icon/sn-icon.vue';
import { useDemoUi } from '../state/demo-ui';
// wot-ui useQueue 对齐:页面根节点监听冒泡,点任意空白处关闭所有弹窗
// (tooltip / popover / drop-menu / toast / swipe-action / fab)。
import { useQueue } from '@snui/uni-src/utils/outside-close';

const props = withDefaults(
  defineProps<{
    /** 首页品牌区（标题 + 副标题）。 */
    brand?: boolean;
    /** 导航栏标题（中文，组件页传入；空串表示交给 pages.json 原标题）。 */
    titleZh?: string;
    /** 导航栏标题（英文）。 */
    titleEn?: string;
    /**
     * 画布底色覆盖（如输入框页用纯白对比深浅组件底色）。空串 = 默认中性灰；
     * 深色主题下仍按字面值生效（由调用方决定是否覆盖）。
     */
    bg?: string;
  }>(),
  { brand: false, titleZh: '', titleEn: '', bg: '' },
);

const {
  lang,
  isDark,
  stylePack,
  stylePackLabel,
  stylePackVars,
  t,
  toggleLang,
  toggleTheme,
  chooseStylePack,
  applyNavBar,
  setNavTitle,
} = useDemoUi();

const { closeOutside } = useQueue();

// lucide.dev — ISC license（ Redistribution 说明见 sn-icon-set.ts 头注）
const GlobeIcon: IconData = {
  viewBox: '0 0 24 24',
  paths: [
    'M12 2a10 10 0 1 0 0 20 10 10 0 1 0 0-20',
    'M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20',
    'M2 12h20',
  ],
};
const SunIcon: IconData = {
  viewBox: '0 0 24 24',
  paths: [
    'M12 8a4 4 0 1 0 0 8 4 4 0 1 0 0-8',
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
// 风格包按钮（调色板）——此前模板引用但未定义，按钮渲染为空胶囊。
// 色点是 `h.01` + round linecap：sn-icon 只渲染 path，不做 circle 元素。
const PaletteIcon: IconData = {
  viewBox: '0 0 24 24',
  paths: [
    'M12 22a1 1 0 0 1 0-20 10 9 0 0 1 10 9 5 5 0 0 1-5 5h-2.25a1.75 1.75 0 0 0-1.4 2.8l.3.4a1.75 1.75 0 0 1-1.4 2.8z',
    'M13.5 6.5h.01',
    'M17.5 10.5h.01',
    'M8.5 7.5h.01',
    'M6.5 12.5h.01',
  ],
};

/**
 * 画布样式：bg 覆盖只在浅色主题生效（深色维持暗色画布，白色画布在深色下
 * 不可读）；风格包变量始终透传，二者叠加。
 */
const shellStyle = computed(() => {
  if (!props.bg || isDark.value) return stylePackVars;
  return [stylePackVars, { background: props.bg }];
});

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
  <view
    class="demo-shell"
    @tap="closeOutside"
    :class="{ 'demo-shell--dark': isDark, dark: isDark }"
    :style="shellStyle"
  >
    <view class="demo-shell__bar">
      <view v-if="brand" class="demo-shell__brand">
        <text class="demo-shell__brand-title">{{ t('snui 组件演示', 'snui Components') }}</text>
        <text class="demo-shell__brand-sub">
          {{ t('真实 uni 运行时 · H5 / 小程序', 'Real uni runtime · H5 / Mini Program') }}
        </text>
      </view>
      <view v-if="brand" class="demo-shell__actions">
        <view
          class="demo-shell__btn"
          role="button"
          :aria-label="t('切换风格', 'Switch style pack')"
          @tap="chooseStylePack"
        >
          <SnIcon :icon="PaletteIcon" :size="16" />
          <text v-if="stylePack !== 'default'" class="demo-shell__btn-text">
            {{ stylePackLabel }}
          </text>
        </view>
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

/* relative：维持既有的层叠 / absolute 锚定上下文（此前用于压在装饰色块上）。 */
.demo-shell__body {
  position: relative;
}
</style>
