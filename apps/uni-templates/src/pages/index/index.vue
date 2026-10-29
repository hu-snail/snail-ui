<script setup lang="ts">
/**
 * 模板总览首页（tab）—— 模板商店布局：
 *   sn-paging 根容器，#top 固定「搜索 + 热搜 + 分类 Tab」，默认插槽渲染
 *   精选位 + 排序条 + 双列模板卡瀑布流；页面无标题行，仅保留状态栏占位
 *   （微信胶囊浮于状态栏带内，天然无冲突）。深浅色跟随系统（useTplTheme），
 *   原生 tabBar 由 pages.json 声明。
 */
import { ref, watch } from 'vue';
import SnButton from '@snui/uni-src/components/sn-button/sn-button.vue';
import SnIcon from '@snui/uni-src/components/sn-icon/sn-icon.vue';
import { ArrowRight, ChevronDown } from '@snui/uni-src/components/sn-icon/sn-icon-set';
import SnPaging from '@snui/uni-src/components/sn-paging/sn-paging.vue';
import SnSearch from '@snui/uni-src/components/sn-search/sn-search.vue';
import { FlameIcon, SlidersIcon, SparklesIcon } from '../../common/icons';
import { likedIds, TEMPLATES, TPL_CATEGORIES, TPL_SORTS, HOT_WORDS, type TplCat, type TplItem, type TplSortKey } from '../../common/templates';
import { useTplTheme } from '../../common/theme';
import TplCard from '../../common/tpl-card.vue';

const { isDark } = useTplTheme();

/* ── 列表数据流：sn-paging @query → completeByTotal ────────────────── */
const list = ref<TplItem[]>([]);
const paging = ref<InstanceType<typeof SnPaging> | null>(null);
const keyword = ref('');
const activeCat = ref<TplCat>('all');
const activeSort = ref<TplSortKey>('recommend');
const totalCount = ref(0);

function query(pageNo: number, pageSize: number): void {
  const kw = keyword.value.trim().toLowerCase();
  const rows = TEMPLATES.filter(
    (t) =>
      (activeCat.value === 'all' || t.cat === activeCat.value) &&
      (kw === '' ||
        t.title.toLowerCase().includes(kw) ||
        t.desc.toLowerCase().includes(kw) ||
        t.tag.toLowerCase().includes(kw)),
  ).sort((a, b) => {
    if (activeSort.value === 'latest') return b.updated - a.updated;
    if (activeSort.value === 'downloads') return b.downloads - a.downloads;
    return 0;
  });
  totalCount.value = rows.length;
  setTimeout(() => {
    paging.value?.completeByTotal(rows.slice((pageNo - 1) * pageSize, pageNo * pageSize), rows.length);
  }, 200);
}
watch([keyword, activeCat, activeSort], () => paging.value?.reload());

function toggleLike(id: string): void {
  likedIds.value[id] = !likedIds.value[id];
}
function openTpl(id: string): void {
  uni.navigateTo({ url: `/subpages/${id}` });
}
function chooseCat(): void {
  uni.showActionSheet({
    itemList: TPL_CATEGORIES.map((c) => c.label),
    success: (res) => {
      activeCat.value = TPL_CATEGORIES[res.tapIndex].key;
    },
  });
}
function chooseSort(): void {
  uni.showActionSheet({
    itemList: TPL_SORTS.map((s) => s.label),
    success: (res) => {
      activeSort.value = TPL_SORTS[res.tapIndex].key;
    },
  });
}
function onSortTap(key: TplSortKey): void {
  if (key === 'recommend') chooseSort();
  else activeSort.value = key;
}

const FEATURE = {
  chip: '每周精选 · 精选推荐',
  title: 'snui 场景模板库',
  desc: '11 个真实业务场景模板 · H5 / 微信小程序双端适配',
  author: '蜗蜗工作室',
};
</script>

