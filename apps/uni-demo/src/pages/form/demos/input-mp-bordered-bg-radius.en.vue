<script setup lang="ts">
/** Demo: sn-input — border / bg variants (radius has its own scenario). */
import SnInput from '@snui/uni-src/components/sn-input/sn-input.vue';
</script>

<template>
  <view class="sn-input-demo">
    <text class="sn-input-demo__caption">Border</text>
    <SnInput placeholder="border=&quot;all&quot; (default)" />
    <SnInput placeholder="border=&quot;bottom&quot; (inline form rows)" border="bottom" />
    <SnInput placeholder="border=&quot;none&quot;" border="none" />
    <SnInput placeholder="bordered=false (legacy alias → none)" :bordered="false" />

    <text class="sn-input-demo__caption">Background</text>
    <SnInput placeholder="bg=&quot;surface&quot; (default)" bg="surface" />
    <SnInput placeholder="bg=&quot;transparent&quot;" bg="transparent" border="none" />
    <SnInput placeholder="bg=&quot;soft&quot;" bg="soft" />
  </view>
</template>

<style scoped>
.sn-input-demo {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}
.sn-input-demo__caption {
  margin-top: 8rpx;
  font-size: 24rpx;
  color: var(--sn-mp-color-text-tertiary);
}
</style>
