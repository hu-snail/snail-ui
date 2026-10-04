<script setup lang="ts">
/** Demo: sn-button — open-type (微信小程序 MP-only attrs). */
import SnButton from '@snui/uni-src/components/sn-button/sn-button.vue'
</script>

<template>
  <view class="sn-button-demo">
    <SnButton type="primary" open-type="share">open-type=share</SnButton>
    <SnButton open-type="feedback">open-type=feedback</SnButton>
    <SnButton open-type="launchApp">open-type=launchApp</SnButton>
    <SnButton type="success" open-type="contact">open-type=contact</SnButton>
    <SnButton type="warning" open-type="chooseAvatar">open-type=chooseAvatar</SnButton>
    <SnButton open-type="getUserInfo">open-type=getUserInfo</SnButton>
  </view>
</template>

<style scoped>
.sn-button-demo { display: flex; flex-wrap: wrap; gap: 16rpx; align-items: center; }
</style>