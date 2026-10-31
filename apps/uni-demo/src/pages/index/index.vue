<script setup lang="ts">
// 首页 —— 组件目录（手写页面；目录数据由 scripts/gen-pages.mjs 生成到
// home-data.ts，含中英双字段）。
// 版式：搜索框 + 分类 chips + 双列图标卡（图标卡见 home-icons.ts）。
// 分类按分组标签合并（basic / basic-2 同为「基础组件」），点 chip 切换分组；
// 搜索时跨全部分组平铺结果。
import { computed, ref } from 'vue';
import SnIcon from '@snui/uni-src/components/sn-icon/sn-icon.vue';
import { Search as SearchIcon, X as CloseIcon } from '@snui/uni-src/components/sn-icon/sn-icon-set';
import DemoPageShell from '../../components/DemoPageShell.vue';
import { useDemoUi } from '../../state/demo-ui';
import { HOME_GROUPS } from './home-data';
import type { DemoHomeComp } from './home-data';
import { homeIcon } from './home-icons';

const { lang, t } = useDemoUi();

interface HomeComp extends DemoHomeComp {
  /** 当前语言下的组件名。 */
  name: string;
}

interface HomeCategory {
  /** 首个分组 key（合并后的稳定标识）。 */
  id: string;
  label: string;
  comps: HomeComp[];
}

const keyword = ref('');
/** 当前分类下标（chips 选中项）。 */
const activeIndex = ref(0);

/**
 * 分类：按分组标签合并——gen-pages 会把同一文档分组拆成 basic / basic-2
 * 两个 subPackage，标签相同，首页只应出现一个入口。
 */
const categories = computed<HomeCategory[]>(() => {
  const out: HomeCategory[] = [];
  for (const group of HOME_GROUPS) {
    const label = lang.value === 'en' ? group.labelEn : group.label;
    const comps: HomeComp[] = group.comps.map((comp) => ({
      ...comp,
      name: lang.value === 'en' ? comp.titleEn : comp.title,
    }));
    const merged = out.find((category) => category.label === label);
    if (merged !== undefined) {
      merged.comps.push(...comps);
    } else {
      out.push({ id: group.key, label, comps });
    }
  }
  return out;
});

const activeCategory = computed<HomeCategory | undefined>(
  () => categories.value[activeIndex.value],
);

const query = computed(() => keyword.value.trim().toLowerCase());
const isSearching = computed(() => query.value !== '');

/** 全量组件平铺（搜索池，中英名同时可搜）。 */
const allComps = computed<HomeComp[]>(() =>
  HOME_GROUPS.flatMap((group) =>
    group.comps.map((comp) => ({
      ...comp,
      name: lang.value === 'en' ? comp.titleEn : comp.title,
    })),
  ),
);

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

/** 当前展示的卡片：搜索中 → 结果；否则 → 选中分类。 */
const visibleComps = computed<HomeComp[]>(() =>
  isSearching.value ? results.value : (activeCategory.value?.comps ?? []),
);

const sectionTitle = computed(() =>
  isSearching.value ? t('搜索结果', 'Search results') : (activeCategory.value?.label ?? ''),
);

function scenesText(count: number): string {
  return t(`${count} 个场景`, `${count} demos`);
}

function resultCountText(count: number): string {
  return t(`${count} 个结果`, `${count} results`);
}

function pickCategory(index: number): void {
  activeIndex.value = index;
}

function open(comp: HomeComp): void {
  uni.navigateTo({ url: `/pages/${comp.group}/${comp.key}` });
}
</script>

<template>
  <DemoPageShell brand :title-zh="'snui 组件演示'" :title-en="'snui Components'">
    <view class="home">
      <!-- 搜索框 -->
      <view class="home__search">
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
          <SnIcon :icon="CloseIcon" :size="12" />
        </view>
      </view>

      <!-- 分类 chips（搜索时隐藏，结果跨分组） -->
      <scroll-view v-if="!isSearching" class="home__chips" scroll-x :show-scrollbar="false">
        <view class="home__chips-inner">
          <view
            v-for="(category, index) in categories"
            :key="category.id"
            class="home__chip"
            :class="{ 'home__chip--active': index === activeIndex }"
            @tap="pickCategory(index)"
          >
            <text class="home__chip-text">{{ category.label }}</text>
          </view>
        </view>
      </scroll-view>

      <!-- 分组标题 / 结果数 -->
      <view class="home__section">
        <text class="home__section-title">{{ sectionTitle }}</text>
        <text v-if="isSearching" class="home__section-meta">{{
          resultCountText(results.length)
        }}</text>
      </view>

      <!-- 双列卡片 -->
      <view class="home__grid">
        <view
          v-for="comp in visibleComps"
          :key="`${comp.group}-${comp.key}`"
          class="home__card"
          @tap="open(comp)"
        >
          <view class="home__card-head">
            <view class="home__badge">
              <SnIcon :icon="homeIcon(comp.key, comp.group)" :size="20" />
            </view>
            <text class="home__count">{{ scenesText(comp.count) }}</text>
          </view>
          <text class="home__title">{{ comp.name }}</text>
          <text v-if="lang !== 'en' && comp.desc !== ''" class="home__desc">{{ comp.desc }}</text>
        </view>
      </view>

      <view v-if="visibleComps.length === 0" class="home__empty">
        <text class="home__empty-text">{{ t('没有匹配的组件', 'No matching components') }}</text>
      </view>

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
  animation: demo-fade-in 0.7s ease both;
}

