<script setup lang="ts">
/**
 * Demo: sn-form — schema / center / titleWidth / layout.
 *
 * `title-width` shares the inheritance chain with `label-width` (title-width
 * wins), `layout` takes `horizontal` / `vertical` for label-vs-control
 * placement, `center` vertically centers the control column inside each cell,
 * and `schema` is a form-level validation description (this build stores it on
 * the context; actual validation still runs through `rules` / per-item rules).
 */
import { reactive } from 'vue';
import SnForm from '@snui/uni-src/components/sn-form/sn-form.vue';
import SnFormItem from '@snui/uni-src/components/sn-form/sn-form-item.vue';
import SnInput from '@snui/uni-src/components/sn-input/sn-input.vue';
import type { FormRule } from '@snui/uni-src/components/sn-form/sn-form-types';

const horizontal = reactive({ name: '', phone: '' });
const vertical = reactive({ name: '', phone: '' });
const centered = reactive({ name: '', phone: '' });
const silent = reactive({ name: '', phone: '' });

const rules: Record<string, FormRule[]> = {
  name: [{ required: true, message: 'Name is required' }],
  phone: [{ required: true, message: 'Phone is required' }],
};

/** Form-level schema: describes fields and validation intent; stored on the context. */
const schema = {
  name: { label: 'Name', required: true },
  phone: { label: 'Phone', required: true },
};
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <text class="sn-demo__title">titleWidth=160 + layout=horizontal (default)</text>
    <SnForm :model="horizontal" :rules="rules" :schema="schema" :title-width="160">
      <SnFormItem prop="name" label="Name">
        <SnInput v-model="horizontal.name" placeholder="Required" />
      </SnFormItem>
      <SnFormItem prop="phone" label="Phone">
        <SnInput v-model="horizontal.phone" placeholder="Required" />
      </SnFormItem>
    </SnForm>

    <text class="sn-demo__title">layout=vertical: the label stacks above the control</text>
    <SnForm :model="vertical" :rules="rules" layout="vertical" :title-width="200">
      <SnFormItem prop="name" label="Name">
        <SnInput v-model="vertical.name" placeholder="Required" />
      </SnFormItem>
      <SnFormItem prop="phone" label="Phone">
        <SnInput v-model="vertical.phone" placeholder="Required" />
      </SnFormItem>
    </SnForm>

    <text class="sn-demo__title"
      >center: the control column is vertically centered in each cell</text
    >
    <SnForm :model="centered" center :title-width="160">
      <SnFormItem prop="name" label="Name">
        <SnInput v-model="centered.name" placeholder="Required" />
      </SnFormItem>
      <SnFormItem prop="phone" label="Phone">
        <SnInput v-model="centered.phone" placeholder="Required" />
      </SnFormItem>
    </SnForm>

    <text class="sn-demo__title"
      >showMessage=false: validation still runs, the message line is not rendered</text
    >
    <SnForm :model="silent" :rules="rules" :show-message="false" :title-width="160">
      <SnFormItem prop="name" label="Name">
        <SnInput v-model="silent.name" placeholder="Blur while empty" />
      </SnFormItem>
      <SnFormItem prop="phone" label="Phone">
        <SnInput v-model="silent.phone" placeholder="Blur while empty" />
      </SnFormItem>
    </SnForm>
    <text class="sn-demo__meta"
      >With showMessage=false a field still validates and enters its error state, it just renders no
      message row (@validate still fires)</text
    >
  </view>
</template>

<style scoped>
.sn-demo--stack {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
  align-items: stretch;
  width: 100%;
}
.sn-demo__title {
  color: var(--sn-mp-color-text-secondary);
  font-size: var(--sn-mp-font-size-sm);
  font-weight: var(--sn-mp-font-weight-semibold);
}
</style>
