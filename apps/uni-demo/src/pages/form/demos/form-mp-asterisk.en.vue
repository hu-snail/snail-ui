<script setup lang="ts">
/** Demo: sn-form — required asterisk (asteriskPosition / hideAsterisk): move it right or hide it entirely. */
import { reactive } from 'vue';
import SnForm from '@snui/uni-src/components/sn-form/sn-form.vue';
import SnFormItem from '@snui/uni-src/components/sn-form/sn-form-item.vue';
import SnInput from '@snui/uni-src/components/sn-input/sn-input.vue';

const asteriskForm = reactive({ email: '', nickname: '' });
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <view class="sn-demo__panel">
      <text class="sn-demo__title">asteriskPosition="right" + hideAsterisk</text>
      <SnForm :model="asteriskForm" asterisk-position="right" hide-asterisk>
        <SnFormItem prop="email" label="Email" required>
          <SnInput v-model="asteriskForm.email" placeholder="Enter an email" clearable />
        </SnFormItem>
        <SnFormItem prop="nickname" label="Nickname" required>
          <SnInput v-model="asteriskForm.nickname" placeholder="Enter a nickname" clearable />
        </SnFormItem>
      </SnForm>
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
</style>
