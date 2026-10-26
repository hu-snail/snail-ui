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
      Last event:<code>{{ lastAction }}</code>
    </p>

    <SnDrawer
      v-model:show="show"
      :placement="active ?? 'right'"
      v-bind="active ? sizeOf(active) : { width: 360 }"
      @mask-click="lastAction = 'mask-click'"
      @esc="lastAction = 'esc'"
    >
      <SnDrawerContent :title="`Slide in from ${active ?? 'right'}`">
        <p class="drw-demo__body">
          Clicking the mask triggers <code>mask-click</code>; pressing Escape triggers <code>esc</code>. Both fire before the close happens.
        </p>
        <template #footer>
          <SnButton @click="show = false">Cancel</SnButton>
          <SnButton type="primary" @click="show = false">OK</SnButton>
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
