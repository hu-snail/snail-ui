<script setup lang="ts">
/**
 * Demo: sn-action-sheet (uni-end) — close-on-click-action / close-on-click-modal /
 * duration / z-index.
 * Per AUI-DOCS-016: imports the real @snui/uni sn-action-sheet from its SFC source.
 */
import { ref } from 'vue';
import SnButton from '@snui/uni-src/components/sn-button/sn-button.vue';
import SnActionSheet from '@snui/uni-src/components/sn-action-sheet/sn-action-sheet.vue';

const stayOpen = ref(false);
const noScrimClose = ref(false);
const slow = ref(false);

const picked = ref('—');
const log = ref<string[]>([]);

const actions = [
  { name: 'Copy link', description: 'Stays open so you can pick another row' },
  { name: 'Save to album' },
];

function record(name: string): void {
  log.value = [...log.value.slice(-2), name];
}
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <SnButton type="primary" block @tap="stayOpen = true">
      closeOnClickAction=false (stays open)
    </SnButton>
    <SnButton block @tap="noScrimClose = true">
      closeOnClickModal=false (scrim tap keeps it open)
    </SnButton>
    <SnButton block @tap="slow = true">duration=600 + zIndex=200</SnButton>

    <text class="sn-demo__meta">Picked: {{ picked }}</text>
    <text v-if="log.length > 0" class="sn-demo__meta">Animation events: {{ log.join(' → ') }}</text>

    <SnActionSheet
      v-model="stayOpen"
      title="Stays open after selecting"
      :actions="actions"
      cancel-text="Cancel"
      :close-on-click-action="false"
      custom-class="sn-demo-contained"
      @select="picked = $event.item.name ?? ''"
    />

    <SnActionSheet
      v-model="noScrimClose"
      title="Scrim tap does not close"
      :actions="actions"
      cancel-text="Cancel"
      :close-on-click-modal="false"
      custom-class="sn-demo-contained"
      @click-modal="record('click-modal')"
    />

    <SnActionSheet
      v-model="slow"
      title="duration=600 / zIndex=200"
      :actions="actions"
      cancel-text="Cancel"
      :duration="600"
      :z-index="200"
      custom-class="sn-demo-contained"
      @enter="record('enter')"
      @after-leave="record('after-leave')"
    />
  </view>
</template>

<style scoped>
.sn-demo--stack {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}
.sn-demo__meta {
  color: var(--sn-mp-color-text-tertiary);
  font-size: var(--sn-mp-font-size-xs);
  line-height: var(--sn-mp-font-line-height-normal);
}
/* Docs-preview only — pin the fixed layer to the phone screen. */
.sn-action-sheet.sn-demo-contained {
  position: absolute;
}
</style>
