<script setup lang="ts">
/**
 * Demo: SnProgress — `processing` animation next to the four status colours,
 * plus a custom circle glyph through the `icon` slot.
 */
import { SnIcon, SnProgress, registerSnIcons } from '@snui/vue-web';
import { Check, X } from 'lucide-vue-next';

registerSnIcons({ Check, X });

const statuses = ['success', 'error', 'warning', 'info'] as const;
</script>

<template>
  <div class="progress-processing-demo">
    <section class="progress-processing-demo__block">
      <h4>Processing (processing = true, animated stripes)</h4>
      <SnProgress :percentage="66" processing />
      <SnProgress :percentage="38" status="info" processing />
    </section>

    <section class="progress-processing-demo__block">
      <h4>The four statuses (success / error / warning / info)</h4>
      <SnProgress v-for="status in statuses" :key="status" :percentage="62" :status="status" />
    </section>

    <section class="progress-processing-demo__block">
      <h4>Circle processing (breathing arc)</h4>
      <div class="progress-processing-demo__row">
        <SnProgress type="circle" :percentage="58" processing />
        <SnProgress type="circle" :percentage="82" status="success" processing />
      </div>
    </section>

    <section class="progress-processing-demo__block">
      <h4>Custom circle icon (icon slot + SnIcon)</h4>
      <div class="progress-processing-demo__row">
        <SnProgress type="circle" :percentage="100" status="success">
          <template #icon>
            <SnIcon name="Check" :size="30" />
          </template>
        </SnProgress>
        <SnProgress type="circle" :percentage="35" status="error">
          <template #icon>
            <SnIcon name="X" :size="30" />
          </template>
        </SnProgress>
      </div>
    </section>
  </div>
</template>

<style scoped>
.progress-processing-demo {
  display: grid;
  gap: 20px;
}
.progress-processing-demo__block {
  display: grid;
  gap: 10px;
}
.progress-processing-demo__block h4 {
  margin: 0;
  font-size: 13px;
  color: var(--sn-web-color-text-tertiary);
}
.progress-processing-demo__row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 24px;
}
</style>
