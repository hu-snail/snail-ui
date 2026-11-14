<script setup lang="ts">
/**
 * SnSidebarEndSwitch — 侧栏顶部的 Web / uni-app x 端切换胶囊。
 *
 * 胶囊本体是组件库的 SnSegment（滑动指示器动画与端切换的语义一致）；
 * 本组件只保留两件事：
 *   1. sticky 吸顶壳（样式见 .sn-end-switch，custom.css §18 负责桌面端钉扎）；
 *   2. active 由路由推导（/components/uni → uni），点击跳到对应端的 Button 页，
 *      与导航条「组件」合并入口的 match 前缀规则一致。
 */
import { computed } from 'vue';
import { useRoute, useRouter } from 'vitepress';
import { SnSegment } from '@snui/vue-web';

const route = useRoute();
const router = useRouter();

type End = 'web' | 'uni';

const active = computed<End>(() => (/\/components\/uni(\/|$)/.test(route.path) ? 'uni' : 'web'));
const isEn = computed(() => route.path.startsWith('/en'));

const endOptions = computed(() => [
  { value: 'web' as const, label: isEn.value ? 'Web' : 'Web 端' },
  { value: 'uni' as const, label: isEn.value ? 'uni-app x' : 'uni-app x 端' },
]);

function go(end: End): void {
  if (active.value === end) return;
  const base = isEn.value ? '/en' : '';
  void router.go(`${base}/components/${end}/button`);
}
</script>

<template>
  <div class="sn-end-switch" :aria-label="isEn ? 'Choose an end' : '选择端'">
    <SnSegment
      size="md"
      :options="endOptions"
      :model-value="active"
      :aria-label="isEn ? 'Choose an end' : '选择端'"
      @update:model-value="go($event as End)"
    />
  </div>
</template>

<style scoped>
/* sticky 吸顶条 —— 零滑动钉扎。
    sticky 的实际落点是 max(自然位置, 内容起点 + top)：令 top == margin-top，
    约束线与自然位置重合，胶囊从第一像素起钉死在吸顶线上、随滚动零位移；
    负 margin 同时把不透明底条向上延伸，盖住吸顶线之上的让位空间，菜单项
    只能从条的下缘滚入、被完全盖住（隐形接缝）。padding-top 等量增加，
    胶囊自身的视觉位置不变。
    - 移动端抽屉（<960px）：吸顶线 = 抽屉顶部（32 − 32 = 0）；
    - 桌面端（≥960px）：custom.css §18 把吸顶线换算到导航条下缘
      （top = margin-top = 导航条高 56 − 让位高度 76 = −20），
      悬浮态再归零钉在悬浮面板顶。
    深浅两态背景：非悬浮与侧栏画布同色、悬浮与玻璃面板同材质。
    深色下沿用 tokens 的 .dark 翻转（--sn-web-* 由全局样式注入）。 */
.sn-end-switch {
  position: sticky;
  top: -32px;
  z-index: 3;
  margin: -32px 0 6px;
  padding: 38px 6px 8px;
  background: #ffffff;
}
.dark .sn-end-switch {
  background: var(--vp-c-bg);
}
</style>
