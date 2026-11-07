<script setup lang="ts">
/**
 * Demo: SnProLayout — v-model:layout 形态切换（宿主设置面板的切换器）。
 *
 * 内容区是通用工作台（`@snui/admin-layout/workbench`）：切换上面四种形态时，
 * 工作台里的数字与图表一个都不动 —— 几何与菜单位置由壳接管，业务零改动。
 */
import { markRaw, ref } from 'vue';
import { Home, Settings, ShieldCheck, Users } from 'lucide-vue-next';
import { SnProLayout } from '@snui/admin-layout';
import type { SnProLayoutMode } from '@snui/admin-layout';
import { ProWorkbench } from '@snui/admin-layout/workbench';
import { SnRadioGroup } from '@snui/vue-web';
import type { SnMenuOption } from '@snui/vue-web';
import {
  demoIncomeSources,
  demoKpis,
  demoMoneyFlow,
  demoTransactions,
} from '../utils/workbench-demo';

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

      <ProWorkbench
        :kpis="demoKpis"
        :money-flow="demoMoneyFlow"
        :income-sources="demoIncomeSources"
        :transactions="demoTransactions"
        title="工作台"
        subtitle="四种形态，同一份菜单与同一屏内容：切换只动几何。"
        :chart-height="260"
      />
    </SnProLayout>
  </div>
</template>

<style scoped>
.switcher {
  margin-bottom: 12px;
}

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