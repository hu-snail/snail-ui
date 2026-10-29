<script setup lang="ts">
/**
 * 模板 Tab：探索 —— 原生 tabBar 第二项，占位引导页。
 * 深浅色跟随系统（useTplTheme 同步原生 chrome，.sn-theme-dark 翻转变量）。
 */
import SnButton from '@snui/uni-src/components/sn-button/sn-button.vue';
import SnEmpty from '@snui/uni-src/components/sn-empty/sn-empty.vue';
import SnNavbar from '@snui/uni-src/components/sn-navbar/sn-navbar.vue';
import { useTplTheme } from '../../common/theme';

const { isDark } = useTplTheme();

function goHome(): void {
  uni.switchTab({ url: '/pages/index/index' });
}
</script>

<template>
  <view class="tpl-page tabpage" :class="{ 'sn-theme-dark': isDark }">
    <SnNavbar title="探索" fixed safe-area-inset-top :custom-style="'background-color: var(--tplh-nav);'" />
    <view class="tabpage__space" aria-hidden="true" />
    <view class="tabpage__body">
      <SnEmpty icon="sparkles" tip="探索发现能力建设中，先去逛逛模板库" />
      <SnButton
        type="primary"
        bg-color="#35a257"
        :custom-style="{ borderRadius: '999rpx', borderColor: '#35a257' }"
        @click="goHome"
      >去逛模板</SnButton>
    </view>
  </view>
</template>

<style scoped>
.tabpage {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: var(--tplh-bg);
  color: var(--tplh-text);
}
.tabpage__space {
  flex-shrink: 0;
  height: calc(var(--status-bar-height, 0px) + 88rpx);
}
.tabpage__body {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 40rpx;
  padding: 0 48rpx calc(env(safe-area-inset-bottom) + 48rpx);
}
</style>
