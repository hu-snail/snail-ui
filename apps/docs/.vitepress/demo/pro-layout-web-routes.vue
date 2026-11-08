<script setup lang="ts">
/**
 * Demo: SnProLayout — 静态路由读取（routesToMenuOptions：meta.title/icon/hidden/order）。
 *
 * 内容区是通用工作台（`@snui/admin-layout/workbench`，接 ECharts）；推导出的菜单结构
 * 折在壳下方的 `<details>` 里，不再占用内容区 —— 壳与内容各司其职。
 */
import { markRaw, ref } from 'vue';
import { Home, Settings, ShieldCheck, Users } from 'lucide-vue-next';
import { SnProLayout, routesToMenuOptions } from '@snui/admin-layout';
import type { RouteLike } from '@snui/admin-layout';
import { ProWorkbench } from '@snui/admin-layout/workbench';
import {
  demoIncomeSources,
  demoKpis,
  demoMoneyFlow,
  demoTransactions,
} from '../utils/workbench-demo';

// 宿主自己的静态路由表 —— 本地写法与 vue-router 的 RouteRecordRaw 同构
const routes: RouteLike[] = [
  { path: '/', redirect: '/home' },
  { name: 'home', path: '/home', meta: { title: '首页', icon: 'home', order: 1 } },
  { name: 'audit', path: '/audit', meta: { title: '审计日志（不进菜单）', hidden: true } },
  {
    path: '/system',
    meta: { icon: 'settings', order: 9 },
    children: [
      { name: 'user', path: '/system/user', meta: { title: '用户管理', icon: 'users' } },
      { name: 'role', path: '/system/role', meta: { title: '角色权限', icon: 'shield' } },
    ],
  },
];

const menus = routesToMenuOptions(routes, {
  iconMap: {
    home: markRaw(Home),
    settings: markRaw(Settings),
    users: markRaw(Users),
    shield: markRaw(ShieldCheck),
  },
});

const activeKey = ref('user');

// 展示用投影：icon 字段是图标组件，序列化成噪音，只留结构。
const derived = JSON.stringify(
  menus.map(({ key, label, children }) => ({ key, label, children })),
  null,
  2,
);

function onSelect(key: string | number | null): void {
  if (typeof key === 'string') activeKey.value = key;
}
</script>

<template>
  <div class="shell">
    <SnProLayout
      layout="side"
      title="Snail Admin"
      :menus="menus"
      :active-key="activeKey"
      :fixed="false"
      @select="onSelect"
    >
      <template #actions>
        <span class="avatar" aria-hidden="true">M</span>
      </template>

      <ProWorkbench
        :kpis="demoKpis"
        :money-flow="demoMoneyFlow"
        :income-sources="demoIncomeSources"
        :transactions="demoTransactions"
        title="工作台"
        subtitle="菜单由路由表推导：redirect 父级折叠、hidden 剔除、order 排序。"
        :chart-height="260"
      />
      <details class="derived-wrap">
        <summary>查看推导出的菜单结构</summary>
        <pre class="derived">{{ derived }}</pre>
      </details>
    </SnProLayout>
  </div>
</template>

<style scoped>
.shell {
  height: clamp(560px, 78vh, 900px);
  border: 1px solid var(--sn-web-color-border-subtle);
  border-radius: 8px;
  overflow: hidden;
}

.avatar {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: var(--sn-web-color-action-primary);
  color: var(--sn-web-color-text-on-primary);
  font-size: 13px;
  font-weight: 600;
}

/* 推导结果折在壳外：内容区留给工作台，这块只是「怎么看出来的」注解。 */
.derived-wrap {
  margin-top: 10px;
  font-size: 12px;
}

.derived-wrap summary {
  cursor: pointer;
  color: var(--sn-web-color-text-tertiary);
}

.derived {
  margin: 8px 0 0;
  padding: 10px 12px;
  max-height: 200px;
  overflow: auto;
  border-radius: 6px;
  background: var(--sn-web-color-background-subtle);
  color: var(--sn-web-color-text-secondary);
  font-size: 12px;
  line-height: 1.6;
}
</style>
