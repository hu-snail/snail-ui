<script setup lang="ts">
/**
 * Demo: SnProLayout — mix 形态（顶部一级菜单 + 侧栏二级联动，vben mixed-nav）。
 *
 * 内容区是通用工作台（`@snui/admin-layout/workbench`），和另外三种形态同一份数据。
 */
import { markRaw, ref } from 'vue';
import { Home, Settings, ShieldCheck, Users } from 'lucide-vue-next';
import { SnProLayout } from '@snui/admin-layout';
import { ProWorkbench } from '@snui/admin-layout/workbench';
import type { SnMenuOption } from '@snui/vue-web';
import {
  demoIncomeSources,
  demoKpis,
  demoMoneyFlow,
  demoTransactions,
} from '../utils/workbench-demo';

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

      <ProWorkbench
        :kpis="demoKpis"
        :money-flow="demoMoneyFlow"
        :income-sources="demoIncomeSources"
        :transactions="demoTransactions"
        title="工作台"
        subtitle="点顶部一级或侧栏二级：侧栏只显示当前一级的子级，一级无子级时自动收起。"
        :chart-height="260"
      />
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
</style>
