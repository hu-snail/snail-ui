<script setup lang="ts">
/** Demo: SnTag — icon + avatar slots (n-tag parity). */
import { Heart, Music, Rocket, Sparkles } from 'lucide-vue-next';
import { SnAvatar, SnIcon, SnTag } from '@snui/vue-web';
</script>

<template>
  <div class="demo-col">
    <div class="demo-row">
      <SnTag type="primary">
        <template #icon><SnIcon :icon="Rocket" /></template>
        Launch
      </SnTag>
      <SnTag type="error">
        <template #icon><SnIcon :icon="Heart" /></template>
        Favorite
      </SnTag>
      <SnTag type="success">
        <template #icon><SnIcon :icon="Sparkles" /></template>
        Featured
      </SnTag>
      <SnTag round type="warning">
        <template #icon><SnIcon :icon="Music" /></template>
        Music
      </SnTag>
    </div>
    <div class="demo-row">
      <SnTag size="large">
        <template #avatar><SnAvatar :size="18" circle fallback-text="A" /></template>
        Avatar tag
      </SnTag>
      <SnTag closable round size="large">
        <template #avatar>
          <SnAvatar :size="18" circle color="#3491fa" fallback-text="S" />
        </template>
        Member
      </SnTag>
    </div>
  </div>
</template>

<style scoped>
.demo-col {
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: flex-start;
}
.demo-row {
  display: flex;
  gap: 8px;
  align-items: center;
}
</style>
