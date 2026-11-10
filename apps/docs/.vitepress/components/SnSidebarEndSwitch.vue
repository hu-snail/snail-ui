<script setup lang="ts">
/**
 * SnSidebarEndSwitch — 侧栏顶部的 Web / uni-app 端切换胶囊。
 *
 * 弹性滑动指示器：滑块是唯一的运动物，`cubic-bezier(0.34, 1.56, 0.64, 1)`
 * 的 back-out 曲线让它带一次可见的回弹（过冲约 10% 后落位）——分段控件
 * 的"确认感"来自这次过冲，而不是两条曲线的交叉淡入。
 *
 * active 由路由推导（/components/uni → uni），点击跳到对应端的 Button 页，
 * 与导航条「组件」合并入口的 match 前缀规则一致。
 */
import { computed } from 'vue';
import { useRoute, useRouter } from 'vitepress';

const route = useRoute();
const router = useRouter();

type End = 'web' | 'uni';

const active = computed<End>(() => (/\/components\/uni(\/|$)/.test(route.path) ? 'uni' : 'web'));
const isEn = computed(() => route.path.startsWith('/en'));

function go(end: End): void {
  if (active.value === end) return;
  const base = isEn.value ? '/en' : '';
  void router.go(`${base}/components/${end}/button`);
}
</script>

<template>
  <div class="sn-end-switch" :aria-label="isEn ? 'Choose an end' : '选择端'">
    <div class="sn-end-switch__pill" role="tablist" :aria-label="isEn ? 'Choose an end' : '选择端'">
      <span
        class="sn-end-switch__thumb"
        :class="{ 'sn-end-switch__thumb--uni': active === 'uni' }"
        aria-hidden="true"
      />
      <button
        type="button"
        role="tab"
        class="sn-end-switch__opt"
        :class="{ 'sn-end-switch__opt--on': active === 'web' }"
        :aria-selected="active === 'web'"
        @click="go('web')"
      >
        Web 端
      </button>
      <button
        type="button"
        role="tab"
        class="sn-end-switch__opt"
        :class="{ 'sn-end-switch__opt--on': active === 'uni' }"
        :aria-selected="active === 'uni'"
        @click="go('uni')"
      >
        uni-app 端
      </button>
    </div>
  </div>
</template>

<style scoped>
/* 外层：sticky 吸顶条 —— 零滑动钉扎。
    sticky 的实际落点是 max(自然位置, 内容起点 + top)：令 top == margin-top，
    约束线与自然位置重合，胶囊从第一像素起钉死在吸顶线上、随滚动零位移；
    负 margin 同时把不透明底条向上延伸，盖住吸顶线之上的让位空间，菜单项
    只能从条的下缘滚入、被完全盖住（隐形接缝）。padding-top 等量增加，
    胶囊自身的视觉位置不变。
    - 移动端抽屉（<960px）：吸顶线 = 抽屉顶部（32 − 32 = 0）；
    - 桌面端（≥960px）：custom.css §18 把吸顶线换算到导航条下缘
      （top = margin-top = 导航条高 56 − 让位高度 76 = −20），
      悬浮态再归零钉在悬浮面板顶。 */
.sn-end-switch {
  position: sticky;
  top: -32px;
  z-index: 3;
  margin: -32px 0 6px;
  padding: 38px 6px 8px;
  /* 非悬浮：与侧栏同色 —— 隐形接缝，菜单项不会穿过胶囊区域 */
  background: #f8f8f8;
}
/* 悬浮：与玻璃面板同材质 —— 面板上不可见，滚过的菜单项被磨砂盖住 */
.dark .sn-end-switch {
  background: var(--vp-c-bg);
}
/* 内层胶囊：磨砂玻璃质感（不再是灰底） */
.sn-end-switch__pill {
  position: relative;
  display: grid;
  grid-template-columns: 1fr 1fr;
  padding: 4px;
  border-radius: 999px;
  /* 实心底：菜单项滚过胶囊时不透出。 */
  border: 1px solid var(--sn-web-color-border-default, var(--vp-c-divider));
  background: var(--sn-web-color-background-subtle, var(--vp-c-bg-soft));
}

/* 滑块：back-out 曲线自带 ~10% 过冲后落位（回弹） */
.dark .sn-end-switch__pill {
  border-color: rgb(255 255 255 / 0.1);
  background: var(--sn-web-color-background-subtle, var(--vp-c-bg-soft));
}

.sn-end-switch__thumb {
  position: absolute;
  top: 4px;
  bottom: 4px;
  left: 4px;
  width: calc(50% - 4px);
  border-radius: 999px;
  background: var(--sn-web-color-background-surface, var(--vp-c-bg));
  box-shadow:
    0 2px 8px rgb(15 23 42 / 0.12),
    0 0 0 1px rgb(15 23 42 / 0.04);
  transform: translateX(0);
  transition: transform 480ms cubic-bezier(0.34, 1.56, 0.64, 1);
}
.sn-end-switch__thumb--uni {
  transform: translateX(100%);
}

.sn-end-switch__opt {
  position: relative;
  z-index: 1;
  height: 30px;
  border: 0;
  border-radius: 999px;
  background: transparent;
  color: var(--sn-web-color-text-secondary, var(--vp-c-text-2));
  font-size: 12.5px;
  font-weight: 500;
  white-space: nowrap;
  cursor: pointer;
  transition: color 0.2s;
}
.sn-end-switch__opt--on {
  color: var(--sn-web-color-action-primary, var(--vp-c-brand-1));
  font-weight: 600;
}
</style>