/* ── 搜索框 ───────────────────────────────────────────────────────────── */
.home__search {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 14rpx;
  height: 84rpx;
  padding: 0 26rpx;
  margin: 8rpx 0 20rpx;
  border-radius: 42rpx;
  background: var(--demo-search-bg);
  border: 1px solid var(--demo-card-border);
  box-shadow: 0 10rpx 30rpx rgba(60, 52, 120, 0.07);
}

.home__search-icon {
  color: var(--demo-text-3);
  flex-shrink: 0;
}

.home__search-input {
  flex: 1;
  height: 100%;
  font-size: 26rpx;
  color: var(--demo-title);
  background: transparent;
  border: none;
}

.home__search-clear {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 38rpx;
  height: 38rpx;
  border-radius: 50%;
  background: var(--demo-chip-bg);
  color: var(--demo-text-3);
  flex-shrink: 0;
}

/* ── 分类 chips ───────────────────────────────────────────────────────── */
.home__chips {
  width: 100%;
  white-space: nowrap;
  margin-bottom: 6rpx;
}

.home__chips-inner {
  display: inline-flex;
  flex-direction: row;
  align-items: center;
  padding: 4rpx 2rpx 10rpx;
}

.home__chip {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 64rpx;
  padding: 0 30rpx;
  margin-right: 16rpx;
  border-radius: 32rpx;
  background: var(--demo-chip-bg);
  border: 1px solid var(--demo-chip-border);
  color: var(--demo-text);
  flex-shrink: 0;
  transition: opacity 0.15s ease;
}

.home__chip:active {
  opacity: 0.75;
}

.home__chip-text {
  font-size: 24rpx;
  line-height: 1;
  font-weight: 500;
}

.home__chip--active {
  background: linear-gradient(135deg, #7c5cfc, #a78bfa);
  border-color: transparent;
  box-shadow: 0 10rpx 24rpx rgba(124, 92, 252, 0.32);
}

.home__chip--active .home__chip-text {
  color: #ffffff;
  font-weight: 600;
}

/* ── 分组标题 ─────────────────────────────────────────────────────────── */
.home__section {
  display: flex;
  flex-direction: row;
  align-items: baseline;
  justify-content: space-between;
  padding: 18rpx 6rpx 16rpx;
}

.home__section-title {
  font-size: 30rpx;
  font-weight: 700;
  color: var(--demo-title);
}

.home__section-meta {
  font-size: 22rpx;
  color: var(--demo-text-3);
}

/* ── 双列卡片 ─────────────────────────────────────────────────────────── */
.home__grid {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
}

.home__card {
  /* 容器 702rpx = 341*2 + 20 间距（首页左右各 24rpx padding）；固定 rpx
   * 宽度而非 calc(50% - 10rpx)，避开小程序端 calc 内 rpx 的历史兼容问题。 */
  width: 341rpx;
  box-sizing: border-box;
  padding: 26rpx 24rpx 28rpx;
  margin-bottom: 20rpx;
  border-radius: 32rpx;
  background: var(--demo-card-bg);
  border: 1px solid var(--demo-card-border);
  box-shadow: var(--demo-card-shadow);
  transition: transform 0.15s ease;
}

.home__card:active {
  transform: scale(0.98);
}

.home__card-head {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
}

.home__badge {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 72rpx;
  height: 72rpx;
  border-radius: 22rpx;
  background: var(--demo-icon-bg);
  color: var(--demo-icon-fg);
}

.home__count {
  font-size: 20rpx;
  color: var(--demo-text-3);
}

.home__title {
  display: block;
  margin-top: 22rpx;
  font-size: 30rpx;
  font-weight: 700;
  color: var(--demo-title);
}

.home__desc {
  display: -webkit-box;
  margin-top: 8rpx;
  /* 预留两行高度：同排卡片高度一致，不因描述长短参差 */
  min-height: 68rpx;
  font-size: 22rpx;
  line-height: 1.55;
  color: var(--demo-text);
  overflow: hidden;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  text-overflow: ellipsis;
}

/* ── 空态 / 页脚 ──────────────────────────────────────────────────────── */
.home__empty {
  padding: 96rpx 0;
  display: flex;
  justify-content: center;
}

.home__empty-text {
  font-size: 26rpx;
  color: var(--demo-text-3);
}

.home__foot {
  padding: 24rpx 0 60rpx;
  display: flex;
  justify-content: center;
}

.home__foot-text {
  font-size: 22rpx;
  color: var(--demo-text-3);
}
</style>
