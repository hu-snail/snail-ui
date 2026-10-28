<script setup lang="ts">
/** 模板：通讯录 —— 搜索 / 字母索引分组。 */
import { ref } from 'vue';
import SnAvatar from '@snui/uni-src/components/sn-avatar/sn-avatar.vue';
import SnSearch from '@snui/uni-src/components/sn-search/sn-search.vue';

const keyword = ref('');
const groups = [
  { letter: 'W', names: ['蜗蜗', '汪汪'] },
  { letter: 'L', names: ['林一', '刘小二'] },
  { letter: 'C', names: ['陈三', '程四'] },
];
</script>

<template>
  <view class="tpl-page ct">
    <view class="ct__search">
      <SnSearch v-model="keyword" placeholder="搜索联系人" />
    </view>
    <view v-for="g in groups" :key="g.letter" class="ct__group">
      <text class="ct__letter">{{ g.letter }}</text>
      <view v-for="name in g.names" :key="name" class="ct__row">
        <SnAvatar :text="name.slice(0, 1)" :size="64" round />
        <text class="ct__name">{{ name }}</text>
        <text class="ct__chevron">›</text>
      </view>
    </view>
  </view>
</template>

<style scoped>
.ct {
  background: #ffffff;
  min-height: 100vh;
}
.ct__search {
  padding: 20rpx 24rpx;
}
.ct__group {
  display: flex;
  flex-direction: column;
}
.ct__letter {
  padding: 12rpx 24rpx 6rpx;
  font-size: 22rpx;
  font-weight: 700;
  color: #b3bac6;
  background: #f7f8fa;
}
.ct__row {
  display: flex;
  align-items: center;
  gap: 20rpx;
  padding: 18rpx 24rpx;
}
.ct__name {
  flex: 1;
  font-size: 28rpx;
}
.ct__chevron {
  color: #b3bac6;
  font-size: 32rpx;
}
</style>
