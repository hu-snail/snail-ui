<script setup lang="ts">
/**
 * drawer-web-content — SnDrawerContent's three rows, including custom slots
 * and the rule that an absent `footer` slot renders no footer at all.
 */
import { ref } from 'vue';
import { SnButton, SnDrawer, SnDrawerContent } from '@snui/vue-web';

const showFull = ref(false);
const showNoFooter = ref(false);
const showBare = ref(false);
</script>

<template>
  <div class="drw-content">
    <div class="drw-content__bar">
      <SnButton type="primary" @click="showFull = true">All three sections</SnButton>
      <SnButton @click="showNoFooter = true">No footer</SnButton>
      <SnButton @click="showBare = true">Close button only</SnButton>
    </div>

    <!-- header / body / footer all present, with a custom header slot. -->
    <SnDrawer v-model:show="showFull" :width="400">
      <SnDrawerContent :title="'Overridden by slot'">
        <template #header>
          <strong>Custom header</strong>
        </template>
        <p>Body. Header / body / footer are all present.</p>
        <template #footer>
          <SnButton @click="showFull = false">Cancel</SnButton>
          <SnButton type="primary" @click="showFull = false">Save</SnButton>
        </template>
      </SnDrawerContent>
    </SnDrawer>

    <!-- No `footer` slot ⇒ no footer element at all. -->
    <SnDrawer v-model:show="showNoFooter" :width="400">
      <SnDrawerContent title="No footer">
        <p>Without the <code>footer</code> slot, the footer element is not rendered at all.</p>
      </SnDrawerContent>
    </SnDrawer>

    <!-- A bare `closable` header still shows, so the close button has a home.
         SnDrawer itself takes no `title` / `closable`; both live on the
         content component. -->
    <SnDrawer v-model:show="showBare" :width="320">
      <SnDrawerContent closable />
    </SnDrawer>
  </div>
</template>

<style scoped>
.drw-content {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 16px;
  width: 100%;
}
.drw-content__bar {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
</style>
