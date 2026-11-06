<script setup lang="ts">
/**
 * SnSidebarBrand — 悬浮侧栏面板顶部的品牌行（logo + 标题）。
 *
 * 仅在桌面悬浮态（≥960px 且 body.sn-nav-floating）显示，随面板 sticky
 * 钉在顶部；胶囊（SnSidebarEndSwitch）的吸顶线由 custom.css 按
 * --sn-sidebar-brand-h 下移一行，两段吸顶条堆叠、零滑动。
 * 移动端抽屉 / 非悬浮态由组件内 display:none 隐藏——首页导航岛里的
 * 品牌不受影响（首页行为保持不变）。
 */
import { useRoute, useRouter } from 'vitepress';
import { Snail } from 'lucide-vue-next';

const route = useRoute();
const router = useRouter();

/** 回首页：/en/ 语区回到 /en/，其余回到 /。 */
function goHome(): void {
  const base = route.path.startsWith('/en') ? '/en' : '';
  void router.go(`${base}/`);
}
</script>

<template>
  <a
    class="sn-sidebar-brand"
    :aria-label="route.path.startsWith('/en') ? 'Home' : '首页'"
    href="/"
    @click.prevent="goHome"
  >
    <span class="sn-sidebar-brand__icon" aria-hidden="true">
      <Snail :size="18" :stroke-width="2" />
    </span>
    <span class="sn-sidebar-brand__title">snail-aui</span>
  </a>
</template>

<style scoped>
/* 默认隐藏：仅 custom.css §18 的桌面悬浮态规则将其展开为吸顶品牌行 */
.sn-sidebar-brand {
  display: none;
}
</style>
