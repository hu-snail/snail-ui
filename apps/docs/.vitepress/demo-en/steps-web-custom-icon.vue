<script setup lang="ts">
/**
 * steps-web-custom-icon — replacing the finish / error glyphs.
 *
 * Shows: the `finish-icon` and `error-icon` slots on SnSteps, plus the
 * per-step `icon` slot that overrides a single indicator.
 */
import { ref } from 'vue'
import { SnIcon, SnStep, SnSteps } from '@snui/vue-web'
import { Flag, Rocket, ThumbsUp, Zap } from 'lucide-vue-next'

const current = ref(1)
</script>

<template>
  <div class="steps-icon">
    <div class="steps-icon__group">
      <span class="steps-icon__cap">finish-icon / error-icon slots</span>
      <SnSteps v-model:current="current">
        <template #finish-icon>
          <SnIcon :icon="ThumbsUp" size="12" />
        </template>
        <template #error-icon>
          <SnIcon :icon="Zap" size="12" />
        </template>

        <SnStep title="Done" description="Uses a custom finish icon" />
        <SnStep title="In progress" description="Uses the default number" />
        <SnStep title="Error" description="Uses a custom error icon" status="error" />
      </SnSteps>
    </div>

    <div class="steps-icon__group">
      <span class="steps-icon__cap">Per-step icon slot</span>
      <SnSteps :current="1">
        <SnStep title="Start">
          <template #icon>
            <SnIcon :icon="Flag" size="14" />
          </template>
        </SnStep>
        <SnStep title="Sprint">
          <template #icon>
            <SnIcon :icon="Rocket" size="14" />
          </template>
        </SnStep>
        <SnStep title="Finalize" description="No icon provided; falls back to the built-in rendering" />
      </SnSteps>
    </div>

    <p class="steps-icon__hint">
      <code>finish-icon</code> / <code>error-icon</code> are defined on the parent <code>SnSteps</code> applies to all sub-steps;<code>icon</code> slot only overrides that one step.
    </p>
  </div>
</template>

<style scoped>
.steps-icon {
  display: flex;
  flex-direction: column;
  gap: 32px;
  width: 100%;
}
.steps-icon__group {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.steps-icon__cap {
  font-size: 12px;
  color: var(--sn-web-color-text-tertiary);
}
.steps-icon__hint {
  margin: 0;
  font-size: 13px;
  line-height: 1.7;
  color: var(--sn-web-color-text-secondary);
}
</style>
