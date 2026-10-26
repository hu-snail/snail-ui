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
  const ok = window.confirm('This form has unsaved changes. Leave anyway?');
  record(`${ok ? 'Allow' : 'Block'} switching to ${String(name)}`);
  return ok;
}
</script>

<template>
  <div class="tabs-bl">
    <label class="tabs-bl__toggle">
      <input v-model="dirty" type="checkbox" />
      Simulate unsaved changes (dirty)
    </label>

    <SnTabs v-model:value="active" type="line" :on-before-leave="onBeforeLeave">
      <SnTabPane name="a" tab="Basic info">Basic info form</SnTabPane>
      <SnTabPane name="b" tab="Advanced settings">Advanced settings form</SnTabPane>
      <SnTabPane name="c" tab="Permissions">Permission settings</SnTabPane>
    </SnTabs>

    <ul class="tabs-bl__log">
      <li v-for="(e, i) in log" :key="i">
        <code>{{ e }}</code>
      </li>
      <li v-if="!log.length" class="tabs-bl__empty">No records yet</li>
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
