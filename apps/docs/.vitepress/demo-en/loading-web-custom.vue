<script setup lang="ts">
/**
 * loading-web-custom — `stroke` recolours the arc, `description` and the
 * `icon` slot replace the default graphic, and `delay` defers the spinner so a
 * fast request never flashes.
 */
import { ref } from 'vue';
import { SnButton, SnLoading } from '@snui/vue-web';

const fast = ref(false);
const slow = ref(false);

function run(target: typeof fast, ms: number): void {
  target.value = true;
  window.setTimeout(() => {
    target.value = false;
  }, ms);
}
</script>

<template>
  <div class="loading-demo">
    <div class="loading-demo__row">
      <SnLoading stroke="var(--vp-c-brand-1)" size="large" description="Custom color" />
      <SnLoading size="large">
        <template #icon>
          <svg viewBox="0 0 24 24" width="100%" height="100%" fill="none" stroke="currentColor">
            <circle cx="12" cy="12" r="9" stroke-width="2" stroke-dasharray="6 6" />
          </svg>
        </template>
      </SnLoading>
    </div>

    <div class="loading-demo__row">
      <SnButton @click="run(fast, 200)">200ms request (no flash)</SnButton>
      <SnButton @click="run(slow, 2000)">2s request (shown after a 400ms delay)</SnButton>
    </div>

    <SnLoading :show="fast" :delay="400" description="200ms request">
      <div class="loading-demo__content">
        The request finishes within the delay window, so the spinner never appears.
      </div>
    </SnLoading>

    <SnLoading :show="slow" :delay="400" description="2s request">
      <div class="loading-demo__content">
        The spinner only fades in after the request exceeds 400ms.
      </div>
    </SnLoading>
  </div>
</template>

<style scoped>
.loading-demo {
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
}
.loading-demo__row {
  display: flex;
  align-items: center;
  gap: 32px;
  flex-wrap: wrap;
}
.loading-demo__content {
  padding: 24px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-2);
  text-align: center;
}
</style>
