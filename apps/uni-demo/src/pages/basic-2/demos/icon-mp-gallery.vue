<script setup lang="ts">
/**
 * Demo: sn-icon (uni-end) — 内置图标库总览（showcase）。
 *
 * 搜索 + 分类筛选 + 网格卡片展示全部内置图标；卡片点击复制图标名。
 * 数据单源：sn-icon-catalog（分类 / 中文标签 / 搜索关键词）。
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

/** 当前搜索词。 */
const query = ref('');
/** 当前分类（all = 全部）。 */
const activeCategory = ref<SnIconCategory | 'all'>('all');

/** 分类 chips：全部 + 目录声明的 7 个分类。 */
const chips: Array<{ key: SnIconCategory | 'all'; zh: string }> = [
  { key: 'all', zh: '全部' },
  ...(Object.keys(SN_ICON_CATEGORY_LABELS) as SnIconCategory[]).map((key) => ({
    key,
    zh: SN_ICON_CATEGORY_LABELS[key].zh,
  })),
];

/** 分区数据：目录序 × 分类序，空分区剔除。 */
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

/** 命中条目数（搜索反馈）。 */
const total = computed(() => sections.value.reduce((sum, s) => sum + s.entries.length, 0));

/** 内置库总数。 */
const catalogSize = SN_ICON_CATALOG.length;

function pickCategory(key: SnIconCategory | 'all'): void {
  activeCategory.value = key;
}

/** 点击卡片复制图标名，方便贴进代码。 */
function copyName(name: string): void {
  uni.setClipboardData({
    data: name,
    success: () => {
      uni.showToast({ title: `已复制 ${name}`, icon: 'none' });
    },
  });
}
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <SnSearch v-model="query" placeholder="搜你想要" hide-cancel />

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
      {{ query === '' ? `内置 ${catalogSize} 个图标` : `命中 ${total} 个图标` }}
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
      <text class="empty__text">没有匹配「{{ query }}」的图标</text>
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
