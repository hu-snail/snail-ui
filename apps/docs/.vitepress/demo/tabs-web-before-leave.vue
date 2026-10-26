<script setup lang="ts">
/**
 * tabs-web-before-leave — guarding a tab switch before it happens.
 */
import { ref } from 'vue';
import { SnTabPane, SnTabs } from '@snui/vue-web';

const active = ref('a');
const dirty = ref(true);
const log = ref<string[]>([]);

function record(msg: string): void {
  log.value = [msg, ...log.value].slice(0, 4);
}

async function onBeforeLeave(name: string | number): Promise<boolean> {
  if (!dirty.value) return true;
  // Stand in for a confirm dialog: keep the switch when the user says yes.
  const ok = window.confirm('当前表单有未保存的修改，确定要离开吗？');
  record(`${ok ? '允许' : '阻止'}切换到 ${String(name)}`);
  return ok;
}
</script>

<template>
  <div class="tabs-bl">
    <label class="tabs-bl__toggle">
      <input v-model="dirty" type="checkbox" />
      模拟未保存的修改（dirty）
    </label>

    <SnTabs v-model:value="active" type="line" :on-before-leave="onBeforeLeave">
      <SnTabPane name="a" tab="基本信息">基本信息表单</SnTabPane>
      <SnTabPane name="b" tab="高级设置">高级设置表单</SnTabPane>
      <SnTabPane name="c" tab="权限">权限配置</SnTabPane>
    </SnTabs>

    <ul class="tabs-bl__log">
      <li v-for="(e, i) in log" :key="i">
        <code>{{ e }}</code>
      </li>
      <li v-if="!log.length" class="tabs-bl__empty">暂无记录</li>
    </ul>
  </div>
</template>

<style scoped>
.tabs-bl {
  display: flex;
  flex-direction: column;
  gap: 14px;
  width: 100%;
}
.tabs-bl__toggle {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: var(--sn-web-color-text-secondary);
}
.tabs-bl__log {
  margin: 0;
  padding-left: 18px;
  font-size: 13px;
  color: var(--sn-web-color-text-secondary);
  min-height: 24px;
}
.tabs-bl__empty {
  list-style: none;
  margin-left: -18px;
  color: var(--sn-web-color-text-tertiary);
}
</style>
