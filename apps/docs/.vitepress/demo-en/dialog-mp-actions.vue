<script setup lang="ts">
/**
 * Demo: sn-dialog (uni-end) — custom action rows and beforeConfirm guard.
 * Per AUI-DOCS-016: imports the real @snui/uni sn-dialog from its SFC source.
 */
import { ref } from 'vue'
import SnButton from '@snui/uni-src/components/sn-button/sn-button.vue'
import SnDialog from '@snui/uni-src/components/sn-dialog/sn-dialog.vue'

const actionsOpen = ref(false)
const guardOpen = ref(false)
const lastAction = ref('—')

const actions = [
  { name: 'Copy link' },
  { name: 'Save offline' },
  { name: 'Delete (disabled)', disabled: true },
]

function blockConfirm(): boolean {
  return false
}
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <SnButton type="primary" block @tap="actionsOpen = true">Custom action rows</SnButton>
    <SnButton block @tap="guardOpen = true">beforeConfirm veto</SnButton>
    <text class="sn-dialog-demo__meta">Last action: {{ lastAction }}</text>

    <SnDialog
      v-model="actionsOpen"
      title="More actions"
      msg="Custom actions replace the default confirm / cancel buttons."
      :actions="actions"
      custom-class="sn-demo-contained"
      @select="lastAction = `actions picked: ${$event.item.name}`"
    />

    <SnDialog
      v-model="guardOpen"
      type="confirm"
      title="Needs a second check"
      msg="The dialog stays open while beforeConfirm returns false."
      :before-confirm="blockConfirm"
      custom-class="sn-demo-contained"
      @confirm="lastAction = 'guard passed'"
    />
  </view>
</template>

<style scoped>
.sn-demo--stack {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}
.sn-dialog-demo__meta {
  font-size: 24rpx;
  color: var(--vp-c-text-2);
}
/* Docs-preview only — see dialog-mp-basic for the rationale. */
.sn-dialog.sn-demo-contained {
  position: absolute;
}
</style>
