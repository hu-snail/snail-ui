<script setup lang="ts">
/**
 * Demo: sn-form-item — cell list layout: `border` divider / `ellipsis` for long
 * labels / `clickable` + `isLink` row / `placeholder` fallback for empty values
 * / `description` helper copy.
 */
import { reactive, ref } from 'vue';
import SnForm from '@snui/uni-src/components/sn-form/sn-form.vue';
import SnFormItem from '@snui/uni-src/components/sn-form/sn-form-item.vue';
import SnInput from '@snui/uni-src/components/sn-input/sn-input.vue';

const data = reactive({ email: '', nickname: '', city: '', summary: '' });
const clickTimes = ref(0);

function onCityClick(): void {
  clickTimes.value += 1;
}
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <SnForm :model="data" border label-position="left" label-width="240">
      <SnFormItem prop="email" label="Email" description="Used for verification codes only">
        <SnInput v-model="data.email" type="email" placeholder="you@example.com" clearable />
      </SnFormItem>

      <SnFormItem prop="nickname" label="A very long label is truncated with ellipsis" ellipsis>
        <SnInput v-model="data.nickname" placeholder="Enter a nickname" clearable />
      </SnFormItem>

      <SnFormItem
        prop="city"
        label="City"
        placeholder="Not set"
        clickable
        is-link
        @click="onCityClick"
      />

      <SnFormItem prop="summary" label="Bio" is-link>
        <SnInput v-model="data.summary" readonly placeholder="Not set" />
      </SnFormItem>
    </SnForm>

    <text class="sn-demo__meta">
      The City row was tapped {{ clickTimes }} time(s); empty rows fall back to the placeholder
    </text>
  </view>
</template>

<style scoped>
.sn-demo--stack {
  display: flex;
  flex-direction: column;
  gap: var(--sn-mp-spacing-4);
  width: 100%;
}

.sn-demo__meta {
  color: var(--sn-mp-color-text-tertiary);
  font-size: var(--sn-mp-font-size-xs);
  line-height: var(--sn-mp-font-line-height-normal);
}
</style>
