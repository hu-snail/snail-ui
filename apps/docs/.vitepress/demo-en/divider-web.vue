<script setup lang="ts">
/**
 * Demo: SnDivider (Web) — real-component live render.
 * Per AUI-DOCS-016: imports the real @snui/vue-web SnDivider.
 */

import { ref } from 'vue';
import { SnDivider, SnButton } from '@snui/vue-web';

const show = ref(true);
function toggle(): void {
  show.value = !show.value;
}
</script>

<template>
  <div class="sn-demo">
    <SnButton size="small" @click="toggle">Toggle the divider below</SnButton>

    <p v-if="show" class="sn-demo__para">Upper text</p>
    <SnDivider v-if="show" />
    <p v-if="show" class="sn-demo__para">Lower text (horizontal default)</p>

    <p class="sn-demo__para">dotted dashed (doodle style)</p>
    <SnDivider dashed />

    <p class="sn-demo__para">Divider with text</p>
    <SnDivider>or</SnDivider>

    <p class="sn-demo__para">marginSize: small</p>
    <SnDivider margin-size="small" />

    <p class="sn-demo__para">marginSize: large</p>
    <SnDivider margin-size="large" />

    <div class="sn-demo__row">
      <span>Text</span>
      <SnDivider direction="vertical" />
      <span>Vertical divider</span>
      <SnDivider direction="vertical" dashed />
      <span>Vertical dashed</span>
    </div>
  </div>
</template>

<style scoped>
.sn-demo {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.sn-demo__row {
  display: flex;
  align-items: center;
  gap: 8px;
  min-height: 36px;
}
.sn-demo__para {
  margin: 4px 0;
  font-size: 13px;
  color: var(--vp-c-text-1);
}
</style>
