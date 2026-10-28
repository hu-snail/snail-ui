<script setup lang="ts">
/**
 * SnHomeCaseCard — 首页「场景案例」的单张案例卡。
 *
 * 视觉：淡色渐变弥散玻璃（glassmorphism）—— 卡片背景是按案例色相派生的
 * 半透明渐变 + backdrop blur，画布的极光从卡面透出形成弥散感；深浅主题
 * 各有一套玻璃配方（浅色 = 亮玻璃 + 白描边，深色 = 深玻璃 + 微光描边）。
 * 卡内的子面板（列表行 / 表单组等）用半透明白磨砂承载亮色 token 的真实
 * 组件，保证两种主题下都可读。
 *
 * 色相由父级通过 `hue` 注入（home-cases.ts 的 caseHue，确定性派生），
 * 经 CSS 变量 `--sn-case-h` 驱动 hsl 渐变。
 *
 * 卡片根节点是 SnWaterfall 的直接子节点（会被包进瀑布流 item box），
 * 因此根上不写任何 margin —— 列间距 / 行距由瀑布流的 gap 负责。
 */
import { computed } from 'vue';

const props = defineProps<{
  /** 案例标题。 */
  title: string;
  /** 案例副标题（一句话场景描述）。 */
  desc?: string;
  /** 内容区高度档位（sm / md / lg）。 */
  size?: 'sm' | 'md' | 'lg';
  /** 玻璃色相（0–359，来自 caseHue）。 */
  hue: number;
}>();

const toneStyle = computed(() => ({ '--sn-case-h': String(props.hue) }));
</script>

<template>
  <article class="sn-case" :class="size ? `sn-case--${size}` : undefined" :style="toneStyle">
    <header class="sn-case__head">
      <h3 class="sn-case__title">{{ title }}</h3>
      <p v-if="desc" class="sn-case__desc">{{ desc }}</p>
    </header>

    <div class="sn-case__body">
      <slot />
    </div>
  </article>
</template>

<style scoped>
/* ── 玻璃卡 ──
 * 淡色渐变 + backdrop blur：弥散玻璃质感。hsl 色相来自 --sn-case-h
 * （父级按案例注入），浅色 / 深色主题各一套配方。 */
.sn-case {
  --sn-case-ink: #101828;
  --sn-case-ink-2: #475467;
  --sn-case-ink-3: #98a2b3;
  --sn-case-panel: rgb(255 255 255 / 0.55);
  --sn-case-panel-strong: rgb(255 255 255 / 0.72);
  --sn-case-panel-ink: #1d2939;
  --sn-case-panel-ink-2: #98a2b3;
  --sn-case-glass-border: rgb(255 255 255 / 0.65);

  position: relative;
  overflow: hidden;
  box-sizing: border-box;
  padding: 14px 16px 16px;
  border: 1px solid var(--sn-case-glass-border);
  border-radius: 16px;
  background: linear-gradient(
    140deg,
    hsl(var(--sn-case-h) 92% 96% / 0.8) 0%,
    hsl(calc(var(--sn-case-h) + 45) 88% 90% / 0.55) 100%
  );
  -webkit-backdrop-filter: blur(22px) saturate(1.5);
  backdrop-filter: blur(22px) saturate(1.5);
  box-shadow: var(--sn-home-card-shadow, 0 10px 30px rgb(2 6 16 / 0.2));
  transition:
    transform 0.2s,
    box-shadow 0.2s;
}
.sn-case:hover {
  transform: translateY(-2px);
  box-shadow: var(--sn-home-card-shadow-hover, 0 18px 44px rgb(2 6 16 / 0.3));
}

/* 深色主题：深玻璃 + 微光描边；子面板转为更实的白磨砂（内嵌组件仍是
 * 亮色 token 渲染，深底上需要白色衬底才可读） */
html.dark .sn-case {
  --sn-case-ink: #f2f5fb;
  --sn-case-ink-2: rgb(226 232 244 / 0.66);
  --sn-case-ink-3: rgb(226 232 244 / 0.45);
  --sn-case-panel: rgb(255 255 255 / 0.82);
  --sn-case-panel-strong: rgb(255 255 255 / 0.92);
  --sn-case-panel-ink: #1d2939;
  --sn-case-panel-ink-2: #667085;
  --sn-case-glass-border: rgb(255 255 255 / 0.14);
  background: linear-gradient(
    140deg,
    hsl(var(--sn-case-h) 62% 24% / 0.6) 0%,
    hsl(calc(var(--sn-case-h) + 45) 58% 16% / 0.55) 100%
  );
  -webkit-backdrop-filter: blur(24px) saturate(1.4);
  backdrop-filter: blur(24px) saturate(1.4);
}

/* ── 头部 ── */
.sn-case__head {
  margin-bottom: 10px;
}
.sn-case__title {
  margin: 0;
  font-size: 15px;
  font-weight: 600;
  line-height: 1.35;
  color: var(--sn-case-ink);
}
.sn-case__desc {
  margin: 2px 0 0;
  font-size: 12.5px;
  line-height: 1.5;
  color: var(--sn-case-ink-3);
}

/* ── 内容区：高度档位让瀑布流出现错落 ── */
.sn-case__body {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 10px;
  box-sizing: border-box;
  min-height: 132px;
}
.sn-case--sm .sn-case__body {
  min-height: 108px;
}
.sn-case--md .sn-case__body {
  min-height: 172px;
}
.sn-case--lg .sn-case__body {
  min-height: 244px;
}

/* Demo 里拉伸到整宽的控件 */
.sn-case__body :deep(.sn-input),
.sn-case__body :deep(.sn-input-number),
.sn-case__body :deep(.sn-select),
.sn-case__body :deep(.sn-slider),
.sn-case__body :deep(.sn-pagination),
.sn-case__body :deep(.sn-progress),
.sn-case__body :deep(.sn-statistic),
.sn-case__body :deep(.sn-date-picker),
.sn-case__body :deep(.sn-data-table),
.sn-case__body :deep(.sn-video-player),
.sn-case__body :deep(.sn-image),
.sn-case__body :deep(.sn-calendar) {
  width: 100%;
}

/* 卡片内按钮的通栏变体（场景里常见的主操作） */
.sn-case__body :deep(.sn-case-block) {
  width: 100%;
}
</style>
