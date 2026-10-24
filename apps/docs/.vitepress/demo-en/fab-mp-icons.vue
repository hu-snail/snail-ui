<script setup lang="ts">
/**
 * Demo: sn-fab (uni-end) — `active-icon` / `inactive-icon` switching, `z-index` and
 * `custom-style`.
 *
 *   - `inactive-icon` trigger icon name while collapsed (resolved via sn-icon registry)
 *   - `active-icon`   trigger icon name while expanded
 *   - `z-index`       root stacking level
 *   - `custom-style`  appended to the root inline style (after z-index, so it can override)
 *
 * `plus` / `close` are the two built-in names; any other name goes through
 * `registerSnIcons()`. The demo shows one of each.
 */
import { onBeforeUnmount, ref } from 'vue'
import SnButton from '@snui/uni-src/components/sn-button/sn-button.vue'
import SnFab from '@snui/uni-src/components/sn-fab/sn-fab.vue'
import { registerSnIcons, clearSnIcons } from '@snui/uni-src/components/sn-icon/sn-icon-registry'
import { Heart, Star } from '@snui/uni-src/components/sn-icon/sn-icon-set'

registerSnIcons({ Heart, Star })
onBeforeUnmount(() => clearSnIcons())

const builtinActive = ref(false)
const customIconsActive = ref(false)
const lastAction = ref('—')

function pick(label: string): void {
  lastAction.value = label
  builtinActive.value = false
  customIconsActive.value = false
}
</script>

<template>
  <view class="sn-demo sn-fab-demo__stage">
    <text class="sn-fab-demo__meta">Last action: {{ lastAction }}</text>
    <text class="sn-fab-demo__meta">
      Left: inactive-icon=plus / active-icon=close (built-in names). Right: heart / star (registry
      names) + z-index
    </text>

    <!-- Built-in icon names: plus while collapsed, close while expanded. -->
    <SnFab
      v-model:active="builtinActive"
      inactive-icon="plus"
      active-icon="close"
      position="left-bottom"
      :gap="{ bottom: 16, left: 16 }"
      :z-index="10"
      custom-class="sn-demo-contained"
    >
      <SnButton round size="small" @tap="pick('Built-in A')">A</SnButton>
      <SnButton round size="small" @tap="pick('Built-in B')">B</SnButton>
    </SnFab>

    <!-- Registry icon names + a higher level + custom-style adding a shadow. -->
    <SnFab
      v-model:active="customIconsActive"
      inactive-icon="Heart"
      active-icon="Star"
      type="success"
      position="right-bottom"
      :gap="{ bottom: 16, right: 16 }"
      :z-index="200"
      custom-style="box-shadow: var(--sn-mp-shadow-lg);"
      custom-class="sn-demo-contained"
    >
      <SnButton type="primary" round size="small" @tap="pick('Registry A')">A</SnButton>
      <SnButton type="success" round size="small" @tap="pick('Registry B')">B</SnButton>
      <SnButton round size="small" @tap="pick('Registry C')">C</SnButton>
    </SnFab>
  </view>
</template>

<style scoped>
.sn-fab-demo__stage {
  position: relative;
  width: 100%;
  height: 520rpx;
  overflow: hidden;
  border-radius: var(--sn-mp-radius-md);
  background-color: var(--sn-mp-color-background-surface);
}
.sn-fab-demo__meta {
  padding: var(--sn-mp-spacing-3);
  font-size: var(--sn-mp-font-size-xs);
  color: var(--sn-mp-color-text-secondary);
}
/* Docs-preview only — pin the fixed layer to the phone screen. */
.sn-fab.sn-demo-contained {
  position: absolute;
}
</style>
