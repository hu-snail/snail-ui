<script setup lang="ts">
/**
 * ThemeEditor — 主题编辑器页面本体（`/theme/editor`）。
 *
 * ## 布局（对照 veanui 主题编辑器）
 *
 *   ┌───────────────────────────────────────────────┐
 *   │ 标题 + 说明                   复制 CSS        │
 *   ├───────────────┬───────────────────────────────┤
 *   │ 配置栏（粘性） │ 预览舞台（Web 组件 / 手机）    │
 *   └───────────────┴───────────────────────────────┘
 *
 * ## 端区分
 *
 * 两端**共用同一份配置**，但预览与变量名不同：
 *
 *   - Web：渲染 `@snui/vue-web` 真实组件，变量为 `--sn-web-*`（px / rem）
 *   - uni：渲染手机模拟器（390 × 844 真机比例，`transform: scale()` 适配高度），
 *          变量为 `--sn-mp-*`（rpx → px）
 *
 * ## 全站生效
 *
 * `state.ts` 在每次配置改动后重建 `buildSiteCss()` 并注入 `<head>`，因此
 * **整个文档站**（页面背景、正文、分隔线、品牌色，以及所有页面上的组件）都
 * 跟着变 —— 不只是右侧预览。页面挂载时还会先**采样站点当前主题**作为初始
 * 配置（见 `readSiteTheme()`），所以第一次进来看到的就是站点本来的样子。
 */

import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { useData, useRoute } from 'vitepress';
import { Copy, Check, Sparkles } from 'lucide-vue-next';
import ThemeConfigPanel from './ThemeConfigPanel.vue';
import type { ThemeEnd } from './ThemeConfigPanel.vue';
import ThemeWebPreview from './ThemeWebPreview.vue';
import ThemeUniPhonePreview from './ThemeUniPhonePreview.vue';
import ThemeUsageModal from './ThemeUsageModal.vue';
import {
  isDirty,
  patchConfig,
  resetConfig,
  themeConfig,
  initThemeEditor,
  buildSnippet,
} from '../../utils/theme-editor/state';
import {
  buildMpVars,
  buildWebVars,
  deriveSemanticColors,
  type ThemeEditorConfig,
} from '../../utils/theme-editor/vars';

const route = useRoute();
const { isDark } = useData();

/** 英文站（`/en/**`）用英文文案。 */
const english = computed(() => route.path === '/en' || route.path.startsWith('/en/'));

const t = (zh: string, en: string): string => (english.value ? en : zh);

/** 预览端。默认 Web。 */
const end = ref<ThemeEnd>('web');

const config = themeConfig;

/**
 * `auto` 模式解析成实际明暗：跟随文档站外观（VitePress 的 isDark）。
 * 单向依赖站点外观、不反向影响站点 —— 编辑器只改「预览里的主题」。
 */
const resolvedMode = computed<'light' | 'dark'>(() => {
  if (config.value.mode === 'auto') return isDark.value ? 'dark' : 'light';
  return config.value.mode;
});

/** 语义色表（两端共用）。 */
const colors = computed(() => deriveSemanticColors(config.value, resolvedMode.value));

/** 两端变量映射。 */
const webVars = computed(() => buildWebVars(config.value, colors.value, resolvedMode.value));
const mpVars = computed(() => buildMpVars(config.value, colors.value, resolvedMode.value));

/** 复制状态。 */
const copied = ref<'idle' | 'done' | 'failed'>('idle');
let copyTimer: ReturnType<typeof setTimeout> | undefined;

/** 接入文档弹窗。 */
const showUsage = ref(false);
/** 已复制的片段（弹窗内展示 + 可再次复制）。 */
const lastSnippet = ref('');

/**
 * 一键复制配置 → 弹出接入文档。
 *
 * 复制的正文是 `@snui/tokens` 公开 API 的调用代码（三个定义对象 +
 * `snCssVars()` 注入），用户粘进自己项目即完成接入 —— 与编辑器预览
 * 走的是同一条解析管线。
 */
async function copyConfig(): Promise<void> {
  const snippet = buildSnippet();
  lastSnippet.value = snippet;
  try {
    if (!navigator.clipboard?.writeText) throw new Error('clipboard unavailable');
    await navigator.clipboard.writeText(snippet);
    copied.value = 'done';
  } catch {
    // 非安全上下文（http 预览 / iframe）回退到选区复制，仍在点击手势内
    const scratch = document.createElement('textarea');
    scratch.value = snippet;
    scratch.setAttribute('readonly', '');
    scratch.style.position = 'fixed';
    scratch.style.opacity = '0';
    document.body.appendChild(scratch);
    scratch.select();
    copied.value = document.execCommand('copy') ? 'done' : 'failed';
    document.body.removeChild(scratch);
  }
  if (copyTimer) clearTimeout(copyTimer);
  copyTimer = setTimeout(() => {
    copied.value = 'idle';
  }, 2400);
  // 复制成功后弹出接入文档（需求：复制之后弹出配置文档说明）
  if (copied.value === 'done') showUsage.value = true;
}

