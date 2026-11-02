<script setup lang="ts">
/**
 * Demo: sn-tabbar — 激活 / 未激活颜色覆盖与 name 取值。
 *
 * - `active-color` / `inactive-color` 内联覆盖文案颜色（空串 = 令牌默认）
 * - 子项不传 `name` 时以注册顺序的索引为值，传了 `name` 就以 `name` 为准
 */
import { ref } from 'vue';
import SnTabbar from '@snui/uni-src/components/sn-tabbar/sn-tabbar.vue';
import SnTabbarItem from '@snui/uni-src/components/sn-tabbar/sn-tabbar-item.vue';

const indexValue = ref(0);
const namedValue = ref('inbox');
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <SnTabbar
      v-model="indexValue"
      active-color="var(--sn-mp-color-action-primary)"
      inactive-color="var(--sn-mp-color-text-disabled)"
      bordered
    >
      <SnTabbarItem title="首页" icon="house" />
      <SnTabbarItem title="发现" icon="search" />
      <SnTabbarItem title="我的" icon="user" />
    </SnTabbar>

    <text class="sn-demo__meta">索引取值：{{ indexValue }}</text>

    <SnTabbar v-model="namedValue" active-color="var(--sn-mp-color-feedback-success)" bordered>
      <SnTabbarItem title="收件箱" name="inbox" icon="bell" />
      <SnTabbarItem title="收藏" name="star" icon="star" />
      <SnTabbarItem title="设置" name="settings" icon="settings" />
    </SnTabbar>

    <text class="sn-demo__meta">name 取值：{{ namedValue }}</text>
  </view>
</template>

<style scoped>
.sn-demo__meta {
  font-size: 24rpx;
  color: var(--sn-mp-color-text-tertiary);
}
</style>
