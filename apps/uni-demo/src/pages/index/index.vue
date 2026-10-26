<script setup lang="ts">
// 首页 —— 组件目录（手写页面；目录数据由 scripts/gen-pages.mjs 生成到
// home-data.ts，含中英双字段）。视觉：渐变弥散背景 + 玻璃卡（DemoPageShell）。
// 搜索：按中文名 / 英文名 / key / 描述本地过滤，结果平铺展示。
import { computed, ref } from 'vue';
import SnIcon from '@snui/uni-src/components/sn-icon/sn-icon.vue';
import { Search as SearchIcon, X as CloseIcon } from '@snui/uni-src/components/sn-icon/sn-icon-set';
import DemoPageShell from '../../components/DemoPageShell.vue';
import { useDemoUi } from '../../state/demo-ui';
import { HOME_GROUPS } from './home-data';

const { lang, t } = useDemoUi();

interface HomeComp {
  key: string;
  group: string;
  title: string;
  titleEn: string;
  desc: string;
  count: number;
}

const keyword = ref('');

const groups = computed(() =>
  HOME_GROUPS.map((group) => ({
    ...group,
    label: lang.value === 'en' ? group.labelEn : group.label,
    comps: group.comps.map((comp) => ({
      ...comp,
      name: lang.value === 'en' ? comp.titleEn : comp.title,
      desc: lang.value === 'en' ? '' : comp.desc,
    })),
  })),
);

/** 分组标签查询（搜索结果标注归属用）。 */
const groupLabels = computed(() => {
  const labels = new Map<string, string>();
  for (const group of HOME_GROUPS) {
    labels.set(group.key, lang.value === 'en' ? group.labelEn : group.label);
  }
  return labels;
});

const query = computed(() => keyword.value.trim().toLowerCase());
const isSearching = computed(() => query.value !== '');

/** 全量组件平铺（搜索池）。 */
const allComps = computed<HomeComp[]>(() => HOME_GROUPS.flatMap((group) => group.comps));

const results = computed<HomeComp[]>(() => {
  const q = query.value;
  if (q === '') return [];
  return allComps.value.filter(
    (comp) =>
      comp.title.toLowerCase().includes(q) ||
      comp.titleEn.toLowerCase().includes(q) ||
      comp.key.toLowerCase().includes(q) ||
      comp.desc.toLowerCase().includes(q),
  );
});

function scenesText(count: number): string {
  return t(`${count} 个场景`, `${count} demos`);
}

function resultCountText(count: number): string {
  return t(`${count} 个结果`, `${count} results`);
}

function open(comp: HomeComp): void {
  uni.navigateTo({ url: `/pages/${comp.group}/${comp.key}` });
}
</script>

<template>
  <DemoPageShell brand :title-zh="'snui 组件演示'" :title-en="'snui Components'">
    <view class="home">
      <!-- 搜索框（玻璃） -->
      <view class="home__search demo-glass">
        <SnIcon class="home__search-icon" :icon="SearchIcon" :size="16" />
        <input
          v-model="keyword"
          class="home__search-input"
          type="text"
          confirm-type="search"
          :placeholder="t('搜索组件…', 'Search components…')"
          placeholder-style="color: var(--demo-text-3)"
        />
        <view
          v-if="keyword !== ''"
          class="home__search-clear"
          :aria-label="t('清除搜索', 'Clear search')"
          @tap="keyword = ''"
        >
          <SnIcon :icon="CloseIcon" :size="13" />
        </view>
      </view>

      <!-- 搜索结果：平铺 + 归属分组标注 -->
      <view v-if="isSearching">
        <view class="home__search-meta">
          <text class="home__search-meta-text">{{ resultCountText(results.length) }}</text>
        </view>
        <view v-if="results.length === 0" class="home__empty">
          <text class="home__empty-text">{{ t('没有匹配的组件', 'No matching components') }}</text>
        </view>
        <view
          v-for="comp in results"
          :key="comp.key"
          class="home__card demo-glass"
          @tap="open(comp)"
        >
          <view class="home__card-head">
            <text class="home__title">{{ lang === 'en' ? comp.titleEn : comp.title }}</text>
            <text class="home__count">{{ scenesText(comp.count) }}</text>
          </view>
          <text v-if="lang !== 'en' && comp.desc !== ''" class="home__desc">{{ comp.desc }}</text>
          <text class="home__card-group">{{ groupLabels.get(comp.group) }}</text>
        </view>
      </view>

      <!-- 目录（默认） -->
      <template v-else>
        <view v-for="group in groups" :key="group.key" class="home__group">
          <view class="home__group-title">{{ group.label }}</view>
          <view
            v-for="comp in group.comps"
            :key="comp.key"
            class="home__card demo-glass"
            @tap="open(comp)"
          >
            <view class="home__card-head">
              <text class="home__title">{{ comp.name }}</text>
              <text class="home__count">{{ scenesText(comp.count) }}</text>
            </view>
            <text v-if="comp.desc !== ''" class="home__desc">{{ comp.desc }}</text>
          </view>
        </view>
      </template>

      <view class="home__foot">
        <text class="home__foot-text">
          {{ t('snui · uni-app 端组件演示', 'snui · uni-app component demos') }}
        </text>
      </view>
    </view>
  </DemoPageShell>
</template>

<style scoped>
.home {
  padding: 8rpx 24rpx 0;
  /* 目录入场渐显 */
  animation: demo-fade-in 0.7s ease both;
}

/* ── 搜索框（玻璃） ────────────────────────────────────────────────────── */
.home__search {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 14rpx;
  height: 76rpx;
  padding: 0 24rpx;
  margin: 8rpx 0 24rpx;
  border-radius: 38rpx;
}

.home__search-icon {
  color: var(--demo-text-3);
  flex-shrink: 0;
}

.home__search-input {
  flex: 1;
  height: 100%;
  font-size: 28rpx;
  color: var(--demo-title);
  background: transparent;
  border: none;
}

.home__search-clear {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40rpx;
  height: 40rpx;
  border-radius: 50%;
  background: var(--demo-chip-bg);
  color: var(--demo-text-3);
  flex-shrink: 0;
}

.home__search-meta {
  padding: 0 8rpx 16rpx;
}

.home__search-meta-text {
  font-size: 22rpx;
  color: var(--demo-text-3);
}

.home__empty {
  padding: 96rpx 0;
  display: flex;
  justify-content: center;
}

.home__empty-text {
  font-size: 26rpx;
  color: var(--demo-text-3);
}

.home__card-group {
  display: block;
  margin-top: 10rpx;
  font-size: 20rpx;
  color: var(--demo-text-3);
}

.home__group {
  margin-bottom: 32rpx;
}

.home__group-title {
  font-size: 30rpx;
  font-weight: 600;
  color: var(--demo-title);
  padding: 8rpx 8rpx 16rpx;
}

.home__card {
  padding: 28rpx;
  margin-bottom: 20rpx;
}

.home__card-head {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8rpx;
}

.home__title {
  font-size: 30rpx;
  font-weight: 600;
  color: var(--demo-title);
}

.home__count {
  font-size: 22rpx;
  color: var(--demo-text-3);
  background: var(--demo-btn-bg);
  border-radius: 20rpx;
  padding: 4rpx 16rpx;
}

.home__desc {
  font-size: 24rpx;
  color: var(--demo-text);
  line-height: 1.6;
}

.home__foot {
  padding: 40rpx 0 60rpx;
  display: flex;
  justify-content: center;
}

.home__foot-text {
  font-size: 22rpx;
  color: var(--demo-text-3);
}
</style>