function onConfigUpdate(patch: Partial<ThemeEditorConfig>): void {
  patchConfig(patch);
}

function onReset(): void {
  resetConfig();
}

/**
 * 初始化：采样站点主题 → 恢复存档 → 注入全站 CSS。
 *
 * 放在 `onMounted` 而不是 setup 顶层，因为采样依赖 `getComputedStyle`
 * （SSR 没有 DOM），且必须在站点样式表生效之后。
 */
onMounted(() => {
  initThemeEditor(resolvedMode.value);
});

onBeforeUnmount(() => {
  if (copyTimer) clearTimeout(copyTimer);
});

/**
 * 明暗切换（含站点主题开关）后重新注入 —— 深色块的基准色要跟着更新。
 */
watch(
  resolvedMode,
  (mode) => {
    // 复用 state 的注入逻辑：改一次配置即可触发 watch（这里直接重设 mode）
    patchConfig({ mode: config.value.mode });
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-sn-theme-editor-mode', mode);
    }
  },
  { immediate: true },
);
</script>

<template>
  <div class="sn-theme-editor" :class="{ 'is-en': english }">
    <!-- 页头：标题 + 说明 + 复制 CSS -->
    <header class="sn-theme-editor__head">
      <div class="sn-theme-editor__intro">
        <h1 class="sn-theme-editor__title">{{ t('主题编辑器', 'Theme editor') }}</h1>
        <p class="sn-theme-editor__desc">
          {{
            t(
              '左侧调整主题配置，右侧组件实时跟随，整站同步生效。颜色、圆角、尺寸、间距、字体、表面与逐 token 覆盖都会即时作用于当前预览；Web 与 uni-app x 两端共用一份配置，变量分别输出 --sn-web-* / --sn-mp-*。',
              'Tune the theme on the left and the whole site follows — not just the preview. Colour, radius, size, spacing, typography, surface and per-token overrides apply immediately; Web and uni-app x share one config and emit --sn-web-* / --sn-mp-* respectively.',
            )
          }}
        </p>
      </div>
      <div class="sn-theme-editor__head-actions">
        <span class="sn-theme-editor__badge">
          <Sparkles :size="12" />
          {{ t('全站生效', 'Applies site-wide') }}
        </span>
        <button
          type="button"
          class="sn-theme-editor__copy"
          :class="{ 'is-done': copied === 'done', 'is-failed': copied === 'failed' }"
          @click="copyConfig"
        >
          <Check v-if="copied === 'done'" :size="13" />
          <Copy v-else :size="13" />
          {{
            copied === 'done'
              ? t('已复制 · 查看接入说明', 'Copied · view guide')
              : copied === 'failed'
                ? t('复制失败', 'Copy failed')
                : t('复制配置', 'Copy config')
          }}
        </button>
      </div>
    </header>

    <div class="sn-theme-editor__layout">
      <!-- 配置栏 -->
      <div class="sn-theme-editor__panel">
        <ThemeConfigPanel
          :config="config"
          :end="end"
          :dirty="isDirty"
          :english="english"
          @update:config="onConfigUpdate"
          @update:end="end = $event"
          @reset="onReset"
        />
        <p class="sn-theme-editor__footnote">
          {{
            t(
              '配置会写入本地存档并即时注入全站样式；「重置」回到进入本页时采样的站点主题。',
              'Your config is saved locally and injected site-wide immediately; “Reset” returns to the theme sampled when you entered this page.',
            )
          }}
        </p>
      </div>

      <!-- 预览舞台 -->
      <div class="sn-theme-editor__stage" :class="{ 'is-phone': end === 'uni' }">
        <div class="sn-theme-editor__stage-head">
          <span class="sn-theme-editor__stage-end">
            {{
              end === 'web'
                ? t('Web 端预览', 'Web preview')
                : t('uni-app x 手机模拟', 'uni-app x simulator')
            }}
          </span>
          <span class="sn-theme-editor__stage-note">
            {{
              end === 'web'
                ? t(
                    '真实 @snui/vue-web 组件 · --sn-web-*',
                    'real @snui/vue-web components · --sn-web-*',
                  )
                : t(
                    '390 × 844 真机比例 · 内部滚动 · --sn-mp-*',
                    '390 × 844 device ratio · scrolls inside · --sn-mp-*',
                  )
            }}
          </span>
        </div>

        <!-- Web 预览 -->
        <div v-if="end === 'web'" class="sn-theme-editor__web">
          <ClientOnly>
            <ThemeWebPreview :config="config" :colors="colors" :vars="webVars" :english="english" />
            <template #fallback>
              <div class="sn-theme-editor__loading">
                {{ t('正在加载预览…', 'Loading preview…') }}
              </div>
            </template>
          </ClientOnly>
        </div>

        <!-- uni 手机模拟 -->
        <div v-else class="sn-theme-editor__phone">
          <ClientOnly>
            <ThemeUniPhonePreview
              :config="config"
              :colors="colors"
              :vars="mpVars"
              :english="english"
            />
            <template #fallback>
              <div class="sn-theme-editor__loading">
                {{ t('正在加载预览…', 'Loading preview…') }}
              </div>
            </template>
          </ClientOnly>
        </div>
      </div>
    </div>

    <!-- 复制后的接入文档弹窗 -->
    <ThemeUsageModal
      :open="showUsage"
      :snippet="lastSnippet"
      :english="english"
      @close="showUsage = false"
    />
  </div>
