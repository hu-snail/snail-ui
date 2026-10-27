<script setup lang="ts">
/**
 * drawer-web-resizable — drag or arrow-key the inner edge to resize.
 *
 * Shows: `resizable` + `defaultWidth` + `minWidth` / `maxWidth`. The host
 * owns the committed size and receives it via `update:width`.
 */
import { ref } from 'vue';
import { SnButton, SnDrawer, SnDrawerContent } from '@snui/vue-web';

const open = ref(false);
const width = ref(360);

function onUpdateWidth(next: number): void {
  width.value = next;
}
</script>

<template>
  <div class="drw-resizable">
    <div class="drw-resizable__bar">
      <SnButton type="primary" @click="open = true">Open resizable drawer</SnButton>
      <span class="drw-resizable__readout"
        >Current width:<code>{{ width }}px</code></span
      >
    </div>

    <SnDrawer
      v-model:show="open"
      placement="right"
      resizable
      :width="width"
      :min-width="280"
      :max-width="640"
      @update:width="onUpdateWidth"
    >
      <SnDrawerContent title="Drag the right edge to resize" closable @close="open = false">
        <p>
          Move the pointer to the panel's left edge (the grab strip about 12px wide) and press-drag.
        </p>
        <p>
          Keyboard users can first <kbd>Tab</kbd> focus the resize handle, then fine-tune with the arrow
          keys.
        </p>
        <p>Width is constrained between 280px and 640px.</p>
      </SnDrawerContent>
    </SnDrawer>
  </div>
</template>

<style scoped>
.drw-resizable {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
}
.drw-resizable__bar {
  display: flex;
  align-items: center;
  gap: 16px;
}
.drw-resizable__readout {
  font-size: 13px;
  color: var(--sn-web-color-text-secondary);
}
</style>
