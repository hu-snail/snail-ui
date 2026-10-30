<script setup lang="ts">
/**
 * Demo: sn-cell — 可点击行（箭头 / 开关值 / 按钮值 / 辅助说明+箭头）。
 *
 * 点击反馈真实可触发：开关行切换 value、按钮行只响应按钮本身
 * （行不可点击，避免冒泡双触发）、箭头行记录动作到反馈区。
 */
import { ref } from 'vue';
import SnCell from '@snui/uni-src/components/sn-cell/sn-cell.vue';
import SnCellGroup from '@snui/uni-src/components/sn-cell/sn-cell-group.vue';
import SnButton from '@snui/uni-src/components/sn-button/sn-button.vue';

const notificationsOn = ref(true);
const lastAction = ref('尚未操作');

function toggleNotifications(): void {
  notificationsOn.value = !notificationsOn.value;
  lastAction.value = notificationsOn.value ? '已开启消息通知' : '已关闭消息通知';
}

function record(action: string): void {
  lastAction.value = action;
}
</script>

<template>
  <view class="sn-demo sn-demo--column">
    <SnCellGroup>
      <SnCell
        title="消息通知"
        :value="notificationsOn ? '已开启' : '已关闭'"
        clickable
        @click="toggleNotifications"
      />
      <SnCell title="收货地址" value="3 条" is-link @click="record('打开收货地址')" />
      <SnCell title="意见反馈">
        <SnButton size="small" type="primary" @click="record('提交了一条反馈')">去反馈</SnButton>
      </SnCell>
      <SnCell
        title="账号与安全"
        label="修改密码、绑定手机、注销账号"
        is-link
        @click="record('打开账号与安全')"
      />
    </SnCellGroup>
    <text class="sn-demo__meta">最近操作：{{ lastAction }}</text>
  </view>
</template>

<style scoped>
.sn-demo--column {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
  width: 100%;
}
.sn-demo__meta {
  color: var(--sn-mp-color-text-tertiary);
  font-size: var(--sn-mp-font-size-xs);
}
</style>
