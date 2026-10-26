<script setup lang="ts">
/** Demo: SnLink — the six semantic `type` colors side by side. */
import { SnLink } from '@snui/vue-web';

const types = [
  { value: 'default', label: 'default — default body color' },
  { value: 'primary', label: 'primary — primary color, signals clickable' },
  { value: 'info', label: 'info — informational / neutral' },
  { value: 'success', label: 'success — success / done' },
  { value: 'warning', label: 'warning — warning / needs confirmation' },
  { value: 'error', label: 'error — danger / failure' },
] as const;
</script>

<template>
  <div class="link-type-demo">
    <section v-for="item in types" :key="item.value" class="link-type-demo__row">
      <span class="link-type-demo__label">{{ item.label }}</span>
      <SnLink :type="item.value" :href="`#link-type-${item.value}`" underline>
        {{ item.value }} link
      </SnLink>
    </section>
  </div>
</template>

<style scoped>
.link-type-demo {
  display: grid;
  gap: 12px;
}
.link-type-demo__row {
  display: flex;
  align-items: baseline;
  gap: 16px;
}
.link-type-demo__label {
  flex: 0 0 220px;
  font-size: 13px;
  color: var(--sn-web-color-text-tertiary);
}
</style>
