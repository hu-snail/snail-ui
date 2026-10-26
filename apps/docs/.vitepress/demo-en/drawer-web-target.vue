<script setup lang="ts">
/**
 * drawer-web-target — render the drawer inside a local container.
 *
 * Shows: the `to` prop. The drawer is teleported into the dashed box
 * instead of `body`, so it is clipped by that box rather than the viewport.
 */
import { ref } from 'vue';
import { SnButton, SnDrawer, SnDrawerContent } from '@snui/vue-web';

const host = ref<HTMLElement | null>(null);
const open = ref(false);
</script>

<template>
  <div class="drw-target">
    <SnButton type="primary" @click="open = true">Open inside the container below</SnButton>

    <div ref="host" class="drw-target__host">
      <span class="drw-target__cap">Drawer mount container (to)</span>

      <SnDrawer v-if="host" v-model:show="open" :to="host" placement="right" :width="280">
        <SnDrawerContent title="Scoped drawer" closable @close="open = false">
          <p>This drawer is confined to the dashed box; it does not fill the viewport.</p>
          <p>Fits embedded preview canvases, local editors, and similar cases.</p>
        </SnDrawerContent>
      </SnDrawer>
    </div>
  </div>
</template>

<style scoped>
.drw-target {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
}
.drw-target__host {
  position: relative;
  overflow: hidden;
  height: 260px;
  border: 1px dashed var(--sn-web-color-border);
  border-radius: 8px;
  background: var(--sn-web-color-background-subtle);
}
.drw-target__cap {
  position: absolute;
  top: 8px;
  left: 12px;
  font-size: 12px;
  color: var(--sn-web-color-text-tertiary);
}
</style>
