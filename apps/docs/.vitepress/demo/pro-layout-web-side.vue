<script setup lang="ts">
/**
 * Demo: SnProLayout — side 形态（经典侧栏：logo + 纵向菜单 + 顶栏）。
 *
 * 内容区是**通用工作台**（`@snui/admin-layout/workbench`，接 ECharts），与 classic /
 * aurora 用的是同一份数据 —— 换壳不换内容，这就是「布局只负责壳」的可视证明。
 */
import { markRaw, ref } from 'vue';
import { Bell, Home, Settings, ShieldCheck, Users } from 'lucide-vue-next';
import { SnProLayout } from '@snui/admin-layout';
import { ProWorkbench } from '@snui/admin-layout/workbench';
import type { SnMenuOption } from '@snui/vue-web';
import {
  demoIncomeSources,
  demoKpis,
  demoMoneyFlow,
  demoTransactions,
} from '../utils/workbench-demo';

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

      <ProWorkbench
        :kpis="demoKpis"
        :money-flow="demoMoneyFlow"
        :income-sources="demoIncomeSources"
        :transactions="demoTransactions"
        title="工作台"
        subtitle="这里是今天的经营概览；面包屑由菜单路径自动推导。"
        :chart-height="260"
      />
    </SnProLayout>
  </div>
</template>

<style scoped>
/* 真实比例：接近一屏的后台窗口，不是一块被压扁的示例板。 */
.shell {
  height: clamp(560px, 78vh, 900px);
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
</style>
