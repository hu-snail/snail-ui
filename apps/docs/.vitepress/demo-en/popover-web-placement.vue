<script setup lang="ts">
/**
 * Demo: SnPopover — 12-way placement grid driving one controlled instance.
 */
import { nextTick, ref } from 'vue'
import { SnButton, SnPopover, type SnPopoverPlacement } from '@snui/vue-web'

const placements: SnPopoverPlacement[] = [
  'top-start', 'top', 'top-end',
  'right-start', 'right', 'right-end',
  'bottom-start', 'bottom', 'bottom-end',
  'left-start', 'left', 'left-end',
]

const show = ref(false)
const placement = ref<SnPopoverPlacement>('top')
const active = ref<SnPopoverPlacement | null>(null)

async function toggleAt(p: SnPopoverPlacement): Promise<void> {
  // 再次点击当前方位时收起。
  if (show.value && active.value === p) {
    show.value = false
    active.value = null
    return
  }
  // 已打开时先收起再重开，让气泡按新方位重新定位。
  if (show.value) {
    show.value = false
    await nextTick()
  }
  placement.value = p
  active.value = p
  show.value = true
}
</script>

<template>
  <div class="popover-placement-demo">
    <div class="popover-placement-demo__grid">
      <SnButton
        v-for="p in placements"
        :key="p"
        size="tiny"
        :class="{ 'popover-placement-demo__cell--active': active === p }"
        @click="toggleAt(p)"
      >
        {{ p }}
      </SnButton>
    </div>

    <div class="popover-placement-demo__anchor-row">
      <SnPopover
        v-model:show="show"
        trigger="manual"
        :placement="placement"
        show-arrow
        header="Placement preview"
        :content="`Current placement is ${placement}; click another position in the grid to switch in real time.`"
      >
        <SnButton type="primary">Anchor element ({{ placement }})</SnButton>
      </SnPopover>
    </div>

    <p class="popover-placement-demo__hint">
      Twelve placements: top / right / bottom / left each offer start, center and end alignment; the bubble flips to the opposite side automatically when space is tight. Click the current placement again to dismiss it.
    </p>
  </div>
</template>

<style scoped>
.popover-placement-demo {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.popover-placement-demo__grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(96px, 1fr));
  gap: 8px;
  max-width: 420px;
}

.popover-placement-demo__cell--active {
  outline: 1px solid var(--sn-web-color-action-primary, #2080f0);
  outline-offset: 1px;
}

.popover-placement-demo__anchor-row {
  display: flex;
  justify-content: center;
  padding: 4px 0;
}

.popover-placement-demo__hint {
  margin: 0;
  font-size: 12px;
  color: var(--sn-web-color-text-tertiary, #8f939c);
}
</style>
