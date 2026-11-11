<script setup lang="ts">
/** Demo: SnForm — validateTrigger blur / change. */
import { reactive } from 'vue';
import { SnForm, SnFormItem, SnInput } from '@snui/vue-web';
import type { FormRule } from '@snui/vue-web';

const onBlur = reactive({ a: '' });
const onChange = reactive({ a: '' });

const onBlurRules: Record<string, FormRule[]> = {
  a: [{ required: true, message: 'Required on blur' }],
};
const onChangeRules: Record<string, FormRule[]> = {
  a: [{ required: true, message: 'Required on every change' }],
};
</script>

<template>
  <div class="sn-demo-grid">
    <section>
      <h4>validateTrigger="blur" (default)</h4>
      <SnForm :model="onBlur" :rules="onBlurRules">
        <SnFormItem prop="a" label="Email">
          <SnInput v-model="onBlur.a" />
        </SnFormItem>
      </SnForm>
      <p class="sn-demo__hint">Touch the field, leave it empty, then blur → message appears.</p>
    </section>

    <section>
      <h4>validateTrigger="change"</h4>
      <SnForm :model="onChange" :rules="onChangeRules">
        <SnFormItem prop="a" label="Email">
          <SnInput v-model="onChange.a" />
        </SnFormItem>
      </SnForm>
      <p class="sn-demo__hint">Type a character → message updates immediately.</p>
    </section>
  </div>
</template>

<style scoped>
.sn-demo-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 24px;
}
.sn-demo-grid section h4 {
  margin: 0 0 12px;
  font-size: 13px;
  font-weight: 600;
  color: var(--vp-c-text-2);
}
.sn-demo__hint {
  margin-top: 12px;
  font-size: 12px;
  color: var(--vp-c-text-2);
}
</style>
