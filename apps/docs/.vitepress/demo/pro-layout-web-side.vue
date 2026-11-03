<script setup lang="ts">
/** Demo: SnProLayout — side 形态（经典侧栏：logo + 纵向菜单 + 顶栏）。 */
import { markRaw, ref } from 'vue';
import { Bell, Home, Settings, ShieldCheck, Users } from 'lucide-vue-next';
import { SnProLayout } from '@snui/admin-layout';
import type { SnMenuOption } from '@snui/vue-web';

const activeKey = ref('home');
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
      layout="side"
      title="Snail Admin"
      :menus="menus"
      :active-key="activeKey"
      :fixed="false"
      @select="onSelect"
    >
      <template #actions>
        <span class="bell"><Bell :size="16" /></span>
        <span class="avatar" aria-hidden="true">M</span>
      </template>

      <div class="page">
        <h3>工作台</h3>
        <p>当前菜单：<code>{{ activeKey }}</code>。面包屑由菜单路径自动推导；点菜单后的跳转由宿主 router 完成。</p>
      </div>

      <template #footer>
        <span class="footnote">© snail-aui · @snui/admin-layout</span>
      </template>
    </SnProLayout>
  </div>
</template>

<style scoped>
.shell {
  height: 420px;
  border: 1px solid var(--sn-web-color-border-subtle);
  border-radius: 8px;
  overflow: hidden;
}

.bell {
  display: inline-flex;
  padding: 6px;
  border-radius: 6px;
  color: var(--sn-web-color-text-secondary);
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

.footnote {
  color: var(--sn-web-color-text-tertiary);
  font-size: 12px;
}
</style>
