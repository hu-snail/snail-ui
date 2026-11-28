<script setup lang="ts">
/** Demo: SnButton (Web) — circle / strong / secondary / tertiary / quaternary. */
import { SnButton } from '@snui/vue-web';
import { Mail, Plus } from 'lucide-vue-next';
</script>

<template>
  <div class="sn-demo">
    <SnButton circle type="primary" :icon="Mail" />
    <SnButton circle type="success" :icon="Plus" />
    <SnButton strong type="primary">加重阴影按钮</SnButton>
    <SnButton secondary>次级按钮</SnButton>
    <SnButton tertiary type="primary">三级按钮</SnButton>
    <SnButton quaternary>四级按钮</SnButton>
  </div>
</template>

<style scoped>
.sn-demo {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
}
</style>
