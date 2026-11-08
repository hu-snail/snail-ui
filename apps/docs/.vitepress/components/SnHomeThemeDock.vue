<script setup lang="ts">
/**
 * SnHomeThemeDock — 首页底部居中的悬浮主题色块。
 *
 * 一条中性玻璃胶囊：几枚预设色点 + 一个重置按钮，点一下就把**整站品牌色**换掉。
 * 它不自己写 CSS，而是复用既有主题管线（`utils/theme-editor/state`）：
 *
 *   patchConfig() → watch → buildSiteCss() → 注入 <head>
 *
 * 于是页面 chrome（导航 / 正文 / 分隔线 / VitePress 的 --vp-c-brand-*）与
 * 页面上所有 `@snui/*` 组件同时跟着变，并存进 localStorage —— 换页、刷新
 * 都保持（Layout 每页挂载时会用 `applyStoredSiteTheme()` 接上）。
 *
 * 首次改色前先 `initThemeEditor()` 采样站点当前主题（幂等）：否则整份配置
 * 还是工厂默认值，「只换品牌色」会顺带把站点的圆角 / 中性色 / 尺寸一起换成
 * 默认值。
 */
import { computed, onMounted, watch } from 'vue';
import { useData, useRoute } from 'vitepress';
import { RotateCcw } from 'lucide-vue-next';
import {
  PRESETS,
  applyPreset,
  applyStoredSiteTheme,
  initThemeEditor,
  isThemeInitialized,
  resetConfig,
  themeConfig,
  type ThemePreset,
} from '../utils/theme-editor/state';

const { isDark } = useData();
const route = useRoute();

/** 英文站（`/en/**`）用英文文案。 */
const english = computed(() => route.path === '/en' || route.path.startsWith('/en/'));
const t = (zh: string, en: string): string => (english.value ? en : zh);

/** 站点当前明暗 —— 注入的深色块以它为准。 */
const resolvedMode = computed<'light' | 'dark'>(() => (isDark.value ? 'dark' : 'light'));

/** 当前品牌色（只用于判定哪枚色点处于选中态；胶囊本身不再吃品牌色）。 */
const currentBrand = computed(() => themeConfig.value.brand.toLowerCase());

function isActive(preset: ThemePreset): boolean {
  return currentBrand.value === preset.brand.toLowerCase();
}

/** 选一个预设：先保证已采样，再只改品牌色 / 中性板 / 圆角。 */
function choose(preset: ThemePreset): void {
  if (!isThemeInitialized()) initThemeEditor(resolvedMode.value);
  applyPreset(preset);
}

/** 回到站点默认主题（打开色块时采样到的值）。 */
function reset(): void {
  if (!isThemeInitialized()) initThemeEditor(resolvedMode.value);
  resetConfig();
}

onMounted(() => {
  // 之前选过主题色 → 一进首页就接上（这就是「切换后全局生效」的持久面）。
  applyStoredSiteTheme(resolvedMode.value);
});

/**
 * 明暗切换后重新注入：注入块里深色基准色与当前明暗有关
 * （与主题编辑器页保持同一套处理）。
 */
watch(resolvedMode, (mode) => {
  if (isThemeInitialized()) applyStoredSiteTheme(mode);
});
</script>

<template>
  <Teleport to="body">
    <div class="sn-theme-dock" role="radiogroup" :aria-label="t('主题色', 'Theme colour')">
      <span class="sn-theme-dock__label">{{ t('主题色', 'Theme colour') }}</span>

      <button
        v-for="preset in PRESETS"
        :key="preset.name"
        type="button"
        role="radio"
        class="sn-theme-dock__swatch"
        :class="{ 'is-active': isActive(preset) }"
        :style="{ '--sn-theme-dock-swatch': preset.brand }"
        :aria-checked="isActive(preset)"
        :aria-label="preset.label"
        :title="preset.label"
        @click="choose(preset)"
      />

      <span class="sn-theme-dock__sep" aria-hidden="true" />

      <button
        type="button"
        class="sn-theme-dock__reset"
        :title="t('恢复站点默认', 'Reset to site default')"
        :aria-label="t('恢复站点默认', 'Reset to site default')"
        @click="reset"
      >
        <RotateCcw :size="14" :stroke-width="2.2" />
      </button>
    </div>
  </Teleport>
</template>

<style scoped>
/* ── 玻璃薄纱（灰白渐变）──
 * 不再用品牌色填充：半透明的灰白渐变玻璃 —— 上沿偏白、下沿偏灰，靠
 * backdrop-filter 把底下的页面内容透出来（薄纱感），配一圈发丝描边与
 * 中性柔影。于是它浮在任何主题色、任何深浅页面上都是一个安静的中性控件；
 * 「当前主题色」只由选中色点的那圈描边表达。
 * 深色主题换成「深色玻璃 + 浅墨」，否则白玻璃压在黑页面上会突兀。 */
