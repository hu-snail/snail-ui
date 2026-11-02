<script setup lang="ts">
/**
 * Demo: sn-tabbar — 中心凸起项（elevate）。
 *
 * `elevate="{ index, icon }"` 把第 index 个标签渲染成上凸的圆形主按钮：
 * 按钮浮出栏体、带主色底 + 白字形 + 表面色描边，栏体加高让出空间；
 * 点击行为与普通标签一致。`elevate` 传 `null` 关闭。
 */
import { ref } from 'vue';
import SnTabbar from '@snui/uni-src/components/sn-tabbar/sn-tabbar.vue';
import SnTabbarItem from '@snui/uni-src/components/sn-tabbar/sn-tabbar-item.vue';

const active = ref(2);
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <view class="sn-tabbar-demo__stage">
      <text class="sn-tabbar-demo__hint"
        >elevate={ index: 2, icon: 'plus' } — 中间凸起发布按钮</text
      >

      <SnTabbar
        v-model="active"
        :elevate="{ index: 2, icon: 'plus' }"
        bordered
        custom-class="sn-demo-contained"
      >
        <SnTabbarItem title="首页" icon="house" />
        <SnTabbarItem title="发现" icon="search" />
        <SnTabbarItem title="发布" />
        <SnTabbarItem title="消息" icon="bell" />
        <SnTabbarItem title="我的" icon="user" />
      </SnTabbar>
    </view>

    <text class="sn-demo__meta">当前索引：{{ active }}（点凸起按钮同样切换）</text>
  </view>
</template>

<style scoped>
.sn-demo--stack {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}
.sn-tabbar-demo__stage {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  height: 480rpx;
  overflow: visible;
  border: 2rpx solid var(--sn-mp-color-border-subtle);
  border-radius: var(--sn-mp-radius-md);
  background-color: var(--sn-mp-color-background-sunken);
}
.sn-tabbar-demo__hint {
  padding: var(--sn-mp-spacing-4);
  font-size: 24rpx;
  color: var(--sn-mp-color-text-tertiary);
}
.sn-tabbar-demo__stage :deep(.sn-tabbar.sn-demo-contained) {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
}
.sn-demo__meta {
  font-size: 24rpx;
  color: var(--sn-mp-color-text-tertiary);
}
</style>
