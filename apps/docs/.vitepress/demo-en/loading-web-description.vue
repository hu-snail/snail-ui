<script setup lang="ts">
/**
 * loading-web-description — the spinner with a text label beneath it.
 *
 * Shows: the `description` prop in both the bare and the wrapping form.
 */
import { ref } from 'vue'
import { SnButton, SnLoading } from '@snui/vue-web'

const loading = ref(true)
</script>

<template>
  <div class="ldg-desc">
    <div class="ldg-desc__row">
      <span class="ldg-desc__cap">Indicator + description only</span>
      <SnLoading description="Loading…" />
    </div>

    <div class="ldg-desc__row">
      <span class="ldg-desc__cap">Wrapping + description</span>
      <div class="ldg-desc__box">
        <SnLoading :show="loading" description="Syncing data…">
          <p>This content stays mounted; it is only dimmed and non-interactive.</p>
          <p>The overlay fades out automatically once loading ends.</p>
        </SnLoading>
      </div>
    </div>

    <SnButton size="small" @click="loading = !loading">
      {{ loading ? 'Stop loading' : 'Reload' }}
    </SnButton>
  </div>
</template>

<style scoped>
.ldg-desc {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 20px;
  width: 100%;
}
.ldg-desc__row {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.ldg-desc__cap {
  font-size: 12px;
  color: var(--sn-web-color-text-tertiary);
}
.ldg-desc__box {
  padding: 24px;
  border-radius: 8px;
  background: var(--sn-web-color-background-subtle);
}
</style>
