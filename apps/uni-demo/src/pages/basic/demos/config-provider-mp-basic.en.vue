<script setup lang="ts">
/**
 * Demo: sn-config-provider — scoped configuration.
 *
 * Shows the containment guarantee: the wrapper carries the skin class, and a
 * sibling outside it stays untouched.
 */
import SnConfigProvider from '@snui/uni-src/components/sn-config-provider/sn-config-provider.vue';
import SnButton from '@snui/uni-src/components/sn-button/sn-button.vue';
import SnTag from '@snui/uni-src/components/sn-tag/sn-tag.vue';
</script>

<template>
  <view class="sn-demo sn-demo--column">
    <SnConfigProvider custom-class="sn-cfg-demo__box">
      <view class="sn-cfg-demo__inner">
        <SnTag type="primary">Inside the provider</SnTag>
        <SnButton type="primary" size="small">Inherits too</SnButton>
      </view>
    </SnConfigProvider>

    <view class="sn-cfg-demo__inner sn-cfg-demo__inner--plain">
      <SnTag type="primary">Outside the provider</SnTag>
    </view>
  </view>
</template>

<style scoped>
.sn-cfg-demo__box {
  display: block;
  padding: 8px;
  border: 1px dashed var(--sn-mp-color-border-default);
  border-radius: 8px;
}

.sn-cfg-demo__inner {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
}

.sn-cfg-demo__inner--plain {
  padding: 8px;
  border: 1px dashed var(--sn-mp-color-border-subtle);
  border-radius: 8px;
}
</style>