.sn-theme-dock {
  /* 中性玻璃配方（浅色主题） */
  --sn-theme-dock-ink: #101828;
  --sn-theme-dock-ink-soft: rgb(16 24 40 / 0.55);
  --sn-theme-dock-glass: linear-gradient(
    180deg,
    rgb(255 255 255 / 0.78) 0%,
    rgb(244 246 249 / 0.6) 52%,
    rgb(233 237 242 / 0.5) 100%
  );
  --sn-theme-dock-hairline: rgb(255 255 255 / 0.72);
  --sn-theme-dock-edge: rgb(16 24 40 / 0.08);
  --sn-theme-dock-ring: rgb(255 255 255 / 0.95);
  --sn-theme-dock-control: rgb(16 24 40 / 0.06);
  --sn-theme-dock-control-hover: rgb(16 24 40 / 0.12);
  --sn-theme-dock-shadow: 0 14px 34px rgb(2 6 16 / 0.12), 0 2px 8px rgb(2 6 16 / 0.08);

  position: fixed;
  left: 50%;
  bottom: 26px;
  z-index: 50;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 10px;
  box-sizing: border-box;
  padding: 8px 12px 8px 16px;
  border-radius: 999px;
  border: 1px solid var(--sn-theme-dock-hairline);
  background-image: var(--sn-theme-dock-glass);
  box-shadow:
    var(--sn-theme-dock-shadow),
    inset 0 1px 0 var(--sn-theme-dock-hairline);
  color: var(--sn-theme-dock-ink);
  backdrop-filter: blur(14px) saturate(1.7);
  -webkit-backdrop-filter: blur(14px) saturate(1.7);
}

/* 深色主题：同一套结构，换成深色玻璃 + 浅墨 */
html.dark .sn-theme-dock {
  --sn-theme-dock-ink: #f2f5fb;
  --sn-theme-dock-ink-soft: rgb(226 232 244 / 0.6);
  --sn-theme-dock-glass: linear-gradient(
    180deg,
    rgb(255 255 255 / 0.12) 0%,
    rgb(255 255 255 / 0.07) 52%,
    rgb(255 255 255 / 0.04) 100%
  );
  --sn-theme-dock-hairline: rgb(255 255 255 / 0.16);
  --sn-theme-dock-edge: rgb(255 255 255 / 0.1);
  --sn-theme-dock-ring: rgb(20 24 31 / 0.9);
  --sn-theme-dock-control: rgb(255 255 255 / 0.08);
  --sn-theme-dock-control-hover: rgb(255 255 255 / 0.16);
  --sn-theme-dock-shadow: 0 14px 34px rgb(0 0 0 / 0.42), 0 2px 8px rgb(0 0 0 / 0.3);
}

.sn-theme-dock__label {
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.02em;
  white-space: nowrap;
  color: var(--sn-theme-dock-ink-soft);
}

/* 色点：白环 + 一圈中性描边，任何品牌色在灰白玻璃上都干净可辨 */
.sn-theme-dock__swatch {
  width: 20px;
  height: 20px;
  padding: 0;
  border: 2px solid var(--sn-theme-dock-ring);
  border-radius: 50%;
  background: var(--sn-theme-dock-swatch);
  box-shadow: 0 0 0 1px var(--sn-theme-dock-edge);
  cursor: pointer;
  transition:
    transform 0.15s,
    box-shadow 0.15s;
}
.sn-theme-dock__swatch:hover {
  transform: scale(1.12);
}
.sn-theme-dock__swatch:focus-visible {
  outline: 2px solid var(--sn-theme-dock-ink);
  outline-offset: 2px;
}
.sn-theme-dock__swatch.is-active {
  box-shadow:
    0 0 0 1px var(--sn-theme-dock-edge),
    0 0 0 3px var(--sn-theme-dock-ring),
    0 0 0 4.5px var(--sn-theme-dock-ink);
}

.sn-theme-dock__sep {
  width: 1px;
  height: 18px;
  background: var(--sn-theme-dock-edge);
}

.sn-theme-dock__reset {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 26px;
  height: 26px;
  padding: 0;
  border: 1px solid var(--sn-theme-dock-edge);
  border-radius: 50%;
  background: var(--sn-theme-dock-control);
  color: var(--sn-theme-dock-ink-soft);
  cursor: pointer;
  transition:
    background 0.15s,
    color 0.15s;
}
.sn-theme-dock__reset:hover {
  background: var(--sn-theme-dock-control-hover);
  color: var(--sn-theme-dock-ink);
}
.sn-theme-dock__reset:focus-visible {
  outline: 2px solid var(--sn-theme-dock-ink);
  outline-offset: 2px;
}

/* 窄屏：留给内容的横向空间优先，收掉文字只留色点 */
@media (max-width: 640px) {
  .sn-theme-dock {
    gap: 8px;
    padding: 7px 10px;
  }
  .sn-theme-dock__label,
  .sn-theme-dock__sep {
    display: none;
  }
}
</style>
