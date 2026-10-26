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
    <SnButton type="primary" @click="outer = true">打开外层抽屉</SnButton>

    <SnDrawer v-model:show="outer" placement="right" :width="420">
      <SnDrawerContent title="第一层" closable @close="outer = false">
        <p>这是一个普通抽屉，宽度 420px。</p>
        <SnButton type="primary" @click="inner = true">再打开一层</SnButton>

        <SnDrawer v-model:show="inner" placement="right" :width="320">
          <SnDrawerContent title="第二层" closable @close="inner = false">
            <p>嵌套抽屉拥有独立状态，关闭它不会影响外层。</p>
            <p>每层各自带遮罩，层数越多背景越暗。</p>
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
