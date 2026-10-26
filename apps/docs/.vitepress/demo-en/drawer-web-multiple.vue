<script setup lang="ts">
/**
 * drawer-web-multiple — nested drawers, each owning its own visibility.
 *
 * Shows: independent state per drawer, stacking order, and that closing an
 * inner drawer leaves the outer one open.
 */
import { ref } from 'vue'
import { SnButton, SnDrawer, SnDrawerContent } from '@snui/vue-web'

const outer = ref(false)
const inner = ref(false)
</script>

<template>
  <div class="drw-multi">
    <SnButton type="primary" @click="outer = true">Open outer drawer</SnButton>

    <SnDrawer v-model:show="outer" placement="right" :width="420">
      <SnDrawerContent title="First layer" closable @close="outer = false">
        <p>A plain drawer, 420px wide.</p>
        <SnButton type="primary" @click="inner = true">Open another layer</SnButton>

        <SnDrawer v-model:show="inner" placement="right" :width="320">
          <SnDrawerContent title="Second layer" closable @close="inner = false">
            <p>Nested drawers keep independent state; closing this one does not affect the outer layer.</p>
            <p>Each layer has its own mask; the more layers, the darker the backdrop.</p>
          </SnDrawerContent>
        </SnDrawer>
      </SnDrawerContent>
    </SnDrawer>
  </div>
</template>

<style scoped>
.drw-multi {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
}
</style>
