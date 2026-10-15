<script setup lang="ts">
/**
 * drawer-web-basic — the four placements, mask click and Escape to close.
 */
import { ref } from 'vue'
import { SnButton, SnDrawer, SnDrawerContent } from '@snui/vue-web'

type Placement = 'left' | 'right' | 'top' | 'bottom'

const placements: Placement[] = ['left', 'right', 'top', 'bottom']
const active = ref<Placement | null>(null)
const show = ref(false)
const lastAction = ref('—')

function open(placement: Placement) {
  active.value = placement
  show.value = true
  lastAction.value = `open (${placement})`
}

/** Width only applies to left/right; height only to top/bottom. */
function sizeOf(placement: Placement) {
  return placement === 'left' || placement === 'right'
    ? { width: 360 }
    : { height: 260 }
}
</script>

<template>
  <div class="drw-demo">
    <div class="drw-demo__bar">
      <SnButton
        v-for="placement in placements"
        :key="placement"
        :type="active === placement ? 'primary' : 'default'"
        @click="open(placement)"
      >
        {{ placement }}
      </SnButton>
    </div>

    <p class="drw-demo__log">
      最后一次事件：<code>{{ lastAction }}</code>
    </p>

    <SnDrawer
      v-model:show="show"
      :placement="active ?? 'right'"
      v-bind="active ? sizeOf(active) : { width: 360 }"
      @mask-click="lastAction = 'mask-click'"
      @esc="lastAction = 'esc'"
    >
      <SnDrawerContent :title="`从 ${active ?? 'right'} 滑入`">
        <p class="drw-demo__body">
          点击遮罩会触发 <code>mask-click</code>；按 Escape 会触发 <code>esc</code>。
          两者都会在关闭动作之前触发。
        </p>
        <template #footer>
          <SnButton @click="show = false">取消</SnButton>
          <SnButton type="primary" @click="show = false">确定</SnButton>
        </template>
      </SnDrawerContent>
    </SnDrawer>
  </div>
</template>

<style scoped>
.drw-demo {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 16px;
  width: 100%;
}
.drw-demo__bar {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.drw-demo__body {
  margin: 0;
}
.drw-demo__log {
  margin: 0;
  font-size: 13px;
  color: var(--sn-web-color-text-secondary);
}
</style>
