<script setup lang="ts">
/** Demo: sn-textarea — 小程序原生 textarea 属性（光标 / 键盘 / 确认键 / 合成事件）。 */
import { ref } from 'vue'
import SnTextarea from '@snui/uni-src/components/sn-textarea/sn-textarea.vue'

const preset = ref('预选区域示例文本')
const confirm = ref('')
const composing = ref('')
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <text class="sn-demo__title">focus / autoFocus + fixed（键盘弹起不上推页面）</text>
    <SnTextarea v-model="preset" focus fixed placeholder="挂载即聚焦 + fixed 模式" />
    <SnTextarea v-model="preset" auto-focus placeholder="autoFocus 挂载即拉起键盘" />

    <text class="sn-demo__title">cursor + selectionStart / selectionEnd</text>
    <SnTextarea v-model="preset" :cursor="3" :selection-start="0" :selection-end="4" />

    <text class="sn-demo__title">confirmType + confirmHold + showConfirmBar</text>
    <SnTextarea
      v-model="confirm"
      confirm-type="send"
      confirm-hold
      :show-confirm-bar="false"
      placeholder="键盘右下角是「发送」，且不显示完成工具栏"
    />

    <text class="sn-demo__title">cursorSpacing / adjustPosition / disableDefaultPadding / holdKeyboard</text>
    <SnTextarea
      v-model="preset"
      :cursor-spacing="20"
      :adjust-position="false"
      disable-default-padding
      hold-keyboard
      placeholder="20px 光标间距，页面不自动上推，去掉 iOS 内边距"
    />

    <text class="sn-demo__title">ignoreCompositionEvent / enableNative / inputmode</text>
    <SnTextarea
      v-model="composing"
      :ignore-composition-event="false"
      :enable-native="false"
      inputmode="text"
      placeholder="合成期间也触发 input（支付宝小程序用非原生输入框）"
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
