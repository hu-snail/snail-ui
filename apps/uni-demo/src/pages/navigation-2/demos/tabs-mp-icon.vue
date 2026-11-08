<script setup lang="ts">
/**
 * Demo: sn-tabs — 导航项图标（icon / icon-image）与角标（badge-props）。
 *
 * - `icon` 接 IconData 数据或已注册 / 内置图标名，尺寸走 `--sn-mp-icon-size-small`
 * - `icon-image` 接图片地址（URL / base64），优先级高于 `icon`
 * - `badge-props` 透传给 `sn-badge`：数字 / 溢出上限 / 点状 / 语义色
 */
import { ref } from 'vue';
import SnTabs from '@snui/uni-src/components/sn-tabs/sn-tabs.vue';
import SnTab from '@snui/uni-src/components/sn-tabs/sn-tab.vue';
import { Home, Search, Star, Heart, Bell } from '@snui/uni-src/components/sn-icon/sn-icon-set';

const iconActive = ref(0);
const badgeActive = ref(0);
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <text class="sn-demo__label">icon 接内置图标数据（IconData）</text>
    <SnTabs v-model="iconActive">
      <SnTab title="首页" :name="0" :icon="Home">首页内容</SnTab>
      <SnTab title="搜索" :name="1" :icon="Search">搜索结果</SnTab>
      <SnTab title="收藏" :name="2" :icon="Star">收藏列表</SnTab>
      <SnTab title="喜欢" :name="3" :icon="Heart">喜欢的歌</SnTab>
    </SnTabs>

    <text class="sn-demo__label">icon 接内置图标名（字符串）</text>
    <SnTabs v-model="iconActive" type="tag" active-theme="pill">
      <SnTab title="首页" :name="0" icon="house">首页内容</SnTab>
      <SnTab title="搜索" :name="1" icon="search">搜索结果</SnTab>
      <SnTab title="收藏" :name="2" icon="star">收藏列表</SnTab>
    </SnTabs>

    <text class="sn-demo__label">badge-props 数字角标 / 溢出上限 / 点状 / 语义色</text>
    <SnTabs v-model="badgeActive">
      <SnTab title="消息" :name="0" :badge-props="{ value: 12 }">消息列表</SnTab>
      <SnTab title="待办" :name="1" :badge-props="{ value: 128, max: 99 }">待办事项</SnTab>
      <SnTab title="动态" :name="2" :badge-props="{ isDot: true, type: 'success' }"> 动态流 </SnTab>
      <SnTab title="通知" :name="3" :icon="Bell" :badge-props="{ value: 3, type: 'warning' }">
        通知列表
      </SnTab>
    </SnTabs>

    <text class="sn-demo__meta">当前页签：{{ iconActive }} / {{ badgeActive }}</text>
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
.sn-demo__meta {
  font-size: 24rpx;
  color: var(--sn-mp-color-text-tertiary);
}
</style>
