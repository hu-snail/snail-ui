<script setup lang="ts">
/** Demo: SnSlider — custom backgrounds (gradient / transparent),
 *  rail thickness and tooltip colors. */
import { ref } from 'vue';
import { SnSlider } from '@snui/vue-web';
const gradient = ref(60);
const ghost = ref(30);
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
      v-model="thick"
      :rail-width="12"
      tooltip-background="#2080f0"
      tooltip-text-color="#fff"
    />
    <span class="demo-log">
      gradient = {{ gradient }} · ghost = {{ ghost }} · thick = {{ thick }}
    </span>
  </div>
</template>

<style scoped>
.demo-col {
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-width: 420px;
  padding: 12px 0;
}
.demo-log {
  font-size: 13px;
  color: var(--vp-c-text-2);
}
</style>
