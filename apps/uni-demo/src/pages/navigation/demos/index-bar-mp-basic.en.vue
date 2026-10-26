<script setup lang="ts">
/** Demo: sn-index-bar — alphabetical index with a jump sidebar. */
import SnIndexBar from '@snui/uni-src/components/sn-index-bar/sn-index-bar.vue';
import SnIndexAnchor from '@snui/uni-src/components/sn-index-bar/sn-index-anchor.vue';

const groups = [
  { index: 'A', names: ['Alice', 'Amy'] },
  { index: 'B', names: ['Bob', 'Bella'] },
  { index: 'C', names: ['Carl', 'Cindy'] },
];
</script>

<template>
  <view class="sn-demo sn-demo--index">
    <SnIndexBar sticky>
      <SnIndexAnchor v-for="group in groups" :key="group.index" :index="group.index">
        <view v-for="name in group.names" :key="name" class="sn-demo__row">
          <text>{{ name }}</text>
        </view>
      </SnIndexAnchor>
    </SnIndexBar>
  </view>
</template>

<style scoped>
.sn-demo--index {
  width: 100%;
  height: 240px;
}
.sn-demo__row {
  padding: 10px 12px;
  border-bottom: 1px solid var(--sn-mp-color-border-subtle);
  font-size: 24rpx;
  color: var(--sn-mp-color-text-primary);
}
</style>
