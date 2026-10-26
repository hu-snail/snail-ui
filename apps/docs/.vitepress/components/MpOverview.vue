<script setup lang="ts">
/**
 * MpOverview — the preview route's home: the component directory.
 *
 * Rendered inside the `/preview-mp` iframe (home view) and embedded on the
 * overview doc page through MpHome. Tapping a component navigates the iframe
 * to that component's preview; the preview's back button returns here.
 *
 * Styling notes:
 *   - px units, NOT rpx: this is a docs component, not a uni component, and
 *     the rpx-transform plugin's anchors cover the uni package and the demo
 *     directories only — rpx here would silently drop every geometric rule
 *     (that is exactly how the first cut of this directory rendered crooked).
 *   - The page background is a soft diffuse gradient (layered radial colour
 *     blobs over a near-white base; muted dark variants at night); every
 *     component is its own rounded card on a 2-column grid, so nothing can
 *     end up staggered.
 */
import { computed, ref } from 'vue'
import { withBase } from 'vitepress'
import { OVERVIEW_GROUPS, OVERVIEW_TOTAL } from '../utils/overview-data'

const keyword = ref('')
const activeGroup = ref('all')

const groups = computed(() => {
  const key = keyword.value.trim().toLowerCase()
  return OVERVIEW_GROUPS.filter(
    (group) => activeGroup.value === 'all' || activeGroup.value === group.key,
  )
    .map((group) => ({
      ...group,
      items: group.items.filter(
        (item) =>
          key === '' ||
          item.name.includes(key) ||
          item.title.includes(key) ||
          item.desc.includes(key),
      ),
    }))
    .filter((group) => group.items.length > 0)
})

const shownTotal = computed(() =>
  groups.value.reduce((sum, group) => sum + group.items.length, 0),
)

function openPreview(name: string): void {
  const short = name.replace(/^sn-/, '')
  window.location.href = withBase(`/preview-mp?comp=${short}`)
}
</script>

<template>
  <div class="ov">
    <header class="ov__hero">
      <h1 class="ov__title">Snail AUI</h1>
      <p class="ov__sub">uni-app 多端组件库</p>
      <div class="ov__stats">
        <div class="ov__stat">
          <b class="ov__stat-num">{{ OVERVIEW_TOTAL }}</b>
          <span class="ov__stat-label">组件</span>
        </div>
        <div class="ov__stat">
          <b class="ov__stat-num">{{ OVERVIEW_GROUPS.length }}</b>
          <span class="ov__stat-label">分类</span>
        </div>
        <div class="ov__stat">
          <b class="ov__stat-num">v3</b>
          <span class="ov__stat-label">版本</span>
        </div>
      </div>
    </header>

    <input
      v-model="keyword"
      class="ov__search"
      type="search"
      placeholder="搜索组件…"
      aria-label="搜索组件"
    />

    <div class="ov__chips" role="tablist">
      <button
        type="button"
        class="ov__chip"
        :class="{ 'ov__chip--active': activeGroup === 'all' }"
        @click="activeGroup = 'all'"
      >
        全部
      </button>
      <button
        v-for="group in OVERVIEW_GROUPS"
        :key="group.key"
        type="button"
        class="ov__chip"
        :class="{ 'ov__chip--active': activeGroup === group.key }"
        @click="activeGroup = group.key"
      >
        {{ group.label }}
      </button>
    </div>

    <section v-for="group in groups" :key="group.key" class="ov__group">
      <h2 class="ov__group-title">
        {{ group.label }}
        <span class="ov__group-count">{{ group.items.length }}</span>
      </h2>
      <div class="ov__grid">
        <button
          v-for="item in group.items"
          :key="item.name"
          type="button"
          class="ov__card"
          @click="openPreview(item.name)"
        >
          <span class="ov__card-name">{{ item.name }}</span>
          <span class="ov__card-desc">{{ item.title }} · {{ item.desc }}</span>
        </button>
      </div>
    </section>

    <p class="ov__meta">共 {{ shownTotal }} 个组件 · 点击卡片进入预览</p>
  </div>
</template>

<style scoped>
/* Diffuse-gradient page: layered radial colour blobs over a near-white base. */
.ov {
  min-height: 100vh;
  box-sizing: border-box;
  padding: 16px 14px 28px;
  display: flex;
  flex-direction: column;
  gap: 14px;
  color: #1f2329;
  background:
    radial-gradient(420px 320px at 12% 6%, rgba(96, 128, 255, 0.16), transparent 62%),
    radial-gradient(380px 300px at 90% 16%, rgba(255, 120, 170, 0.14), transparent 62%),
    radial-gradient(480px 380px at 18% 92%, rgba(56, 208, 198, 0.14), transparent 62%),
    radial-gradient(400px 320px at 88% 86%, rgba(168, 122, 255, 0.12), transparent 62%),
    #f7f8fc;
  font-family:
    ui-sans-serif, -apple-system, 'Segoe UI', Roboto, 'PingFang SC',
    'Hiragino Sans GB', 'Microsoft YaHei', sans-serif;
}