<template>
  <view class="tpl-page tpl-home" :class="{ 'sn-theme-dark': isDark }">
    <!-- 状态栏占位（页面为 custom 导航，无标题行；微信胶囊浮于状态栏带内） -->
    <view class="home-status-space" aria-hidden="true" />

    <view class="home-paging">
      <SnPaging
        ref="paging"
        v-model="list"
        :default-page-size="6"
        empty-text="没有找到相关模板"
        custom-style="background-color: transparent;"
        @query="query"
      >
        <template #top>
          <view class="home-top">
            <view class="home-search">
              <SnSearch
                v-model="keyword"
                variant="filled"
                hide-cancel
                placeholder-left
                placeholder="搜索模板"
                custom-style="background-color: transparent; padding: 2rpx 24rpx 0;"
              />
            </view>

            <scroll-view class="home-strip" scroll-x :show-scrollbar="false">
              <view class="home-strip__track">
                <view class="home-strip__lead">
                  <SnIcon :icon="FlameIcon" :size="24" color="var(--tplh-accent)" />
                  <text class="home-strip__lead-text">热搜</text>
                </view>
                <view v-for="w in HOT_WORDS" :key="w" class="home-chip" @tap="keyword = w">
                  <text class="home-chip__text">{{ w }}</text>
                </view>
              </view>
            </scroll-view>

            <scroll-view class="home-strip home-strip--cats" scroll-x :show-scrollbar="false">
              <view class="home-strip__track">
                <view
                  v-for="c in TPL_CATEGORIES"
                  :key="c.key"
                  class="home-cat"
                  :class="{ 'is-active': activeCat === c.key }"
                  @tap="activeCat = c.key"
                >
                  <SnIcon
                    v-if="c.key === 'all'"
                    :icon="SparklesIcon"
                    :size="26"
                    :color="activeCat === 'all' ? '#06210f' : 'var(--tplh-accent)'"
                  />
                  <text class="home-cat__text">{{ c.label }}</text>
                </view>
              </view>
            </scroll-view>
          </view>
        </template>

        <view class="home-body">
          <view class="home-feature">
            <view class="home-feature__cover">
              <view class="home-feature__deco home-feature__deco--a" aria-hidden="true" />
              <view class="home-feature__deco home-feature__deco--b" aria-hidden="true" />
              <view class="home-feature__chip"><text class="home-feature__chip-text">{{ FEATURE.chip }}</text></view>
            </view>
            <view class="home-feature__body">
              <view class="home-feature__head">
                <text class="home-feature__title">{{ FEATURE.title }}</text>
                <view class="home-feature__pro"><text class="home-feature__pro-text">v3.4 PRO</text></view>
              </view>
              <text class="home-feature__desc">{{ FEATURE.desc }}</text>
              <view class="home-feature__foot">
                <view class="home-feature__author">
                  <view class="home-feature__avatar"><text class="home-feature__avatar-text">蜗</text></view>
                  <text class="home-feature__author-name">{{ FEATURE.author }}</text>
                </view>
                <SnButton
                  type="primary"
                  size="small"
                  bg-color="#35a257"
                  :icon-data="ArrowRight"
                  :icon-size="26"
                  :custom-style="{ borderRadius: '999rpx', borderColor: '#35a257' }"
                  @click="openTpl('login')"
                >立即预览</SnButton>
              </view>
            </view>
          </view>

          <view class="home-sort">
            <view class="home-sort__tabs">
              <view
                v-for="s in TPL_SORTS"
                :key="s.key"
                class="home-sort__item"
                :class="{ 'is-active': activeSort === s.key }"
                @tap="onSortTap(s.key)"
              >
                <text class="home-sort__text">{{ s.label }}</text>
                <SnIcon v-if="s.key === 'recommend'" :icon="ChevronDown" :size="26" />
              </view>
            </view>
            <view class="home-sort__filter" role="button" aria-label="筛选" @tap="chooseCat">
              <SnIcon :icon="SlidersIcon" :size="26" color="var(--tplh-text-2)" />
              <text class="home-sort__filter-text">筛选</text>
            </view>
          </view>

          <view class="home-grid">
            <TplCard
              v-for="t in list"
              :key="t.id"
              :item="t"
              :liked="!!likedIds[t.id]"
              @open="openTpl(t.id)"
              @like="toggleLike(t.id)"
            />
          </view>
        </view>
      </SnPaging>
    </view>

    <view class="home-fab">
      <view class="home-fab__dot" aria-hidden="true" />
      <text class="home-fab__text">已发现 {{ totalCount }} 套模板</text>
      <view class="home-fab__btn" role="button" aria-label="一键筛选" @tap="chooseCat">
        <text class="home-fab__btn-text">一键筛选</text>
        <SnIcon :icon="SlidersIcon" :size="24" color="var(--tplh-accent)" />
      </view>
    </view>
  </view>
