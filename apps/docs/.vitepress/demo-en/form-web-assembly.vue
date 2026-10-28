<script setup lang="ts">
/** Demo: SnForm — composite form: selectors / radio / checkbox / date /
 *  time fields orchestrated in one form with shared validation and submit. */
import { computed, reactive, ref } from 'vue';
import {
  SnButton,
  SnCheckboxGroup,
  SnDatePicker,
  SnForm,
  SnFormItem,
  SnInput,
  SnInputNumber,
  SnRadioGroup,
  SnSelect,
  SnSwitch,
  SnTimePicker,
} from '@snui/vue-web';
import type { FormRule } from '@snui/vue-web';

const form = reactive({
  name: '',
  city: null as string | null,
  type: 'personal',
  tags: ['designer'] as string[],
  headcount: 1,
  birthday: null as number | null,
  reminder: null as number | null,
  remind: true,
  note: '',
});

const rules: Record<string, FormRule[]> = {
  name: [{ required: true, message: 'Name is required' }],
  city: [{ required: true, message: 'Pick a city' }],
  type: [{ required: true, message: 'Pick a plan' }],
  tags: [{ required: true, message: 'Pick at least one role' }],
  birthday: [{ required: true, message: 'Pick a birthday' }],
};

const cityOptions = ['北京', '上海', '广州', '深圳'];
const typeOptions = [
  { label: 'Personal', value: 'personal' },
  { label: 'Team', value: 'team' },
];
const tagOptions = ['Designer', 'Frontend', 'Product', 'Ops'];

const last = ref<string | null>(null);
const submitCount = ref(0);

const summary = computed(() =>
  [
    `City: ${form.city ?? '—'}`,
    `Plan: ${typeOptions.find((o) => o.value === form.type)?.label ?? '—'}`,
    `Roles: ${form.tags.length > 0 ? form.tags.join(' / ') : '—'}`,
    `Headcount: ${form.headcount}`,
    `Birthday: ${form.birthday ? new Date(form.birthday).toLocaleDateString() : '—'}`,
    `Reminder: ${form.reminder ? new Date(form.reminder).toLocaleTimeString() : '—'}`,
  ].join('\n'),
);

function onSubmit(payload: { valid: boolean }): void {
  if (!payload.valid) return;
  submitCount.value += 1;
  last.value = JSON.stringify({ ...form }, null, 2);
}
</script>

<template>
  <div class="sn-form-demo">
    <SnForm :model="form" :rules="rules" label-width="88" @submit="onSubmit">
      <SnFormItem prop="name" label="Name" required>
        <SnInput v-model="form.name" placeholder="Your name" />
      </SnFormItem>

      <SnFormItem prop="city" label="City" required>
        <SnSelect v-model="form.city" :options="cityOptions" placeholder="Pick a city" />
      </SnFormItem>

      <SnFormItem prop="type" label="Plan" required>
        <SnRadioGroup v-model="form.type" name="plan-type" :options="typeOptions" />
      </SnFormItem>

      <SnFormItem prop="tags" label="Roles" required>
        <SnCheckboxGroup v-model="form.tags" :options="tagOptions" />
      </SnFormItem>

      <SnFormItem prop="headcount" label="Headcount">
        <SnInputNumber v-model="form.headcount" :min="1" :max="99" />
      </SnFormItem>

      <SnFormItem prop="birthday" label="Birthday" required>
        <SnDatePicker v-model="form.birthday" placeholder="Pick a date" />
      </SnFormItem>

      <SnFormItem prop="reminder" label="Reminder">
        <SnTimePicker v-model="form.reminder" placeholder="Pick a time" />
      </SnFormItem>

      <SnFormItem prop="remind" label="Notify me">
        <SnSwitch v-model="form.remind" />
      </SnFormItem>

      <SnFormItem prop="note" label="Note" label-position="top">
        <SnInput v-model="form.note" type="textarea" :rows="2" placeholder="Optional" />
      </SnFormItem>

      <div class="sn-form-demo__actions">
        <SnButton type="primary" html-type="submit">Submit</SnButton>
        <span class="sn-form-demo__count">Submitted {{ submitCount }}×</span>
      </div>
    </SnForm>

    <pre class="sn-form-demo__summary">{{ summary }}</pre>
    <pre v-if="last" class="sn-form-demo__log">{{ last }}</pre>
  </div>
</template>

<style scoped>
.sn-form-demo {
  max-width: 520px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.sn-form-demo__actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.sn-form-demo__count {
  font-size: 12px;
  color: var(--vp-c-text-3, var(--sn-web-color-text-tertiary, #909399));
}

.sn-form-demo__summary,
.sn-form-demo__log {
  margin: 0;
  padding: 12px;
  background: var(--vp-c-bg-soft);
  border-radius: 6px;
  font-size: 12px;
  line-height: 1.7;
  color: var(--vp-c-text-2);
  white-space: pre-wrap;
}
</style>
