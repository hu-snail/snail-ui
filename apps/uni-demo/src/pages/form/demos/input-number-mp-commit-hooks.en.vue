<script setup lang="ts">
/** Demo: sn-input-number — value rules and commit timing: stepStrictly / allowNull / placeholder / beforeChange / immediateChange / updateOnInit / adjustPosition / inputType. */
import { ref } from 'vue';
import SnInputNumber from '@snui/uni-src/components/sn-input-number/sn-input-number.vue';

const snapped = ref(0);
const nullable = ref<string | number>('');
const guarded = ref(5);
const lastGuard = ref('—');
const deferred = ref(5);
const corrected = ref(0);

/** Even numbers only — demonstrates the beforeChange veto. */
const evenOnly = (value: number | string) => {
  const numeric = Number(value);
  const allowed = Number.isFinite(numeric) && numeric % 2 === 0;
  lastGuard.value = allowed ? 'Allowed' : 'Even numbers only';
  return allowed;
};
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <text class="sn-demo__title">stepStrictly + step=3 (values snap to 0/3/6/9…)</text>
    <SnInputNumber v-model="snapped" :min="0" :max="20" :step="3" step-strictly />

    <text class="sn-demo__title">allowNull + placeholder (the field may stay empty)</text>
    <SnInputNumber v-model="nullable" :min="0" :max="99" allow-null placeholder="May be empty" />

    <text class="sn-demo__title">beforeChange (even numbers only)</text>
    <SnInputNumber v-model="guarded" :min="0" :max="20" :before-change="evenOnly" />
    <text class="sn-demo__meta">Guard: {{ lastGuard }}</text>

    <text class="sn-demo__title">immediateChange=false (commits on blur / button only)</text>
    <SnInputNumber v-model="deferred" :min="0" :max="20" :immediate-change="false" />

    <text class="sn-demo__title"
      >updateOnInit (corrects an out-of-range value on mount) + inputType="number" +
      adjustPosition=false</text
    >
    <SnInputNumber
      v-model="corrected"
      :min="0"
      :max="10"
      :step="5"
      update-on-init
      input-type="number"
      :adjust-position="false"
    />
    <text class="sn-demo__meta">Corrected to {{ corrected }} on mount</text>
  </view>
</template>

<style scoped>
.sn-demo__title {
  font-size: 26rpx;
  font-weight: 600;
  color: var(--sn-mp-color-text-secondary);
}

.sn-demo__meta {
  font-size: 24rpx;
  color: var(--sn-mp-color-text-tertiary);
}
</style>
