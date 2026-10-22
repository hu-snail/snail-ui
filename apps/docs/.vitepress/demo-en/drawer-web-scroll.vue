<script setup lang="ts">
/**
 * drawer-web-scroll — a body that scrolls while header and footer stay put.
 *
 * Shows: `nativeScrollbar` with a long body, and the resulting three-band
 * layout (fixed header / scrolling body / fixed footer).
 */
import { ref } from 'vue'
import { SnButton, SnDrawer, SnDrawerContent } from '@snui/vue-web'

const open = ref(false)

const items = Array.from({ length: 40 }, (_, i) => `Setting ${i + 1}`)
</script>

<template>
  <div class="drw-scroll">
    <SnButton type="primary" @click="open = true">Open drawer with long content</SnButton>

    <SnDrawer v-model:show="open" placement="right" :width="400">
      <SnDrawerContent title="Scrollable content" closable @close="open = false">
        <template #footer>
          <div class="drw-scroll__footer">
            <SnButton size="small" @click="open = false">Cancel</SnButton>
            <SnButton size="small" type="primary" @click="open = false">Save</SnButton>
          </div>
        </template>

        <p>Header and footer stay fixed while the middle area scrolls independently.</p>
        <ul class="drw-scroll__list">
          <li v-for="item in items" :key="item">{{ item }}</li>
        </ul>
      </SnDrawerContent>
    </SnDrawer>
  </div>
</template>

<style scoped>
.drw-scroll {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
}
.drw-scroll__list {
  margin: 0;
  padding-left: 18px;
  line-height: 2;
}
.drw-scroll__footer {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}
</style>
