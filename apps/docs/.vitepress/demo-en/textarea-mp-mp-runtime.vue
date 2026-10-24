<script setup lang="ts">
/** Demo: sn-textarea — native textarea attributes (caret / keyboard / confirm key / composition). */
import { ref } from 'vue'
import SnTextarea from '@snui/uni-src/components/sn-textarea/sn-textarea.vue'

const preset = ref('Pre-selected sample text')
const confirm = ref('')
const composing = ref('')
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <text class="sn-demo__title">focus / autoFocus + fixed (the keyboard does not push the page)</text>
    <SnTextarea v-model="preset" focus fixed placeholder="Focused on mount + fixed mode" />
    <SnTextarea v-model="preset" auto-focus placeholder="autoFocus raises the keyboard on mount" />

    <text class="sn-demo__title">cursor + selectionStart / selectionEnd</text>
    <SnTextarea v-model="preset" :cursor="3" :selection-start="0" :selection-end="4" />

    <text class="sn-demo__title">confirmType + confirmHold + showConfirmBar</text>
    <SnTextarea
      v-model="confirm"
      confirm-type="send"
      confirm-hold
      :show-confirm-bar="false"
      placeholder="The confirm key reads Send and the toolbar is hidden"
    />

    <text class="sn-demo__title">cursorSpacing / adjustPosition / disableDefaultPadding / holdKeyboard</text>
    <SnTextarea
      v-model="preset"
      :cursor-spacing="20"
      :adjust-position="false"
      disable-default-padding
      hold-keyboard
      placeholder="20px caret spacing, no auto page push, iOS inner padding removed"
    />

    <text class="sn-demo__title">ignoreCompositionEvent / enableNative / inputmode</text>
    <SnTextarea
      v-model="composing"
      :ignore-composition-event="false"
      :enable-native="false"
      inputmode="text"
      placeholder="input also fires mid-composition (Alipay MP uses the simulated field)"
    />
  </view>
</template>

<style scoped>
.sn-demo__title {
  font-size: 26rpx;
  font-weight: 600;
  color: var(--sn-mp-color-text-secondary);
}
</style>
