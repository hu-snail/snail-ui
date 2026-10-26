<script setup lang="ts">
/** Demo: SnProgress — indicator placement comparison for the line shape. */
import { SnProgress } from '@snui/vue-web'

const placements = [
  { value: 'outside', label: 'outside — 指示器在轨道右侧（默认）' },
  { value: 'inside', label: 'inside — 指示器在填充内部' },
  { value: 'top', label: 'top — 指示器在轨道上方' },
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
      <h4>隐藏指示器（showIndicator = false）</h4>
      <SnProgress :percentage="55" :show-indicator="false" />
    </section>

    <section class="progress-indicator-demo__block">
      <h4>自定义指示器内容（default 插槽）</h4>
      <SnProgress :percentage="72">
        <template #default="{ percentage }">已完成 {{ percentage }}%</template>
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
