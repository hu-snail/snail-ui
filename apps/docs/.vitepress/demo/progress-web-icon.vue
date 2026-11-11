<script setup lang="ts">
/**
 * Demo: SnProgress — a custom circle glyph through the `icon` slot.
 */
import { SnIcon, SnProgress, registerSnIcons } from '@snui/vue-web';
import { Check, X } from 'lucide-vue-next';

registerSnIcons({ Check, X });
</script>

<template>
  <div class="progress-icon-demo">
    <section class="progress-icon-demo__block">
      <h4>自定义环形图标（icon 插槽 + SnIcon）</h4>
      <div class="progress-icon-demo__row">
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
.progress-icon-demo {
  display: grid;
  gap: 20px;
}
.progress-icon-demo__block {
  display: grid;
  gap: 10px;
}
.progress-icon-demo__block h4 {
  margin: 0;
  font-size: 13px;
  color: var(--sn-web-color-text-tertiary);
}
.progress-icon-demo__row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 24px;
}
</style>
