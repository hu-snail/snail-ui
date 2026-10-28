<script setup lang="ts">
/** Demo: SnForm — 综合场景:将选择器 / 单选 / 多选 / 日期 / 时间 / 日历
 *  等字段型组件编排进同一个表单,统一校验 + 提交。 */
import { computed, reactive, ref } from 'vue';
import {
  SnButton,
  SnCalendar,
  SnCheckbox,
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
  activeDay: null as number | null,
  note: '',
});

const rules: Record<string, FormRule[]> = {
  name: [{ required: true, message: '请填写姓名' }],
  city: [{ required: true, message: '请选择城市' }],
  type: [{ required: true, message: '请选择类型' }],
  tags: [{ required: true, message: '至少选择一个标签' }],
  birthday: [{ required: true, message: '请选择生日' }],
};

const cityOptions = ['北京', '上海', '广州', '深圳'];
const typeOptions = [
  { label: '个人版', value: 'personal' },
  { label: '团队版', value: 'team' },
];
const tagOptions = ['设计师', '前端', '产品', '运营'];

const last = ref<string | null>(null);
const submitCount = ref(0);

const summary = computed(() =>
  [
    `城市:${form.city ?? '—'}`,
    `类型:${typeOptions.find((o) => o.value === form.type)?.label ?? '—'}`,
    `标签:${form.tags.length > 0 ? form.tags.join(' / ') : '—'}`,
    `人数:${form.headcount}`,
    `生日:${form.birthday ? new Date(form.birthday).toLocaleDateString() : '—'}`,
    `提醒时间:${form.reminder ? new Date(form.reminder).toLocaleTimeString() : '—'}`,
    `关注日期:${form.activeDay ? new Date(form.activeDay).toLocaleDateString() : '—'}`,
  ].join('\n'),
);

function onSubmit(payload: { valid: boolean }): void {
  if (!payload.valid) return;
  submitCount.value += 1;
  last.value = JSON.stringify(
    { ...form, activeDayLabel: form.activeDay ? new Date(form.activeDay).toDateString() : null },
    null,
    2,
  );
}
</script>

<template>
  <div class="sn-form-demo">
    <SnForm :model="form" :rules="rules" label-width="88" @submit="onSubmit">
      <SnFormItem prop="name" label="姓名" required>
        <SnInput v-model="form.name" placeholder="Your name" />
      </SnFormItem>

      <SnFormItem prop="city" label="城市" required>
        <SnSelect v-model="form.city" :options="cityOptions" placeholder="选择城市" />
      </SnFormItem>

      <SnFormItem prop="type" label="版本" required>
        <SnRadioGroup v-model="form.type" name="plan-type" :options="typeOptions" />
      </SnFormItem>

      <SnFormItem prop="tags" label="职能" required>
        <SnCheckboxGroup v-model="form.tags" :options="tagOptions" />
      </SnFormItem>

      <SnFormItem prop="headcount" label="团队人数">
        <SnInputNumber v-model="form.headcount" :min="1" :max="99" />
      </SnFormItem>

      <SnFormItem prop="birthday" label="生日" required>
        <SnDatePicker v-model="form.birthday" placeholder="选择日期" />
      </SnFormItem>

      <SnFormItem prop="reminder" label="提醒时间">
        <SnTimePicker v-model="form.reminder" placeholder="选择时间" />
      </SnFormItem>

      <SnFormItem prop="remind" label="接收提醒">
        <SnSwitch v-model="form.remind" />
      </SnFormItem>

      <SnFormItem prop="activeDay" label="关注日期" description="内联日历,点选一天作为关注日。">
        <SnCalendar v-model:value="form.activeDay" />
      </SnFormItem>

      <SnFormItem prop="note" label="备注" label-position="top">
        <SnInput v-model="form.note" type="textarea" :rows="2" placeholder="补充信息(选填)" />
      </SnFormItem>

      <div class="sn-form-demo__actions">
        <SnButton type="primary" html-type="submit">提交表单</SnButton>
        <span class="sn-form-demo__count">提交 {{ submitCount }} 次</span>
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