</template>

<style scoped>
.sn-theme-editor {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin: 8px 0 32px;
}

/* ── 页头 ── */
.sn-theme-editor__head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
}
.sn-theme-editor__intro {
  min-width: 0;
  max-width: 760px;
}
.sn-theme-editor__title {
  margin: 0;
  font-size: 22px;
  font-weight: 700;
  color: var(--vp-c-text-1);
  letter-spacing: -0.01em;
}
.sn-theme-editor__desc {
  margin: 6px 0 0;
  font-size: 13.5px;
  line-height: 1.65;
  color: var(--vp-c-text-2);
}
.sn-theme-editor__head-actions {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}
.sn-theme-editor__badge {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  height: 26px;
  padding: 0 10px;
  border-radius: 999px;
  background: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-1);
  font-size: 11.5px;
  font-weight: 600;
}
.sn-theme-editor__copy {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  height: 32px;
  padding: 0 12px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  font-size: 12.5px;
  font-weight: 500;
  cursor: pointer;
  transition:
    background 0.15s,
    border-color 0.15s,
    color 0.15s;
}
.sn-theme-editor__copy:hover {
  border-color: var(--vp-c-text-3);
}
.sn-theme-editor__copy.is-done {
  border-color: #22c55e;
  color: #16a34a;
}
.sn-theme-editor__copy.is-failed {
  border-color: #ef4444;
  color: #ef4444;
}

/* ── 双栏布局 ── */
.sn-theme-editor__layout {
  display: grid;
  grid-template-columns: 320px minmax(0, 1fr);
  gap: 20px;
  align-items: start;
}

.sn-theme-editor__panel {
  display: flex;
  flex-direction: column;
  gap: 10px;
  position: sticky;
  /* 与站点固定导航栏拉开距离，否则配置栏顶部会被导航遮住 */
  top: 84px;
  max-height: calc(100vh - 104px);
  overflow-y: auto;
  padding-right: 2px;
  scrollbar-width: thin;
}
.sn-theme-editor__footnote {
  margin: 0;
  font-size: 11.5px;
  line-height: 1.6;
  color: var(--vp-c-text-3);
  padding: 0 4px;
}

/* ── 舞台 ── */
.sn-theme-editor__stage {
  display: flex;
  flex-direction: column;
  gap: 12px;
  min-width: 0;
  padding: 14px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  background: var(--vp-c-bg-soft);
}
.sn-theme-editor__stage-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
}
.sn-theme-editor__stage-end {
  font-size: 13px;
  font-weight: 600;
  color: var(--vp-c-text-1);
}
.sn-theme-editor__stage-note {
  font-size: 11.5px;
  color: var(--vp-c-text-3);
  font-family: var(--vp-font-family-mono, monospace);
}

.sn-theme-editor__web {
  min-width: 0;
}

/* 手机模拟：居中；高度由设备自身的缩放舞台撑开（内容在屏幕内滚动） */
.sn-theme-editor__phone {
  display: flex;
  justify-content: center;
  overflow: hidden;
}

.sn-theme-editor__loading {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 240px;
  color: var(--vp-c-text-3);
  font-size: 13px;
}

@media (max-width: 1200px) {
  .sn-theme-editor__layout {
    grid-template-columns: 290px minmax(0, 1fr);
  }
}

@media (max-width: 1100px) {
  .sn-theme-editor__layout {
    grid-template-columns: minmax(0, 1fr);
  }
  .sn-theme-editor__panel {
    position: static;
    max-height: none;
    overflow: visible;
  }
}

@media (max-width: 720px) {
  .sn-theme-editor__title {
    font-size: 19px;
  }
  .sn-theme-editor__stage {
    padding: 10px;
  }
}
</style>
