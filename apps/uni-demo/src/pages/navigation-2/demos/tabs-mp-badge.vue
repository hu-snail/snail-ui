<script setup lang="ts">
/**
 * Demo: sn-tabs — 角标（badge-props）。
 *
 * `badge-props` 透传给 `sn-badge`，对齐 wd-tab 的同名 prop：
 *   - `value` 数字 / 字符串；数字超过 `max` 显示 `{max}+`
 *   - `isDot` 只画一个点，不显示数字
 *   - `type` 语义色 primary / success / warning / danger / info（默认危险红）
 *   - `showZero` 让 `0` 也渲染出来（默认 0 不显示角标）
 *   - `hidden` 隐藏角标但保留内容
 */
import { ref } from 'vue';
import SnTabs from '@snui/uni-src/components/sn-tabs/sn-tabs.vue';
import SnTab from '@snui/uni-src/components/sn-tabs/sn-tab.vue';
import SnButton from '@snui/uni-src/components/sn-button/sn-button.vue';

const active = ref(0);
const unread = ref(12);
const showZero = ref(false);
const hidden = ref(false);
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <text class="sn-demo__label">数字角标与语义色</text>
    <SnTabs v-model="active">
      <SnTab title="消息" :name="0" :badge-props="{ value: unread }">消息列表</SnTab>
      <SnTab title="待办" :name="1" :badge-props="{ value: 128, max: 99, type: 'primary' }">
        待办事项
      </SnTab>
      <SnTab title="提醒" :name="2" :badge-props="{ value: 5, type: 'warning' }">提醒列表</SnTab>
      <SnTab title="异常" :name="3" :badge-props="{ value: 2, type: 'danger' }">异常记录</SnTab>
    </SnTabs>

    <text class="sn-demo__label">点状角标 / 零值 / 隐藏</text>
    <SnTabs v-model="active" type="tag" active-theme="fill">
      <SnTab title="动态" :name="0" :badge-props="{ isDot: true, type: 'success' }">动态流</SnTab>
      <SnTab title="草稿" :name="1" :badge-props="{ value: 0, showZero: showZero, type: 'info' }">
        草稿箱
      </SnTab>
      <SnTab title="归档" :name="2" :badge-props="{ value: 9, hidden: hidden }">归档记录</SnTab>
    </SnTabs>

    <view class="sn-demo__row">
      <SnButton size="small" @click="unread = unread === 12 ? 120 : 12">
        未读数：{{ unread }}
      </SnButton>
      <SnButton size="small" @click="showZero = !showZero">
        showZero：{{ showZero ? '开' : '关' }}
      </SnButton>
      <SnButton size="small" @click="hidden = !hidden">
        hidden：{{ hidden ? '开' : '关' }}
      </SnButton>
    </view>

    <text class="sn-demo__meta">当前页签：{{ active }}</text>
  </view>
</template>

<style scoped>
.sn-demo--stack {
  display: flex;
  flex-direction: column;
  gap: var(--sn-mp-spacing-4);
  align-items: stretch;
}
.sn-demo__label {
  font-size: 24rpx;
  color: var(--sn-mp-color-text-secondary);
}
.sn-demo__row {
  display: flex;
  flex-wrap: wrap;
  gap: var(--sn-mp-spacing-3);
  align-items: center;
}
.sn-demo__meta {
  font-size: 24rpx;
  color: var(--sn-mp-color-text-tertiary);
}
</style>
