<script setup lang="ts">
/**
 * ChartCard — the compact demo card for the overview page's masonry wall
 * (瀑布流).
 *
 * A card is a *preview*, not a playground: title, one live chart built from
 * the registry's default config (theme-following: no palette override, so the
 * card wears the UI library's primary + fading tints and re-renders when the
 * host re-themes), and a link into the category page's config panel. The whole
 * card is one anchor, so a click lands on `/echarts/<category>#<caseId>` —
 * ChartCase carries the matching `id` for the jump.
 *
 * Masonry itself is page-level CSS (`.sn-chart-masonry` in custom.css):
 * CSS columns + `break-inside: avoid`, so cards keep their natural heights and
 * pack like a waterfall without JS measuring.
 */
import { computed } from 'vue';
import { useData } from 'vitepress';
import { ArrowRight } from 'lucide-vue-next';
import { SnChart } from '@snui/echarts';
import { SnIcon } from '@snui/vue-web';
import {
  buildCaseOption,
  buildCaseTooltip,
  createDefaultConfig,
  getChartCase,
} from '../echarts/registry';

const props = defineProps<{
  /** Case id in the registry (`line-basic`, `bar-stack`, …). */
  id: string;
}>();

const def = getChartCase(props.id);

const { lang } = useData();
const isEn = computed(() => lang.value === 'en-US');
const title = computed(() => (isEn.value ? def.title.en : def.title.zh));
const blurb = computed(() => (isEn.value ? def.blurb.en : def.blurb.zh));
const link = computed(() =>
  isEn.value ? `/en/echarts/${def.category}#${def.id}` : `/echarts/${def.category}#${def.id}`,
);
const hint = computed(() => (isEn.value ? 'Open in playground' : '去配置面板调一调'));

// Static per-card config: the theme-following default. No panel here, so the
// config never changes after mount — plain objects are enough.
const cfg = createDefaultConfig(def);
const labels = isEn.value ? def.labels.en : def.labels.zh;
const option = buildCaseOption(def, cfg, labels);
const tooltip = buildCaseTooltip(cfg);
// Overview cards are previews: cap the height so the wall stays scannable.
const cardHeight = Math.min(def.height, 264);

const fallbackHeight = `${cardHeight}px`;
</script>

<template>
  <a class="sn-chart-card" :href="link">
    <header class="sn-chart-card__head">
      <h3 class="sn-chart-card__title">{{ title }}</h3>
      <SnIcon :icon="ArrowRight" :size="15" class="sn-chart-card__arrow" />
    </header>
    <ClientOnly>
      <SnChart
        :option="option"
        :tooltip="tooltip"
        :height="cardHeight"
        :not-merge="true"
        :aria-label="title"
      />
      <template #fallback>
        <div class="sn-chart-card__loading" :style="{ height: fallbackHeight }" />
      </template>
    </ClientOnly>
    <footer class="sn-chart-card__foot">
      <p class="sn-chart-card__blurb">{{ blurb }}</p>
      <span class="sn-chart-card__hint">{{ hint }}</span>
    </footer>
  </a>
</template>

<style scoped>
.sn-chart-card {
  display: block;
  margin: 0 0 16px;
  padding: 14px 14px 10px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  background: var(--vp-c-bg);
  color: inherit;
  text-decoration: none;
  transition:
    border-color 0.15s,
    box-shadow 0.15s,
    transform 0.15s;
}

.sn-chart-card:hover {
  border-color: var(--vp-c-brand-1);
  box-shadow: var(--vp-shadow-2);
  transform: translateY(-1px);
}

.sn-chart-card__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 8px;
  /* Reference-style title tick: a short brand-coloured bar left of the title.
     Uses the token primary, so the tick re-themes with the UI library too. */
  border-left: 3px solid var(--sn-web-color-action-primary);
  padding-left: 8px;
}

.sn-chart-card__title {
  margin: 0;
  font-size: 13.5px;
  font-weight: 600;
  line-height: 1.4;
}

.sn-chart-card__arrow {
  flex: none;
  color: var(--vp-c-text-3);
  transition:
    transform 0.15s,
    color 0.15s;
}

.sn-chart-card:hover .sn-chart-card__arrow {
  color: var(--vp-c-brand-1);
  transform: translateX(2px);
}

.sn-chart-card__loading {
  border-radius: 8px;
  background: var(--vp-c-bg-soft);
}

.sn-chart-card__foot {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 12px;
  margin-top: 6px;
}

.sn-chart-card__blurb {
  margin: 0;
  font-size: 12px;
  line-height: 1.6;
  color: var(--vp-c-text-3);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.sn-chart-card__hint {
  flex: none;
  font-size: 12px;
  color: var(--vp-c-brand-1);
}
</style>
