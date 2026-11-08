<script setup lang="ts">
/**
 * Demo: sn-sidebar — 滚动联动（scroll-spy，AUI-OPT-08）。
 *
 * - 右侧 `scroll-view` 的 `@scroll` 把滚动距离写回 `:scroll-top`，左侧高亮随内容
 *   位置自动跟随；组件不监听 `window`，滚动距离由宿主上报
 * - 每个 `sn-sidebar-item` 用 `anchor` 声明它负责的内容区块 id，`anchor-selector`
 *   一次量出这些区块在内容区里的相对位置
 * - 判定线 = `scroll-top` + `scroll-threshold`，偏移以「最高的关联区块」为 0 点；
 *   本 demo 的内容区正是从第一个区块开始，两个坐标同一个原点，因此阈值留 0
 * - 点条目走 `before-change`（只拦用户点击，滚动联动不经过它）把 `scroll-into-view`
 *   指向目标区块，实现「点左侧 → 右内容滚过去」
 */
import { computed, nextTick, ref } from 'vue';
import SnSidebar from '@snui/uni-src/components/sn-sidebar/sn-sidebar.vue';
import SnSidebarItem from '@snui/uni-src/components/sn-sidebar/sn-sidebar-item.vue';

/** 内容区区块：`id` 同时是侧边栏项的 anchor 与 scroll-into-view 的目标。 */
const sections = [
  {
    id: 'sidebar-spy-overview',
    label: '概览',
    lines: [
      '滚动右侧内容区，左侧高亮自动跟随。',
      '组件不经过 window，滚动距离由宿主上报。',
      '这一列的高亮位置就是当前可视区块。',
    ],
  },
  {
    id: 'sidebar-spy-usage',
    label: '基础用法',
    lines: [
      'item 的 anchor 指向区块 id。',
      'anchor-selector 一次量出全部区块。',
      '滚动事件把 scrollTop 写回 scroll-top。',
    ],
  },
  {
    id: 'sidebar-spy-config',
    label: '高级配置',
    lines: [
      'scroll-threshold 校正激活判定线。',
      '顶部有吸顶头部时用它预留高度。',
      '内容变化后调 refresh() 重新测量。',
    ],
  },
  {
    id: 'sidebar-spy-faq',
    label: '常见问题',
    lines: [
      '未声明 anchor 的项不参与联动。',
      '测量失败时保留上一次高亮，不抛错。',
      '点击条目走 before-change，滚动联动不经过它。',
    ],
  },
];

const active = ref(0);
/** scroll-view 实时滚动距离（px，@scroll 上报），回喂 sidebar 做联动。 */
const scrollTop = ref(0);
/** scroll-into-view 目标：只在点条目时更新，滚动联动不回写它，避免抢滚动。 */
const jumpTarget = ref('');

const activeLabel = computed(() => sections[active.value]?.label ?? '');

function onScroll(event: { detail: { scrollTop: number } }): void {
  scrollTop.value = Math.round(event.detail.scrollTop);
}

/** 点击条目走 before-change：先把内容区滚到对应区块；滚动联动不经过这里。 */
async function beforeChange(value: number | string): Promise<boolean> {
  const section = typeof value === 'number' ? sections[value] : undefined;
  if (section === undefined) return true;
  // `scroll-into-view` 对相同的值不重复滚动：先清空再设，重复点同一条也能回位。
  jumpTarget.value = '';
  await nextTick();
  jumpTarget.value = section.id;
  return true;
}
</script>

<template>
  <view class="sn-demo sn-demo--column">
    <view class="sn-demo__stage">
      <SnSidebar
        v-model="active"
        class="sn-demo__nav"
        scroll-spy
        :scroll-top="scrollTop"
        anchor-selector=".sn-demo__section"
        :before-change="beforeChange"
      >
        <SnSidebarItem
          v-for="(section, index) in sections"
          :key="section.id"
          :label="section.label"
          :value="index"
          :anchor="section.id"
        />
      </SnSidebar>

      <scroll-view
        class="sn-demo__content"
        scroll-y
        :scroll-into-view="jumpTarget"
        :scroll-with-animation="true"
        @scroll="onScroll"
      >
        <view
          v-for="section in sections"
          :id="section.id"
          :key="section.id"
          class="sn-demo__section"
        >
          <text class="sn-demo__section-title">{{ section.label }}</text>
          <text v-for="line in section.lines" :key="line" class="sn-demo__section-text">
            {{ line }}
          </text>
        </view>
      </scroll-view>
    </view>
    <text class="sn-demo__meta">
      内容滚动 {{ scrollTop }} px → 左侧高亮「{{ activeLabel }}」（点击条目用 before-change 跳转）
    </text>
  </view>
</template>

<style scoped>
.sn-demo--column {
  display: flex;
  flex-direction: column;
  gap: var(--sn-mp-spacing-2);
  width: 100%;
}
.sn-demo__stage {
  display: flex;
  box-sizing: border-box;
  width: 100%;
  height: 520rpx;
  overflow: hidden;
  border: 2rpx solid var(--sn-mp-color-border-subtle);
  border-radius: var(--sn-mp-radius-md);
}
/* class 落在 sn-sidebar 根节点上（fallthrough），无需 :deep。 */
.sn-demo__nav {
  flex: 0 0 200rpx;
}
.sn-demo__content {
  flex: 1 1 auto;
  min-width: 0;
  min-height: 0;
  background-color: var(--sn-mp-color-background-surface);
}
.sn-demo__section {
  display: flex;
  flex-direction: column;
  gap: var(--sn-mp-spacing-1);
  padding: var(--sn-mp-spacing-3) var(--sn-mp-spacing-4);
  border-bottom: 2rpx solid var(--sn-mp-color-border-subtle);
}
.sn-demo__section-title {
  font-size: var(--sn-mp-font-size-md);
  font-weight: var(--sn-mp-font-weight-semibold);
  color: var(--sn-mp-color-text-primary);
}
.sn-demo__section-text {
  font-size: var(--sn-mp-font-size-xs);
  line-height: var(--sn-mp-font-line-height-normal);
  color: var(--sn-mp-color-text-secondary);
}
.sn-demo__meta {
  font-size: var(--sn-mp-font-size-xs);
  color: var(--sn-mp-color-text-tertiary);
}
</style>
