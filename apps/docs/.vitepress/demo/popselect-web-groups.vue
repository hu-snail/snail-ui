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
  '全部任务',
  {
    // 分组头：children 非空即渲染为分组标题，value 不参与选中。
    label: '基础设置',
    children: [
      { label: '主题外观', value: 'theme' },
      { label: '界面语言', value: 'locale' },
      { label: '时区', value: 'timezone' },
    ],
  },
  {
    label: '通知设置',
    children: [
      { label: '站内信', value: 'inbox' },
      { label: '邮件', value: 'email' },
      { label: '短信', value: 'sms', disabled: true },
    ],
  },
  {
    label: '安全设置',
    children: [
      { label: '两步验证', value: 'twoFactor' },
      { label: '登录设备', value: 'devices' },
    ],
  },
];

const labelOf: Record<string, string> = {
  全部任务: '全部任务',
  theme: '主题外观',
  locale: '界面语言',
  timezone: '时区',
  inbox: '站内信',
  email: '邮件',
  sms: '短信（禁用）',
  twoFactor: '两步验证',
  devices: '登录设备',
};

const selected = ref<SnPopselectValue>('inbox');

const selectedLabel = computed(() =>
  selected.value === null ? '未选择' : (labelOf[String(selected.value)] ?? String(selected.value)),
);
</script>

<template>
  <div class="popselect-groups-demo">
    <div class="popselect-groups-demo__row">
      <SnPopselect v-model:value="selected" :options="options" placement="bottom">
        <SnButton>已选：{{ selectedLabel }}</SnButton>
      </SnPopselect>
      <span class="popselect-groups-demo__state">value = {{ selected ?? 'null' }}</span>
    </div>

    <p class="popselect-groups-demo__hint">
      分组标题只作为视觉分隔，不可选中、也不会进入键盘高亮序列；组内「短信」为禁用项，↑ / ↓
      会直接跳过它。裸值（「全部任务」）与分组可以混排，顺序与 options 声明一致。
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
