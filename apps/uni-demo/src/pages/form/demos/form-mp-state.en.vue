<script setup lang="ts">
/**
 * Demo: sn-form — validation states and display strategies.
 *
 * Four forms share one required rule but differ in how the failure is shown:
 * inline message / statusIcon glyph / showMessage=false / errorType=none.
 * Hiding or silencing only affects the display — the `validate()` return value
 * always reports the real result.
 */
import { reactive, ref } from 'vue';
import SnButton from '@snui/uni-src/components/sn-button/sn-button.vue';
import SnForm from '@snui/uni-src/components/sn-form/sn-form.vue';
import SnFormItem from '@snui/uni-src/components/sn-form/sn-form-item.vue';
import SnInput from '@snui/uni-src/components/sn-input/sn-input.vue';
import type { Ref } from 'vue';
import type { FormRule } from '@snui/uni-src/components/sn-form/sn-form-types';

type FormRef = InstanceType<typeof SnForm>;

const basicForm = reactive({ email: '' });
const iconForm = reactive({ email: '' });
const hiddenForm = reactive({ email: '' });
const silentForm = reactive({ email: '' });

const basicRef = ref<FormRef | null>(null);
const iconRef = ref<FormRef | null>(null);
const hiddenRef = ref<FormRef | null>(null);
const silentRef = ref<FormRef | null>(null);

const basicResult = ref('');
const iconResult = ref('');
const hiddenResult = ref('');
const silentResult = ref('');

const rules: Record<string, FormRule[]> = {
  email: [{ required: true, message: 'Email is required' }],
};

const panels: Array<{ form: Ref<FormRef | null>; result: Ref<string> }> = [
  { form: basicRef, result: basicResult },
  { form: iconRef, result: iconResult },
  { form: hiddenRef, result: hiddenResult },
  { form: silentRef, result: silentResult },
];

function format(ok: boolean | undefined): string {
  return ok === true ? 'validate() → passed' : 'validate() → failed';
}

async function runAll(): Promise<void> {
  for (const panel of panels) {
    panel.result.value = format(await panel.form.value?.validate());
  }
}
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <SnButton type="primary" block @click="runAll">Validate every form</SnButton>

    <view class="sn-demo__grid">
      <view class="sn-demo__panel">
        <text class="sn-demo__title">Default: inline message under the field</text>
        <SnForm ref="basicRef" :model="basicForm" :rules="rules">
          <SnFormItem prop="email" label="Email">
            <SnInput
              v-model="basicForm.email"
              type="email"
              placeholder="Enter an email"
              clearable
            />
          </SnFormItem>
        </SnForm>
        <text class="sn-demo__meta">{{ basicResult || 'not validated yet' }}</text>
      </view>

      <view class="sn-demo__panel">
        <text class="sn-demo__title">statusIcon: glyph before the message</text>
        <SnForm ref="iconRef" :model="iconForm" :rules="rules" status-icon>
          <SnFormItem prop="email" label="Email">
            <SnInput v-model="iconForm.email" type="email" placeholder="Enter an email" clearable />
          </SnFormItem>
        </SnForm>
        <text class="sn-demo__meta">{{ iconResult || 'not validated yet' }}</text>
      </view>

      <view class="sn-demo__panel">
        <text class="sn-demo__title">showMessage=false: no message row</text>
        <SnForm ref="hiddenRef" :model="hiddenForm" :rules="rules" :show-message="false">
          <SnFormItem prop="email" label="Email">
            <SnInput
              v-model="hiddenForm.email"
              type="email"
              placeholder="Enter an email"
              clearable
            />
          </SnFormItem>
        </SnForm>
        <text class="sn-demo__meta">{{ hiddenResult || 'not validated yet' }}</text>
      </view>

      <view class="sn-demo__panel">
        <text class="sn-demo__title">errorType=none: silent validation</text>
        <SnForm ref="silentRef" :model="silentForm" :rules="rules" error-type="none">
          <SnFormItem prop="email" label="Email">
            <SnInput
              v-model="silentForm.email"
              type="email"
              placeholder="Enter an email"
              clearable
            />
          </SnFormItem>
        </SnForm>
        <text class="sn-demo__meta">{{ silentResult || 'not validated yet' }}</text>
      </view>
    </view>
  </view>
</template>

<style scoped>
.sn-demo--stack {
  display: flex;
  flex-direction: column;
  gap: var(--sn-mp-spacing-4);
  width: 100%;
}

.sn-demo__grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320rpx, 1fr));
  gap: var(--sn-mp-spacing-4);
}

.sn-demo__panel {
  display: flex;
  flex-direction: column;
  gap: var(--sn-mp-spacing-3);
  padding: var(--sn-mp-spacing-4);
  border: 2rpx solid var(--sn-mp-color-border-subtle);
  border-radius: var(--sn-mp-radius-lg);
  background-color: var(--sn-mp-color-background-surface);
}

.sn-demo__title {
  color: var(--sn-mp-color-text-secondary);
  font-size: var(--sn-mp-font-size-sm);
  font-weight: var(--sn-mp-font-weight-semibold);
}

.sn-demo__meta {
  color: var(--sn-mp-color-text-tertiary);
  font-size: var(--sn-mp-font-size-xs);
  line-height: var(--sn-mp-font-line-height-normal);
}
</style>
