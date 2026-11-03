<script setup lang="ts">
/** Demo: SnProLayout — mix 形态（顶部一级菜单 + 侧栏二级联动，vben mixed-nav）。 */
import { markRaw, ref } from 'vue';
import { Home, Settings, ShieldCheck, Users } from 'lucide-vue-next';
import { SnProLayout } from '@snui/admin-layout';
import type { SnMenuOption } from '@snui/vue-web';

const activeKey = ref('user');
const menus: SnMenuOption[] = [
  { key: 'home', label: '首页', icon: markRaw(Home) },
  {
    key: 'system',
    label: '系统管理',
    icon: markRaw(Settings),
    children: [
      { key: 'user', label: '用户管理', icon: markRaw(Users) },
      { key: 'role', label: '角色权限', icon: markRaw(ShieldCheck) },
    ],
  },
];

function onSelect(key: string | number | null): void {
  if (typeof key === 'string') activeKey.value = key;
}
</script>

<template>
  <div class="shell">
    <SnProLayout
      layout="mix"
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
        <h3>用户管理</h3>
        <p>点顶部「系统管理」或侧栏项：侧栏只显示当前一级的子级；一级没有子级时侧栏自动收起。</p>
      </div>
    </SnProLayout>
  </div>
</template>

<style scoped>
.shell {
  height: 380px;
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
  margin: 0;
  color: var(--sn-web-color-text-tertiary);
  font-size: 13px;
}
</style>
