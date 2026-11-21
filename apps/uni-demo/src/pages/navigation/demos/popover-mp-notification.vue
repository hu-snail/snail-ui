<script setup lang="ts">
/**
 * Demo: sn-popover (uni-end) — notification card: icon plate + title +
 * subtitle timestamp + description + a full-width action pill.
 */
import { ref } from 'vue';
import SnButton from '@snui/uni-src/components/sn-button/sn-button.vue';
import SnPopover from '@snui/uni-src/components/sn-popover/sn-popover.vue';
import { Check } from '@snui/uni-src/components/sn-icon/sn-icon-set';

const open = ref(false);

const actions = [{ label: '知道了', type: 'primary' as const }];
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <view class="sn-popover-demo__center">
      <SnPopover
        v-model="open"
        title="支付成功"
        subtitle="2 分钟前"
        content="你的 ¥49.99 支付已处理完成，收据已发送至你的邮箱。"
        :icon-data="Check"
        placement="bottom"
        :actions="actions"
        custom-style="--sn-popover-icon-bg: var(--sn-mp-color-feedback-success-soft); --sn-popover-icon-color: var(--sn-mp-color-feedback-success);"
      >
        <SnButton type="primary">快捷通知</SnButton>
      </SnPopover>
    </view>

    <view class="sn-popover-demo__space" />

    <text class="sn-demo__meta">状态：{{ open ? '已展开' : '已收起' }}</text>
    <text class="sn-demo__hint"
      >subtitle 渲染标题下的弱化时间行；actions 渲染通栏胶囊按钮，点击默认收起气泡。</text
    >
  </view>
</template>

<style scoped>
.sn-demo--stack {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}
.sn-demo__meta {
  font-size: 24rpx;
  color: var(--sn-mp-color-text-tertiary);
}
.sn-demo__hint {
  font-size: 22rpx;
  color: var(--sn-mp-color-text-secondary);
}
.sn-popover-demo__center {
  display: flex;
  flex-direction: row;
  justify-content: center;
}
.sn-popover-demo__space {
  height: 420rpx;
}

/* uni-app x 的 view 默认 overflow: hidden——本 demo 的包装类全链放开，
   弹层伸出包装盒时不被裁（App.vue 全局规则只命中页面级元素与 demo 根
   节点，够不到 demo 内部包装类，AGENTS.md §103）。 */
.sn-popover-demo__center {
  overflow: visible;
}
.sn-popover-demo__space {
  overflow: visible;
}
</style>
