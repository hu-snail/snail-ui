<script setup lang="ts">
/** Demo: sn-cell — 链接箭头、图标与点击反馈。 */
import { ref } from 'vue';
import SnCell from '@snui/uni-src/components/sn-cell/sn-cell.vue';
import SnCellGroup from '@snui/uni-src/components/sn-cell/sn-cell-group.vue';

const tapped = ref('—');
</script>

<template>
  <view class="sn-demo sn-demo--column">
    <SnCellGroup title="设置">
      <SnCell
        title="消息通知"
        label="接收推送与提醒"
        is-link
        prefix-icon="Bell"
        @click="tapped = '消息通知'"
      />
      <SnCell
        title="账号安全"
        value="已开启"
        is-link
        arrow-direction="down"
        prefix-icon="User"
        @click="tapped = '账号安全'"
      />
      <SnCell title="关于" value="v0.1.0" clickable @click="tapped = '关于'" />
    </SnCellGroup>
    <text class="sn-demo__meta">最近点击：{{ tapped }}</text>
  </view>
</template>

<style scoped>
.sn-demo--column {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
}
.sn-demo__meta {
  font-size: 24rpx;
  color: var(--sn-mp-color-text-tertiary);
}
</style>
