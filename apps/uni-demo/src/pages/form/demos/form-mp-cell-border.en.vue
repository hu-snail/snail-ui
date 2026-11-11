<script setup lang="ts">
/** Demo: sn-form-item — cell dividers and truncation: `border` divider / `ellipsis` for long labels. */
import { reactive } from 'vue';
import SnForm from '@snui/uni-src/components/sn-form/sn-form.vue';
import SnFormItem from '@snui/uni-src/components/sn-form/sn-form-item.vue';
import SnInput from '@snui/uni-src/components/sn-input/sn-input.vue';

const data = reactive({ email: '', nickname: '' });
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <SnForm :model="data" border label-position="left" label-width="240">
      <SnFormItem prop="email" label="Email">
        <SnInput v-model="data.email" type="email" placeholder="you@example.com" clearable />
      </SnFormItem>

      <SnFormItem prop="nickname" label="A very long label is truncated with ellipsis" ellipsis>
        <SnInput v-model="data.nickname" placeholder="Enter a nickname" clearable />
      </SnFormItem>
    </SnForm>
  </view>
</template>

<style scoped>
.sn-demo--stack {
  display: flex;
  flex-direction: column;
  gap: var(--sn-mp-spacing-4);
  width: 100%;
}
</style>
