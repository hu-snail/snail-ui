<script setup lang="ts">
/**
 * Demo: SnPopselect — grouped options.
 *
 * Grouping is expressed as `{ label, children }`: an entry whose `children` is
 * a non-empty array becomes a non-selectable header row followed by its
 * leaves, in declaration order. Top-level bare values sit between groups
 * untouched, the group's own `value` is not part of the selection model, and a
 * disabled leaf inside a group is skipped by the keyboard highlight.
 */
import { computed, ref } from 'vue';
import { SnButton, SnPopselect } from '@snui/vue-web';
import type { SnPopselectValue, SnSelectOptionInput } from '@snui/vue-web';

const options: SnSelectOptionInput[] = [
  'All tasks',
  {
    // 分组头：children 非空即渲染为分组标题，value 不参与选中。
    label: 'General',
    children: [
      { label: 'Theme appearance', value: 'theme' },
      { label: 'Interface language', value: 'locale' },
      { label: 'Time zone', value: 'timezone' },
    ],
  },
  {
    label: 'Notifications',
    children: [
      { label: 'In-app message', value: 'inbox' },
      { label: 'Email', value: 'email' },
      { label: 'SMS', value: 'sms', disabled: true },
    ],
  },
  {
    label: 'Security',
    children: [
      { label: 'Two-factor auth', value: 'twoFactor' },
      { label: 'Signed-in devices', value: 'devices' },
    ],
  },
];

const labelOf: Record<string, string> = {
  'All tasks': 'All tasks',
  theme: 'Theme appearance',
  locale: 'Interface language',
  timezone: 'Time zone',
  inbox: 'In-app message',
  email: 'Email',
  sms: 'SMS (disabled)',
  twoFactor: 'Two-factor auth',
  devices: 'Signed-in devices',
};

const selected = ref<SnPopselectValue>('inbox');

const selectedLabel = computed(() =>
  selected.value === null
    ? 'Not selected'
    : (labelOf[String(selected.value)] ?? String(selected.value)),
);
</script>

<template>
  <div class="popselect-groups-demo">
    <div class="popselect-groups-demo__row">
      <SnPopselect v-model:value="selected" :options="options" placement="bottom">
        <SnButton>Selected:{{ selectedLabel }}</SnButton>
      </SnPopselect>
      <span class="popselect-groups-demo__state">value = {{ selected ?? 'null' }}</span>
    </div>

    <p class="popselect-groups-demo__hint">
      Group headers are visual separators only: not selectable and skipped by keyboard highlight;
      "SMS" inside the group is disabled and ↑ / ↓ skips it. Bare values ("All tasks") can mix with
      groups, in the same order as declared in options.
    </p>
  </div>
</template>

<style scoped>
.popselect-groups-demo {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.popselect-groups-demo__row {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
}

.popselect-groups-demo__state,
.popselect-groups-demo__hint {
  margin: 0;
  font-size: 12px;
  color: var(--sn-web-color-text-tertiary, #8f939c);
}
</style>
