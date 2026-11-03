<script setup lang="ts">
/** Demo: SnProLayout — v-model:layout 形态切换（宿主设置面板的切换器）。 */
import { markRaw, ref } from 'vue';
import { Home, Settings, ShieldCheck, Users } from 'lucide-vue-next';
import { SnProLayout } from '@snui/admin-layout';
import type { SnProLayoutMode } from '@snui/admin-layout';
import { SnRadioGroup } from '@snui/vue-web';
import type { SnMenuOption } from '@snui/vue-web';

const layout = ref<SnProLayoutMode>('side');
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
  <div class="switcher">
    <SnRadioGroup v-model="layout" button size="small" :options="['side', 'top', 'mix', 'dual']" />
  </div>

  <div class="shell">
    <SnProLayout
      v-model:layout="layout"
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
        <h3>四种形态，同一份菜单</h3>
        <p>切换上面的 <code>layout</code> 值——几何与菜单位置由布局壳接管，业务零改动。</p>
      </div>
    </SnProLayout>
  </div>
</template>

<style scoped>
.switcher {
  margin-bottom: 12px;
}

.shell {
  height: 400px;
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
