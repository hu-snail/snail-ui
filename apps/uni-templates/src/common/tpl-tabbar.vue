<script setup lang="ts">
/**
 * 模板工程底部标签栏 —— 4 个主页（模板 / 探索 / 收藏 / 我的）共用。
 *
 * 原生 tabBar（`pages.json` 的 `tabBar`）已退役：组件化标签栏才能与模板
 * 自己的 `--tplh-*` 主题变量、暗色模式（`.sn-theme-dark`）和图标注册表
 * 同一套体系——原生栏只吃 `pages.json` 里的静态色值与 PNG 位图，暗色切换
 * 还得靠 `uni.setTabBarStyle` 额外同步。
 *
 * 页面切换语义：没有原生 tabBar 后四个页面是平级普通页，
 * `uni.switchTab` 失效，改用 `uni.redirectTo`——替换当前页、不留历史栈，
 * 观感与原生标签切换一致（返回手势不会退回上一标签）。
 *
 * 布局：`fixed`（默认）时组件自带等高占位（`placeholder`），页面内容自然
 * 为其让位；放进 `sn-paging` 的 `#bottom` 插槽时传 `:fixed="false"`——
 * 那个插槽本身就是占位区。
 *
 * 图标走模板工程的注册表（`App.vue` 的 `registerSnIcons`），与页面内
 * `SnIcon` 同名解析：`layout-grid`（模板）/ `search`（探索）/ `heart`
 * （收藏）/ `user`（我的）。原生栏的 PNG（`static/tab-*.png`）不再使用。
 */
import SnTabbar from '@snui/uni-src/components/sn-tabbar/sn-tabbar.vue';
import SnTabbarItem from '@snui/uni-src/components/sn-tabbar/sn-tabbar-item.vue';

/** 标签定义：顺序即索引，`active` 用它对齐。 */
const TABS = [
  { label: '模板', icon: 'layout-grid', path: '/pages/index/index' },
  { label: '探索', icon: 'search', path: '/pages/explore/explore' },
  { label: '收藏', icon: 'heart', path: '/pages/favorites/favorites' },
  { label: '我的', icon: 'user', path: '/pages/profile/profile' },
] as const;

const props = withDefaults(
  defineProps<{
    /** 当前激活标签索引（页面自己声明，避免依赖路由判断）。 */
    active?: number;
    /** 固定底部并自带等高占位；`sn-paging` 的 `#bottom` 插槽里传 false。 */
    fixed?: boolean;
  }>(),
  { active: 0, fixed: true },
);

function onTabChange(payload: { value: number | string }): void {
  const index = Number(payload.value);
  const tab = TABS[index];
  // 点当前标签不重复跳转（原生 tabBar 同样不动作）。
  if (tab === undefined || index === props.active) return;
  uni.redirectTo({ url: tab.path });
}
</script>

<template>
  <SnTabbar
    :fixed="fixed"
    :placeholder="fixed"
    bordered
    safe-area-inset-bottom
    :model-value="active"
    active-color="var(--tplh-accent)"
    inactive-color="var(--tplh-text-3)"
    custom-style="--sn-tabbar-bar-bg: var(--tplh-card);"
    @change="onTabChange"
  >
    <SnTabbarItem v-for="tab in TABS" :key="tab.label" :title="tab.label" :icon="tab.icon" />
  </SnTabbar>
</template>
