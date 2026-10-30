<script setup lang="ts">
/** Demo: sn-cell — layout forms (wrapping titles / column alignment / vertical / group styles). */
import SnCell from '@snui/uni-src/components/sn-cell/sn-cell.vue';
import SnCellGroup from '@snui/uni-src/components/sn-cell/sn-cell-group.vue';
</script>

<template>
  <view class="sn-demo sn-demo--column">
    <text class="sn-demo__label">Multi-line titles (long titles wrap, value stays on one line)</text>
    <SnCellGroup border>
      <SnCell title="Auto-play videos and GIFs over mobile data" value="Wi-Fi only" />
      <SnCell title="Follow system dark mode" value="On" />
    </SnCellGroup>

    <text class="sn-demo__label">Column alignment (title-width pins the title column, value left)</text>
    <SnCellGroup border :title-width="140" value-align="left">
      <SnCell title="Nickname" value="Ada" />
      <SnCell title="Birthday" value="1990-08-15" />
      <SnCell title="City" value="Hangzhou" />
    </SnCellGroup>

    <text class="sn-demo__label">Vertical layout (content drops below the title and may wrap)</text>
    <SnCellGroup border layout="vertical">
      <SnCell title="Address" value="Room 2001, Tower A, 100 Wensan Road, Xihu, Hangzhou, Zhejiang" />
      <SnCell title="Note" placeholder="Optional, call before delivery" value-align="left" />
    </SnCellGroup>

    <text class="sn-demo__label">Group styles (insert rounded card vs borderless full-bleed)</text>
    <SnCellGroup title="Rounded card" insert>
      <SnCell title="Notifications" value="On" />
      <SnCell title="Do not disturb" value="Off" />
    </SnCellGroup>
    <SnCellGroup title="Borderless" :border="false">
      <SnCell title="Notifications" value="On" />
      <SnCell title="Do not disturb" value="Off" />
    </SnCellGroup>
  </view>
</template>

<style scoped>
.sn-demo--column {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
  width: 100%;
}
.sn-demo__label {
  color: var(--sn-mp-color-text-secondary);
  font-size: var(--sn-mp-font-size-xs);
}
</style>
