<script setup lang="ts">
/** Demo: SnProgress — indicator placement comparison for the line shape. */
import { SnProgress } from '@snui/vue-web'

const placements = [
  { value: 'outside', label: 'outside — indicator to the right of the track (default)' },
  { value: 'inside', label: 'inside — indicator inside the fill' },
  { value: 'top', label: 'top — indicator above the track' },
] as const
</script>

<template>
  <div class="progress-indicator-demo">
    <section
      v-for="item in placements"
      :key="item.value"
      class="progress-indicator-demo__block"
    >
      <h4>{{ item.label }}</h4>
      <SnProgress :percentage="55" :indicator-placement="item.value" />
    </section>

    <section class="progress-indicator-demo__block">
      <h4>Hide indicator (showIndicator = false)</h4>
      <SnProgress :percentage="55" :show-indicator="false" />
    </section>

    <section class="progress-indicator-demo__block">
      <h4>Custom indicator content (default slot)</h4>
      <SnProgress :percentage="72">
        <template #default="{ percentage }">{{ percentage }}% completed</template>
      </SnProgress>
    </section>
  </div>
</template>

<style scoped>
.progress-indicator-demo {
  display: grid;
  gap: 20px;
}
.progress-indicator-demo__block {
  display: grid;
  gap: 8px;
}
.progress-indicator-demo__block h4 {
  margin: 0;
  font-size: 13px;
  color: var(--sn-web-color-text-tertiary);
}
</style>
