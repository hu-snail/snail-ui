<script setup lang="ts">
/**
 * back-top-web-visibility-height — the scroll threshold that reveals the button.
 *
 * Shows: three containers sharing the same scroll content but different
 * `visibilityHeight`, so the reveal point differs per column.
 */
import { ref } from 'vue';
import { SnBackTop } from '@snui/vue-web';

const lowRef = ref<HTMLElement | null>(null);
const midRef = ref<HTMLElement | null>(null);
const highRef = ref<HTMLElement | null>(null);

const columns = [
  { key: 'low', label: 'visibilityHeight=40', ref: lowRef, threshold: 40 },
  { key: 'mid', label: 'visibilityHeight=120', ref: midRef, threshold: 120 },
  { key: 'high', label: 'visibilityHeight=240', ref: highRef, threshold: 240 },
];
</script>

<template>
  <div class="bt-vh">
    <div v-for="col in columns" :key="col.key" class="bt-vh__col">
      <span class="bt-vh__cap">{{ col.label }}</span>
      <div
        :ref="
          (el) => {
            col.ref.value = el as HTMLElement | null;
          }
        "
        class="bt-vh__scroller"
      >
        <p v-for="n in 24" :key="n" class="bt-vh__line">Row {{ n }} content</p>
        <SnBackTop
          :listen-to="() => col.ref.value"
          :visibility-height="col.threshold"
          :right="16"
          :bottom="16"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.bt-vh {
  display: flex;
  gap: 16px;
  width: 100%;
}
.bt-vh__col {
  position: relative;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.bt-vh__cap {
  font-size: 12px;
  color: var(--sn-web-color-text-tertiary);
}
.bt-vh__scroller {
  height: 220px;
  overflow-y: auto;
  padding: 0 10px;
  border: 1px solid var(--sn-web-color-border);
  border-radius: 6px;
  background: var(--sn-web-color-background-subtle);
}
.bt-vh__line {
  margin: 0 0 8px;
  font-size: 13px;
  line-height: 1.7;
  color: var(--sn-web-color-text-secondary);
}
</style>