</template>

<style scoped>
/* 调色板 --tplh-* 定义在 App.vue 的 .tpl-page / .sn-theme-dark 上（全局复用）。 */
.tpl-home {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: var(--tplh-bg);
  color: var(--tplh-text);
}

/* ── 状态栏占位（无标题行，内容直接从安全区下开始） ─────────────────── */
.home-status-space {
  flex-shrink: 0;
  height: var(--status-bar-height, 0px);
}
.home-paging {
  flex: 1;
  min-height: 0;
}

/* ── #top：搜索 + 热搜 + 分类 Tab（固定区） ─────────────────────────── */
.home-top {
  display: flex;
  flex-direction: column;
  gap: 14rpx;
  padding: 8rpx 0 18rpx;
}
.home-search {
  padding: 0;
}
.home-strip {
  width: 100%;
  white-space: nowrap;
}
.home-strip__track {
  display: inline-flex;
  align-items: center;
  gap: 12rpx;
  padding: 0 24rpx;
}
.home-strip__lead {
  display: flex;
  align-items: center;
  gap: 6rpx;
  flex-shrink: 0;
}
.home-strip__lead-text {
  color: var(--tplh-accent);
  font-size: 22rpx;
  font-weight: 700;
  letter-spacing: 0.04em;
}
.home-chip {
  flex-shrink: 0;
  padding: 7rpx 18rpx;
  border-radius: 999rpx;
  background: var(--tplh-field);
  border: 2rpx solid var(--tplh-line);
}
.home-chip__text {
  color: var(--tplh-text-2);
  font-size: 21rpx;
}
.home-cat {
  display: flex;
  align-items: center;
  gap: 5rpx;
  flex-shrink: 0;
  padding: 9rpx 22rpx;
  border-radius: 999rpx;
  background: var(--tplh-field);
  border: 2rpx solid var(--tplh-line);
}
.home-cat.is-active {
  background: linear-gradient(120deg, #35a257, #1d8f55);
  border-color: transparent;
}
.home-cat__text {
  color: var(--tplh-text-2);
  font-size: 22rpx;
  font-weight: 600;
}
.home-cat.is-active .home-cat__text {
  color: #eafff3;
}

/* ── 滚动内容：精选位 + 排序 + 瀑布卡 ───────────────────────────────── */
.home-body {
  padding: 4rpx 24rpx 160rpx;
  display: flex;
  flex-direction: column;
  gap: 28rpx;
}
.home-feature {
  border-radius: 28rpx;
  overflow: hidden;
  background: var(--tplh-card);
  border: 2rpx solid var(--tplh-line);
  box-shadow: var(--tplh-shadow);
}
.home-feature__cover {
  position: relative;
  height: 220rpx;
  background: linear-gradient(120deg, #0d5c38, #35a257 55%, #6ee7a0);
  overflow: hidden;
}
.home-feature__deco {
  position: absolute;
  border-radius: 24rpx;
  background: rgba(255, 255, 255, 0.16);
}
.home-feature__deco--a {
  width: 170rpx;
  height: 150rpx;
  right: 40rpx;
  top: 36rpx;
  transform: rotate(-8deg);
}
.home-feature__deco--b {
  width: 120rpx;
  height: 120rpx;
  right: 200rpx;
  top: 80rpx;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
}
.home-feature__chip {
  position: absolute;
  top: 18rpx;
  left: 18rpx;
  padding: 6rpx 18rpx;
  border-radius: 999rpx;
  background: rgba(6, 30, 17, 0.62);
}
.home-feature__chip-text {
  color: #7ef0b0;
  font-size: 20rpx;
  font-weight: 700;
  letter-spacing: 0.06em;
}
.home-feature__body {
  display: flex;
  flex-direction: column;
  gap: 10rpx;
  padding: 22rpx 24rpx 24rpx;
}
.home-feature__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.home-feature__title {
  color: var(--tplh-text);
  font-size: 34rpx;
  font-weight: 800;
}
.home-feature__pro {
  padding: 4rpx 12rpx;
  border-radius: 10rpx;
  background: var(--tplh-field);
  border: 2rpx solid var(--tplh-accent);
}
.home-feature__pro-text {
  color: var(--tplh-accent);
  font-size: 20rpx;
  font-weight: 700;
}
.home-feature__desc {
  color: var(--tplh-text-3);
  font-size: 23rpx;
  line-height: 1.5;
}
.home-feature__foot {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 8rpx;
}
.home-feature__author {
  display: flex;
  align-items: center;
  gap: 12rpx;
}
.home-feature__avatar {
  width: 40rpx;
  height: 40rpx;
  border-radius: 50%;
  background: linear-gradient(135deg, #35a257, #0d7a4b);
  display: flex;
  align-items: center;
  justify-content: center;
}
.home-feature__avatar-text {
  color: #eafff3;
  font-size: 20rpx;
  font-weight: 700;
}
.home-feature__author-name {
  color: var(--tplh-text-2);
  font-size: 22rpx;
}

.home-sort {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.home-sort__tabs {
  display: flex;
  align-items: center;
  gap: 28rpx;
}
.home-sort__item {
  display: flex;
  align-items: center;
  gap: 2rpx;
  color: var(--tplh-text-3);
}
.home-sort__text {
  color: inherit;
  font-size: 26rpx;
  font-weight: 600;
}
.home-sort__item.is-active .home-sort__text {
  color: var(--tplh-accent);
  font-weight: 800;
}
.home-sort__filter {
  display: flex;
  align-items: center;
  gap: 6rpx;
  padding: 8rpx 18rpx;
  border-radius: 999rpx;
  background: var(--tplh-field);
  border: 2rpx solid var(--tplh-line);
}
.home-sort__filter-text {
  color: var(--tplh-text-2);
  font-size: 22rpx;
}

.home-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 20rpx;
}

/* ── 悬浮统计条（tabbar 之上） ──────────────────────────────────────── */
.home-fab {
  position: fixed;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 16rpx;
  padding: 14rpx 24rpx;
  border-radius: 999rpx;
  background: var(--tplh-card);
  border: 2rpx solid var(--tplh-line);
  box-shadow: var(--tplh-shadow);
  z-index: 30;
}
/* #ifdef H5 */
.home-fab {
  bottom: calc(100rpx + 16rpx);
}
/* #endif */
/* #ifndef H5 */
.home-fab {
  bottom: calc(env(safe-area-inset-bottom) + 16rpx);
}
/* #endif */
.home-fab__dot {
  width: 14rpx;
  height: 14rpx;
  border-radius: 50%;
  background: var(--tplh-accent);
}
.home-fab__text {
  color: var(--tplh-text-2);
  font-size: 22rpx;
  font-weight: 600;
  white-space: nowrap;
}
.home-fab__btn {
  display: flex;
  align-items: center;
  gap: 6rpx;
  white-space: nowrap;
}
.home-fab__btn-text {
  color: var(--tplh-accent);
  font-size: 22rpx;
  font-weight: 800;
  white-space: nowrap;
}
</style>
