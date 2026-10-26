<script setup lang="ts">
/**
 * steps-web-content-placement — title/description below the indicator.
 *
 * Shows: `contentPlacement="bottom"` on an otherwise identical horizontal
 * steps, so the layout delta is the only variable.
 */
import { ref } from 'vue';
import { SnSteps, SnStep } from '@snui/vue-web';

const current = ref(1);
</script>

<template>
  <div class="steps-cp">
    <div class="steps-cp__row">
      <span class="steps-cp__cap">contentPlacement="right"（默认）</span>
      <SnSteps v-model:current="current" content-placement="right">
        <SnStep title="准备材料" description="身份证与合同原件" />
        <SnStep title="线下面签" description="按预约时间到场" />
        <SnStep title="等待放款" description="通常 1–3 个工作日" />
      </SnSteps>
    </div>

    <div class="steps-cp__row">
      <span class="steps-cp__cap">contentPlacement="bottom"</span>
      <SnSteps v-model:current="current" content-placement="bottom">
        <SnStep title="准备材料" description="身份证与合同原件" />
        <SnStep title="线下面签" description="按预约时间到场" />
        <SnStep title="等待放款" description="通常 1–3 个工作日" />
      </SnSteps>
    </div>

    <p class="steps-cp__hint">
      <code>contentPlacement</code> 只在横向模式下生效；垂直模式恒为右侧。
    </p>
  </div>
</template>

<style scoped>
.steps-cp {
  display: flex;
  flex-direction: column;
  gap: 32px;
  width: 100%;
}
.steps-cp__row {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.steps-cp__cap {
  font-size: 12px;
  color: var(--sn-web-color-text-tertiary);
}
.steps-cp__hint {
  margin: 0;
  font-size: 13px;
  color: var(--sn-web-color-text-secondary);
}
</style>
