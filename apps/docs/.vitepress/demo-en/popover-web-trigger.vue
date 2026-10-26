<script setup lang="ts">
/**
 * Demo: SnPopover — click trigger and manual trigger with v-model:show.
 */
import { ref } from 'vue';
import { SnButton, SnPopover } from '@snui/vue-web';

const controlledShow = ref(false);
</script>

<template>
  <div class="popover-trigger-demo">
    <section class="popover-trigger-demo__block">
      <h4 class="popover-trigger-demo__title">
        click trigger (click toggles, outside click closes)
      </h4>
      <SnPopover
        trigger="click"
        header="Action panel"
        content="Click the trigger to toggle; clicking outside the popover closes it."
      >
        <SnButton>Click to toggle</SnButton>
      </SnPopover>
    </section>

    <section class="popover-trigger-demo__block">
      <h4 class="popover-trigger-demo__title">manual + v-model:show (controlled)</h4>
      <div class="popover-trigger-demo__row">
        <SnPopover
          v-model:show="controlledShow"
          trigger="manual"
          header="Controlled popover"
          content="Visibility is fully controlled by an external variable; trigger gestures are ignored."
          show-arrow
          placement="bottom"
        >
          <SnButton>Controlled target</SnButton>
        </SnPopover>
        <SnButton type="primary" @click="controlledShow = !controlledShow">
          {{ controlledShow ? 'Close popover' : 'Open popover' }}
        </SnButton>
        <span class="popover-trigger-demo__state">show = {{ controlledShow }}</span>
      </div>
    </section>
  </div>
</template>

<style scoped>
.popover-trigger-demo {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.popover-trigger-demo__block {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.popover-trigger-demo__title {
  margin: 0;
  font-size: 13px;
  font-weight: 600;
  color: var(--sn-web-color-text-secondary, #4b4f55);
}

.popover-trigger-demo__row {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
}

.popover-trigger-demo__state {
  font-size: 12px;
  color: var(--sn-web-color-text-tertiary, #8f939c);
}
</style>
