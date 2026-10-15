<script setup lang="ts">
/**
 * alert-web-icon — custom icon via the `icon` slot.
 *
 * Shows: the `icon` slot replacing the built-in per-type glyph. The slot
 * is still gated by `showIcon`, so toggling the checkbox removes it too.
 */
import { ref } from 'vue'
import { SnAlert, SnIcon } from '@snui/vue-web'
import { Bell, CloudLightning, Rocket } from 'lucide-vue-next'

const showIcon = ref(true)
</script>

<template>
  <div class="alert-icon">
    <label class="alert-icon__toggle">
      <input v-model="showIcon" type="checkbox">
      showIcon
    </label>

    <SnAlert type="info" title="自定义图标" :show-icon="showIcon">
      <template #icon>
        <SnIcon :icon="Bell" />
      </template>
      图标来自 <code>icon</code> 插槽，替换掉类型自带的图形。
    </SnAlert>

    <SnAlert type="warning" title="另一个自定义图标" :show-icon="showIcon">
      <template #icon>
        <SnIcon :icon="CloudLightning" />
      </template>
      同一个插槽可以按实例给出完全不同的图形。
    </SnAlert>

    <SnAlert type="success" title="与内置图标共存" :show-icon="showIcon">
      <template #icon>
        <SnIcon :icon="Rocket" />
      </template>
      插槽只在提供时才生效；不提供则回退到类型图标。
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
