<script setup lang="ts">
/**
 * Demo: sn-config-provider — dark mode containment.
 *
 * Two subtrees side by side: the dark one carries `.sn-theme-dark`, so every
 * component inside it resolves the dark `--sn-mp-color-*` aliases while the
 * light sibling keeps the page-level values.
 */
import SnConfigProvider from '@snui/uni-src/components/sn-config-provider/sn-config-provider.vue';
import SnButton from '@snui/uni-src/components/sn-button/sn-button.vue';
import SnTag from '@snui/uni-src/components/sn-tag/sn-tag.vue';
import SnSwitch from '@snui/uni-src/components/sn-switch/sn-switch.vue';
import { ref } from 'vue';

const darkOn = ref(true);
const lightOn = ref(false);
</script>

<template>
  <view class="sn-demo sn-demo--column">
    <SnConfigProvider theme="dark" custom-class="sn-cfg-dark__pane">
      <view class="sn-cfg-dark__label">theme="dark"</view>
      <view class="sn-cfg-dark__row">
        <SnTag type="primary">Tag</SnTag>
        <SnSwitch v-model="darkOn" />
      </view>
    </SnConfigProvider>

    <SnConfigProvider theme="light" custom-class="sn-cfg-dark__pane">
      <view class="sn-cfg-dark__label">theme="light"</view>
      <view class="sn-cfg-dark__row">
        <SnTag type="primary">Tag</SnTag>
        <SnSwitch v-model="lightOn" />
      </view>
    </SnConfigProvider>
  </view>
</template>

<style scoped>
.sn-cfg-dark__pane {
  display: block;
  padding: 10px;
  border: 1px solid var(--sn-mp-color-border-default);
  border-radius: 8px;
  background: var(--sn-mp-color-background-surface);
}

.sn-cfg-dark__label {
  margin-bottom: 8px;
  font-size: 12px;
  color: var(--sn-mp-color-text-secondary);
}

.sn-cfg-dark__row {
  display: flex;
  align-items: center;
  gap: 10px;
}
</style>
