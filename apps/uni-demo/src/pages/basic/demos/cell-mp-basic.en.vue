<script setup lang="ts">
/** Demo: sn-cell — information display forms (contact / settings page rows). */
import SnCell from '@snui/uni-src/components/sn-cell/sn-cell.vue';
import SnCellGroup from '@snui/uni-src/components/sn-cell/sn-cell-group.vue';
import SnBadge from '@snui/uni-src/components/sn-badge/sn-badge.vue';
</script>

<template>
  <view class="sn-demo sn-demo--column">
    <SnCellGroup title="Profile" value="6 items">
      <SnCell title="Shipping addresses" value="3" is-link />
      <SnCell title="Phone" value="138****8000" required />
      <SnCell title="Email" value="ada@example.com" required asterisk-position="end" />
      <SnCell title="Unread notices">
        <SnBadge :value="8" :max="99" type="danger" />
      </SnCell>
      <SnCell title="Username" value="ada" label="Sign-in account for login and recovery" />
      <SnCell
        title="Bio"
        value="Do every simple thing well and nothing stays simple; do every ordinary thing well and nothing stays ordinary."
      />
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
</style>
