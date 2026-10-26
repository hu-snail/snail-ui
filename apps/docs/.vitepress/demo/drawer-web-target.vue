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
    <SnButton type="primary" @click="open = true">在下方容器内打开</SnButton>

    <div ref="host" class="drw-target__host">
      <span class="drw-target__cap">抽屉的挂载容器（to）</span>

      <SnDrawer v-if="host" v-model:show="open" :to="host" placement="right" :width="280">
        <SnDrawerContent title="局部抽屉" closable @close="open = false">
          <p>这个抽屉被限制在虚线框内，不会铺满整个视口。</p>
          <p>适合嵌入预览画布、局部编辑器等场景。</p>
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
