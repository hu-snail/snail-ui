<script setup lang="ts">
/**
 * drawer-web-closable — the close button and its two exit patterns.
 *
 * Shows: `closable` on the content panel (built-in X), and the footer-only
 * variant where `closable` stays off and the footer owns the exit.
 */
import { ref } from 'vue';
import { SnButton, SnDrawer, SnDrawerContent } from '@snui/vue-web';

const plain = ref(false);
const footerless = ref(false);
</script>

<template>
  <div class="drw-closable">
    <SnButton @click="plain = true">With close button</SnButton>
    <SnButton @click="footerless = true">Without close button</SnButton>

    <SnDrawer v-model:show="plain" placement="right" :width="340">
      <SnDrawerContent title="With close button" closable @close="plain = false">
        <p>The X button at the right of the title closes the drawer.</p>
      </SnDrawerContent>
    </SnDrawer>

    <SnDrawer v-model:show="footerless" placement="right" :width="340">
      <SnDrawerContent title="Without close button" @close="footerless = false">
        <template #footer>
          <div class="drw-closable__footer">
            <SnButton size="small" @click="footerless = false">Got it</SnButton>
          </div>
        </template>
        <p>
          <code>closable</code> defaults to <code>false</code>, so there is no button next to the
          title.
        </p>
        <p>Closing is left entirely to the footer actions.</p>
      </SnDrawerContent>
    </SnDrawer>
  </div>
</template>

<style scoped>
.drw-closable {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  width: 100%;
}
.drw-closable__footer {
  display: flex;
  justify-content: flex-end;
  width: 100%;
}
</style>
