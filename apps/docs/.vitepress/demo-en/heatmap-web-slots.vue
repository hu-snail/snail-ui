<script setup lang="ts">
/** Demo: SnHeatmap — footer / indicator / indicator-text slots and hover hints. */
import { ref } from 'vue';
import { SnHeatmap } from '@snui/vue-web';

/** Deterministic pseudo-random data over the last ~20 weeks. */
function buildData() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const out: Array<{ timestamp: number; value: number }> = [];
  for (let i = 139; i >= 0; i -= 1) {
    const ts = today.getTime() - i * 86_400_000;
    const seed = Math.abs(Math.sin(ts / 86_400_000 + 2.7));
    out.push({ timestamp: ts, value: Math.floor(seed * 12) });
  }
  return out;
}

const data = ref(buildData());
</script>

<template>
  <div class="sn-demo">
    <div class="sn-demo__scroller">
      <SnHeatmap :data="data" tooltip>
        <template #footer>
          <span class="sn-demo__footer-text">A 20-week consistency record</span>
        </template>
        <template #indicator-leading-text>Less</template>
        <template #indicator-trailing-text>More</template>
      </SnHeatmap>
    </div>
    <div class="sn-demo__scroller">
      <SnHeatmap :data="data">
        <template #indicator>
          <span class="sn-demo__footer-text">Custom indicator area</span>
        </template>
      </SnHeatmap>
    </div>
    <p class="sn-demo__tip">
      Top: footer + indicator text slots + tooltip on hover; bottom: the indicator slot replaced as
      a whole.
    </p>
  </div>
</template>

<style scoped>
.sn-demo {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.sn-demo__footer-text,
.sn-demo__tip {
  font-size: 13px;
  color: var(--sn-web-color-text-tertiary);
}

.sn-demo__scroller {
  max-width: 100%;
  overflow-x: auto;
  padding-bottom: 4px;
}
</style>
