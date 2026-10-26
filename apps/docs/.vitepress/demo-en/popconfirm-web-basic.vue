<script setup lang="ts">
/**
 * Demo: SnPopconfirm — default texts, custom texts, custom icon and veto.
 */
import { ref } from 'vue';
import { CircleCheck } from 'lucide-vue-next';
import { registerSnIcons, SnButton, SnIcon, SnPopconfirm } from '@snui/vue-web';

registerSnIcons({ CircleCheck });

const result = ref('');

function onPositive() {
  result.value = 'Confirmed';
}
function onNegative() {
  result.value = 'Cancelled';
}
function onVetoPositive() {
  // 返回 false 阻止关闭（例如校验未通过时）。
  result.value = 'Confirm intercepted; popover stays open';
  return false;
}
</script>

<template>
  <div class="popconfirm-demo">
    <section class="popconfirm-demo__block">
      <h4 class="popconfirm-demo__title">Default confirm</h4>
      <div class="popconfirm-demo__row">
        <SnPopconfirm
          content="Delete this file? This cannot be undone."
          @positive-click="onPositive"
          @negative-click="onNegative"
        >
          <SnButton type="error">Delete file</SnButton>
        </SnPopconfirm>
        <SnPopconfirm
          content="Submit these changes?"
          positive-text="Submit"
          negative-text="Maybe later"
          show-arrow
        >
          <SnButton>Custom button labels</SnButton>
        </SnPopconfirm>
      </div>
    </section>

    <section class="popconfirm-demo__block">
      <h4 class="popconfirm-demo__title">Custom icon + block closing</h4>
      <div class="popconfirm-demo__row">
        <SnPopconfirm content="This resource is currently healthy. Take it offline?">
          <template #icon>
            <SnIcon :icon="CircleCheck" :size="20" />
          </template>
          <SnButton>Custom icon (#icon slot)</SnButton>
        </SnPopconfirm>
        <SnPopconfirm
          content="Clicking 'Confirm' is intercepted by the callback, so the popover stays open."
          @positive-click="onVetoPositive"
        >
          <SnButton>Return false to block closing</SnButton>
        </SnPopconfirm>
      </div>
    </section>

    <p class="popconfirm-demo__result">Last action: {{ result || '(none yet)' }}</p>
  </div>
</template>

<style scoped>
.popconfirm-demo {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.popconfirm-demo__block {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.popconfirm-demo__title {
  margin: 0;
  font-size: 13px;
  font-weight: 600;
  color: var(--sn-web-color-text-secondary, #4b4f55);
}

.popconfirm-demo__row {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}

.popconfirm-demo__result {
  margin: 0;
  font-size: 12px;
  color: var(--sn-web-color-text-tertiary, #8f939c);
}
</style>
