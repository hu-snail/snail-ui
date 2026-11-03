<script setup lang="ts">
/** Demo: SnProLayout — 静态路由读取（routesToMenuOptions：meta.title/icon/hidden/order）。 */
import { markRaw, ref } from 'vue';
import { Home, Settings, ShieldCheck, Users } from 'lucide-vue-next';
import { SnProLayout, routesToMenuOptions } from '@snui/admin-layout';
import type { RouteLike } from '@snui/admin-layout';

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

      <div class="page">
        <h3>路由表即菜单</h3>
        <p>
          无标题的 redirect 父级被折叠、<code>hidden</code> 子树被剔除、
          <code>order</code> 决定同级顺序——菜单完全由路由元信息推导。
        </p>
        <pre class="derived">{{ derived }}</pre>
      </div>
    </SnProLayout>
  </div>
</template>

<style scoped>
.shell {
  height: 460px;
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

.page h3 {
  margin: 0 0 8px;
  font-size: 16px;
}

.page p {
  margin: 0 0 12px;
  color: var(--sn-web-color-text-tertiary);
  font-size: 13px;
}

.derived {
  margin: 0;
  padding: 10px 12px;
  max-height: 180px;
  overflow: auto;
  border-radius: 6px;
  background: var(--sn-web-color-background-subtle);
  color: var(--sn-web-color-text-secondary);
  font-size: 12px;
  line-height: 1.6;
}
</style>
