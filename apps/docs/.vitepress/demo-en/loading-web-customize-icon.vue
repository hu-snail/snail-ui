<script setup lang="ts">
/**
 * loading-web-customize-icon — the `icon` slot replaces the built-in spinner.
 *
 * Shows: a custom rotating glyph, plus how `rotate` toggles the animation
 * on that slot (the built-in spinner is unaffected by `rotate`).
 */
import { ref } from 'vue'
import { SnLoading } from '@snui/vue-web'
import { LoaderCircle, RefreshCw } from 'lucide-vue-next'

const rotate = ref(true)
</script>

<template>
  <div class="ldg-icon">
    <label class="ldg-icon__toggle">
      <input v-model="rotate" type="checkbox">
      rotate
    </label>

    <div class="ldg-icon__grid">
      <div class="ldg-icon__cell">
        <SnLoading :rotate="rotate">
          <template #icon>
            <LoaderCircle :size="28" />
          </template>
        </SnLoading>
        <span class="ldg-icon__cap">LoaderCircle</span>
      </div>

      <div class="ldg-icon__cell">
        <SnLoading :rotate="rotate">
          <template #icon>
            <RefreshCw :size="28" />
          </template>
        </SnLoading>
        <span class="ldg-icon__cap">RefreshCw</span>
      </div>

      <div class="ldg-icon__cell">
        <SnLoading description="Custom icon + text" :rotate="rotate">
          <template #icon>
            <LoaderCircle :size="24" />
          </template>
        </SnLoading>
        <span class="ldg-icon__cap">With description</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.ldg-icon {
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
}
.ldg-icon__toggle {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: var(--sn-web-color-text-secondary);
}
.ldg-icon__grid {
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
}
.ldg-icon__cell {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  min-width: 120px;
  padding: 20px;
  border-radius: 8px;
  background: var(--sn-web-color-background-subtle);
}
.ldg-icon__cap {
  font-size: 12px;
  color: var(--sn-web-color-text-tertiary);
}
</style>
