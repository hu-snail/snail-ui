<script setup lang="ts">
/** Demo: SnSlider — custom rail / track backgrounds (gradient, transparent
 *  diffuse), rail thickness, diffuse glow and tooltip colors. */
import { ref } from 'vue';
import { SnSlider } from '@snui/vue-web';
const gradient = ref(60);
const ghost = ref(30);
const diffuse = ref(70);
const thick = ref(70);
</script>

<template>
  <div class="demo-col">
    <SnSlider v-model="gradient" track-background="linear-gradient(90deg, #18a058, #2080f0)" />
    <SnSlider
      v-model="ghost"
      rail-background="transparent"
      track-background="rgba(32, 128, 240, 0.55)"
      rail-width="2px"
    />
    <SnSlider
      v-model="diffuse"
      :rail-width="10"
      rail-background="linear-gradient(90deg, rgba(32, 128, 240, 0.45), rgba(24, 160, 88, 0.08))"
      rail-shadow="0 0 14px 2px rgba(32, 128, 240, 0.35)"
      track-background="linear-gradient(90deg, #2080f0, rgba(32, 128, 240, 0.1))"
    />
    <SnSlider
      v-model="thick"
      :rail-width="12"
      tooltip-background="#2080f0"
      tooltip-text-color="#fff"
    />
    <span class="demo-log">
      gradient = {{ gradient }} · ghost = {{ ghost }} · diffuse = {{ diffuse }} · thick = {{ thick }}
    </span>
  </div>
</template>

<style scoped>
.demo-col {
  display: flex;
  flex-direction: column;
  gap: 16px;
  max-width: 420px;
  padding: 12px 0;
}
.demo-log {
  font-size: 13px;
  color: var(--vp-c-text-2);
}
</style>
