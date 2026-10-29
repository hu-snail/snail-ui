<script setup lang="ts">
/**
 * Demo: sn-icon (uni-end) — built-in icon gallery (showcase).
 *
 * Search + category filter + grid cards for the whole built-in catalog;
 * tapping a card copies its name. Data source: sn-icon-catalog.
 */
import { computed, ref } from 'vue';
import SnIcon from '@snui/uni-src/components/sn-icon/sn-icon.vue';
import SnSearch from '@snui/uni-src/components/sn-search/sn-search.vue';
import {
  SN_ICON_CATALOG,
  SN_ICON_CATEGORY_LABELS,
  searchSnIconCatalog,
  type SnIconCategory,
} from '@snui/uni-src/components/sn-icon/sn-icon-catalog';

/** Current search query. */
const query = ref('');
/** Current category ('all' = everything). */
const activeCategory = ref<SnIconCategory | 'all'>('all');

/** Category chips: 'All' + the 7 declared categories. */
const chips: Array<{ key: SnIconCategory | 'all'; zh: string }> = [
  { key: 'all', zh: 'All' },
  ...(Object.keys(SN_ICON_CATEGORY_LABELS) as SnIconCategory[]).map((key) => ({
    key,
    zh: SN_ICON_CATEGORY_LABELS[key].zh,
  })),
];

/** Sections in catalog/category order; empty sections dropped. */
const sections = computed(() => {
  const hits = searchSnIconCatalog(
    query.value,
    activeCategory.value === 'all' ? undefined : activeCategory.value,
  );
  return (Object.keys(SN_ICON_CATEGORY_LABELS) as SnIconCategory[])
    .map((key) => ({
      key,
      zh: SN_ICON_CATEGORY_LABELS[key].zh,
      en: SN_ICON_CATEGORY_LABELS[key].en,
      entries: hits.filter((entry) => entry.category === key),
    }))
    .filter((section) => section.entries.length > 0);
});

/** Hit count (search feedback). */
const total = computed(() => sections.value.reduce((sum, s) => sum + s.entries.length, 0));

/** Total built-in icon count. */
const catalogSize = SN_ICON_CATALOG.length;

function pickCategory(key: SnIconCategory | 'all'): void {
  activeCategory.value = key;
}

/** Copy the icon name on tap. */
function copyName(name: string): void {
  uni.setClipboardData({
    data: name,
    success: () => {
      uni.showToast({ title: `Copied ${name}`, icon: 'none' });
    },
  });
}
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <SnSearch v-model="query" placeholder="Search icons" hide-cancel />

    <scroll-view class="chips" scroll-x :show-scrollbar="false">
      <view class="chips__track">
        <view
          v-for="chip in chips"
          :key="chip.key"
          class="chips__item"
          :class="{ 'chips__item--active': activeCategory === chip.key }"
          @tap="pickCategory(chip.key)"
        >
          {{ chip.zh }}
        </view>
      </view>
    </scroll-view>

    <text class="sn-demo__meta">
      {{ query === '' ? `${catalogSize} built-in icons` : `${total} hits` }}
    </text>

    <view v-for="section in sections" :key="section.key" class="section">
      <view class="section__head">
        <text class="section__title">{{ section.zh }}</text>
        <text class="section__en">{{ section.en }}</text>
      </view>
      <view class="grid">
        <view
          v-for="entry in section.entries"
          :key="entry.name"
          class="cell"
          @tap="copyName(entry.name)"
        >
          <view class="cell__box">
            <SnIcon :icon="entry.name" :size="24" />
          </view>
          <text class="cell__name">{{ entry.name }}</text>
        </view>
      </view>
    </view>

    <view v-if="total === 0" class="empty">
      <text class="empty__text">No icons match "{{ query }}"</text>
    </view>
  </view>
</template>

<style scoped>
.sn-demo--stack {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
  width: 100%;
}

.chips {
  width: 100%;
  white-space: nowrap;
}

.chips__track {
  display: inline-flex;
  flex-direction: row;
  gap: var(--sn-mp-spacing-3);
  padding: var(--sn-mp-spacing-1) 0;
}

.chips__item {
  display: inline-flex;
  align-items: center;
  padding: var(--sn-mp-spacing-3) var(--sn-mp-spacing-5);
  border-radius: var(--sn-mp-radius-full);
  background: var(--sn-mp-color-background-subtle);
  color: var(--sn-mp-color-text-secondary);
  font-size: var(--sn-mp-font-size-sm);
}

.chips__item--active {
  background: var(--sn-mp-color-action-primary-soft);
  color: var(--sn-mp-color-action-primary);
  font-weight: 600;
}

.section {
  display: flex;
  flex-direction: column;
  gap: var(--sn-mp-spacing-4);
}

.section__head {
  display: flex;
  flex-direction: row;
  align-items: baseline;
  gap: var(--sn-mp-spacing-3);
}

.section__title {
  font-size: var(--sn-mp-font-size-md);
  font-weight: 600;
  color: var(--sn-mp-color-text-primary);
}

.section__en {
  font-size: var(--sn-mp-font-size-xs);
  color: var(--sn-mp-color-text-tertiary);
}

.grid {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  margin: calc(var(--sn-mp-spacing-2) * -1);
}

.cell {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 25%;
  padding: var(--sn-mp-spacing-2) 0;
  box-sizing: border-box;
}

.cell__box {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 88rpx;
  height: 88rpx;
  border-radius: var(--sn-mp-radius-md);
  background: var(--sn-mp-color-background-subtle);
  color: var(--sn-mp-color-text-primary);
}

.cell__name {
  margin-top: var(--sn-mp-spacing-3);
  max-width: 160rpx;
  text-align: center;
  font-size: var(--sn-mp-font-size-xs);
  color: var(--sn-mp-color-text-secondary);
  word-break: break-all;
}

.empty {
  display: flex;
  justify-content: center;
  padding: var(--sn-mp-spacing-10) 0;
}

.empty__text {
  font-size: var(--sn-mp-font-size-sm);
  color: var(--sn-mp-color-text-tertiary);
}
</style>
