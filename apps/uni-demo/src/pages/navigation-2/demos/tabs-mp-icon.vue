<script setup lang="ts">
/**
 * Demo: sn-tabs — 页签图标（icon / icon-image）。
 *
 * - `icon` 接 IconData 数据或已注册 / 内置图标名，尺寸走 `--sn-mp-icon-size-small`
 * - `icon-image` 接图片地址（URL / base64），优先级高于 `icon`
 */
import { ref } from 'vue';
import SnTabs from '@snui/uni-src/components/sn-tabs/sn-tabs.vue';
import SnTab from '@snui/uni-src/components/sn-tabs/sn-tab.vue';
import { Home, Search, Star, Heart } from '@snui/uni-src/components/sn-icon/sn-icon-set';

const iconActive = ref(0);
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

    <text class="sn-demo__meta">当前页签：{{ iconActive }}（badge-props 见 tabs-mp-badge）</text>
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
