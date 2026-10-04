<script setup lang="ts">
/** Demo: SnInput — bordered / bg / radius variants. */
import { ref } from 'vue'
import { SnInput } from '@snui/vue-web'

const a = ref('')
const b = ref('')
const c = ref('')
const d = ref('search')
const e = ref('')
</script>

<template>
  <div class="sn-demo">
    <h4 class="sn-demo__title">Bordered (default) / Borderless</h4>
    <SnInput v-model="a" placeholder="With border" />
    <SnInput v-model="b" placeholder="No border" :bordered="false" class="on-soft" />

    <h4 class="sn-demo__title">Background tones</h4>
    <SnInput v-model="c" placeholder="surface (default)" bg="surface" />
    <SnInput v-model="d" placeholder="transparent" bg="transparent" :bordered="false" />
    <SnInput v-model="e" placeholder="soft" bg="soft" />

    <h4 class="sn-demo__title">Radius presets</h4>
    <SnInput model-value="default radius" radius="default" readonly />
    <SnInput model-value="pill radius (search bar)" radius="pill" readonly />
    <SnInput model-value="square radius" radius="square" readonly />
  </div>
</template>

<style scoped>
.sn-demo { display: flex; flex-direction: column; gap: 8px; max-width: 360px; }
.sn-demo__title { margin: 12px 0 0; font-size: 13px; font-weight: 600; color: var(--vp-c-text-1); }
.on-soft { background: var(--vp-c-bg-soft); padding: 8px; border-radius: 6px; }
</style>