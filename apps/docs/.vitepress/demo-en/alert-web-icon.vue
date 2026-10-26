<script setup lang="ts">
/**
 * alert-web-icon — custom icon via the `icon` slot.
 *
 * Shows: the `icon` slot replacing the built-in per-type glyph. The slot
 * is still gated by `showIcon`, so toggling the checkbox removes it too.
 */
import { ref } from 'vue';
import { SnAlert, SnIcon } from '@snui/vue-web';
import { Bell, CloudLightning, Rocket } from 'lucide-vue-next';

const showIcon = ref(true);
</script>

<template>
  <div class="alert-icon">
    <label class="alert-icon__toggle">
      <input v-model="showIcon" type="checkbox" />
      showIcon
    </label>

    <SnAlert type="info" title="Custom icon" :show-icon="showIcon">
      <template #icon>
        <SnIcon :icon="Bell" />
      </template>
      Icon from <code>icon</code> slot, replacing the built-in type glyph.
    </SnAlert>

    <SnAlert type="warning" title="Another custom icon" :show-icon="showIcon">
      <template #icon>
        <SnIcon :icon="CloudLightning" />
      </template>
      The same slot can render a completely different glyph per instance.
    </SnAlert>

    <SnAlert type="success" title="Coexists with built-in icons" :show-icon="showIcon">
      <template #icon>
        <SnIcon :icon="Rocket" />
      </template>
      The slot only takes effect when provided; otherwise it falls back to the type icon.
    </SnAlert>
  </div>
</template>

<style scoped>
.alert-icon {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
}
.alert-icon__toggle {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: var(--sn-web-color-text-secondary);
}
</style>
