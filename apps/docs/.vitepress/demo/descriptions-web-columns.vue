<script setup lang="ts">
/** Demo: SnDescriptions — column 控制总列数。 */
import { SnDescriptions, SnDescriptionsItem } from '@snui/vue-web'
</script>

<template>
  <div class="descriptions-demo">
    <SnDescriptions title="column = 1" :column="1">
      <SnDescriptionsItem label="名称">AUI</SnDescriptionsItem>
      <SnDescriptionsItem label="定位">AI-Native 多端 UI 框架</SnDescriptionsItem>
      <SnDescriptionsItem label="构建">Vite + vue-tsc</SnDescriptionsItem>
    </SnDescriptions>

    <SnDescriptions title="column = 2" :column="2">
      <SnDescriptionsItem label="名称">AUI</SnDescriptionsItem>
      <SnDescriptionsItem label="定位">AI-Native 多端 UI 框架</SnDescriptionsItem>
      <SnDescriptionsItem label="构建">Vite + vue-tsc</SnDescriptionsItem>
      <SnDescriptionsItem label="测试">vitest + happy-dom</SnDescriptionsItem>
    </SnDescriptions>

    <SnDescriptions title="column = 3" :column="3">
      <SnDescriptionsItem label="名称">AUI</SnDescriptionsItem>
      <SnDescriptionsItem label="定位">AI-Native 多端 UI 框架</SnDescriptionsItem>
      <SnDescriptionsItem label="构建">Vite + vue-tsc</SnDescriptionsItem>
    </SnDescriptions>
  </div>
</template>

<style scoped>
.descriptions-demo {
  display: flex;
  flex-direction: column;
  gap: 24px;
  width: 100%;
}
</style>
