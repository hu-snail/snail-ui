<script setup lang="ts">
/** Demo: sn-form-item — tappable rows (clickable / isLink): the whole row is tappable and shows the arrow. */
import { reactive, ref } from 'vue';
import SnForm from '@snui/uni-src/components/sn-form/sn-form.vue';
import SnFormItem from '@snui/uni-src/components/sn-form/sn-form-item.vue';
import SnInput from '@snui/uni-src/components/sn-input/sn-input.vue';

const data = reactive({ city: '', summary: '' });
const clickTimes = ref(0);

function onCityClick(): void {
  clickTimes.value += 1;
}
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <SnForm :model="data" label-position="left" label-width="240">
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

    <text class="sn-demo__meta">The City row was tapped {{ clickTimes }} time(s)</text>
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
