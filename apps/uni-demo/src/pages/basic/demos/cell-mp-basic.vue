<script setup lang="ts">
/**
 * Demo: sn-cell — 信息展示形态（通讯录 / 设置页的真实信息行）。
 *
 * 一个通栏分组承载五种信息行：标题+右箭头、标题+必填红星（位置可换端）、
 * 标题+徽标数值、标题+辅助说明、value 溢出自动省略。
 */
import SnCell from '@snui/uni-src/components/sn-cell/sn-cell.vue';
import SnCellGroup from '@snui/uni-src/components/sn-cell/sn-cell-group.vue';
import SnBadge from '@snui/uni-src/components/sn-badge/sn-badge.vue';
</script>

<template>
  <view class="sn-demo sn-demo--column">
    <SnCellGroup title="个人资料" value="6 项">
      <SnCell title="收货地址" value="3 条" is-link />
      <SnCell title="手机号" value="138****8000" required />
      <SnCell title="邮箱" value="ada@example.com" required asterisk-position="end" />
      <SnCell title="未读通知">
        <SnBadge :value="8" :max="99" type="danger" />
      </SnCell>
      <SnCell title="用户名" value="ada" label="登录账号，可用于登录与找回密码" />
      <SnCell
        title="个性签名"
        value="把每一件简单的事做好就是不简单，把每一件平凡的事做好就是不平凡。"
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