:global(.dark) .ov {
  color: #e3e3e8;
  background:
    radial-gradient(420px 320px at 12% 6%, rgba(96, 128, 255, 0.16), transparent 62%),
    radial-gradient(380px 300px at 90% 16%, rgba(255, 120, 170, 0.1), transparent 62%),
    radial-gradient(480px 380px at 18% 92%, rgba(56, 208, 198, 0.12), transparent 62%),
    radial-gradient(400px 320px at 88% 86%, rgba(168, 122, 255, 0.12), transparent 62%),
    #16161a;
}

.ov__hero {
  box-sizing: border-box;
  padding: 20px 18px;
  border-radius: 22px;
  background: rgba(255, 255, 255, 0.72);
  backdrop-filter: blur(6px);
}

:global(.dark) .ov__hero {
  background: rgba(38, 38, 44, 0.72);
}

.ov__title {
  margin: 0;
  font-size: 22px;
  font-weight: 700;
  letter-spacing: 0.2px;
}

.ov__sub {
  margin: 4px 0 0;
  font-size: 12px;
  color: #6b7078;
}

:global(.dark) .ov__sub {
  color: #9a9aa3;
}

.ov__stats {
  display: flex;
  margin-top: 14px;
  padding: 10px 0;
  border-radius: 14px;
  background: rgba(31, 35, 41, 0.05);
}

:global(.dark) .ov__stats {
  background: rgba(255, 255, 255, 0.06);
}

.ov__stat {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
}

.ov__stat-num {
  font-size: 17px;
  font-weight: 700;
  color: #3b62f6;
}

:global(.dark) .ov__stat-num {
  color: #8aa2ff;
}

.ov__stat-label {
  font-size: 11px;
  color: #6b7078;
}

:global(.dark) .ov__stat-label {
  color: #9a9aa3;
}

.ov__search {
  box-sizing: border-box;
  width: 100%;
  height: 38px;
  padding: 0 16px;
  border: 0;
  border-radius: 19px;
  background: rgba(255, 255, 255, 0.86);
  color: inherit;
  font-size: 13px;
  outline: none;
}

.ov__search::placeholder {
  color: #9aa0a8;
}

.ov__search:focus-visible {
  box-shadow: 0 0 0 2px rgba(59, 98, 246, 0.35);
}

:global(.dark) .ov__search {
  background: rgba(38, 38, 44, 0.86);
}

.ov__chips {
  display: flex;
  gap: 8px;
  overflow-x: auto;
  scrollbar-width: none;
  -webkit-overflow-scrolling: touch;
  margin: 0 -14px;
  padding: 0 14px;
}

.ov__chips::-webkit-scrollbar {
  display: none;
}

.ov__chip {
  flex-shrink: 0;
  height: 30px;
  padding: 0 14px;
  border: 0;
  border-radius: 15px;
  background: rgba(255, 255, 255, 0.82);
  color: #5b6068;
  font-size: 12px;
  cursor: pointer;
  transition: background-color 0.15s, color 0.15s;
}

.ov__chip--active {
  background: #1f2329;
  color: #ffffff;
  font-weight: 600;
}

:global(.dark) .ov__chip {
  background: rgba(38, 38, 44, 0.86);
  color: #9a9aa3;
}

:global(.dark) .ov__chip--active {
  background: #e3e3e8;
  color: #17171a;
}

.ov__group {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.ov__group-title {
  display: flex;
  align-items: center;
  gap: 6px;
  margin: 4px 2px 0;
  font-size: 13px;
  font-weight: 600;
  color: #4a4f57;
}

:global(.dark) .ov__group-title {
  color: #b4b4bd;
}

.ov__group-count {
  min-width: 22px;
  padding: 1px 7px;
  border-radius: 10px;
  background: rgba(59, 98, 246, 0.14);
  color: #3b62f6;
  font-size: 10px;
  font-weight: 600;
  text-align: center;
}

:global(.dark) .ov__group-count {
  background: rgba(138, 162, 255, 0.18);
  color: #8aa2ff;
}

/* The grid: equal-width independent cards, two per row — no staggering. */
.ov__grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
}

.ov__card {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 4px;
  min-width: 0;
  padding: 12px;
  border: 0;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.92);
  text-align: left;
  cursor: pointer;
  transition: transform 0.12s ease, background-color 0.15s;
}

.ov__card:hover {
  background: #ffffff;
}

.ov__card:active {
  transform: scale(0.97);
}

:global(.dark) .ov__card {
  background: rgba(40, 40, 46, 0.92);
}

:global(.dark) .ov__card:hover {
  background: #2c2c33;
}

.ov__card-name {
  max-width: 100%;
  font-size: 13px;
  font-weight: 600;
  color: inherit;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.ov__card-desc {
  max-width: 100%;
  font-size: 11px;
  line-height: 1.5;
  color: #8a8f99;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

:global(.dark) .ov__card-desc {
  color: #9a9aa3;
}

.ov__meta {
  margin: 2px 0 0;
  text-align: center;
  font-size: 11px;
  color: #9aa0a8;
}

:global(.dark) .ov__meta {
  color: #7c7c86;
}
</style>
