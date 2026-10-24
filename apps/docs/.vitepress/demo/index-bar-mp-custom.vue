<script setup lang="ts">
/** Demo: sn-index-bar — 自定义分组内容与 change 联动。 */
import { ref } from 'vue'
import SnIndexBar from '@snui/uni-src/components/sn-index-bar/sn-index-bar.vue'
import SnIndexAnchor from '@snui/uni-src/components/sn-index-bar/sn-index-anchor.vue'

const active = ref('A')
const groups = [
  { index: 'A', items: [{ name: 'Alice', meta: '产品' }, { name: 'Amy', meta: '设计' }] },
  { index: 'B', items: [{ name: 'Bob', meta: '研发' }] },
  { index: 'C', items: [{ name: 'Carl', meta: '运营' }] },
]
</script>

<template>
  <view class="sn-demo sn-demo--column">
    <view class="sn-demo__viewport">
      <SnIndexBar @change="active = String($event.index)">
        <SnIndexAnchor v-for="group in groups" :key="group.index" :index="group.index">
          <view v-for="item in group.items" :key="item.name" class="sn-demo__row">
            <text class="sn-demo__name">{{ item.name }}</text>
            <text class="sn-demo__meta">{{ item.meta }}</text>
          </view>
        </SnIndexAnchor>
      </SnIndexBar>
    </view>
    <text class="sn-demo__hint">当前索引：{{ active }}</text>
  </view>
</template>

<style scoped>
.sn-demo--column {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
}
.sn-demo__viewport {
  height: 200px;
}
.sn-demo__row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 12px;
  border-bottom: 1px solid var(--sn-mp-color-border-subtle);
}
.sn-demo__name {
  font-size: 24rpx;
  color: var(--sn-mp-color-text-primary);
}
.sn-demo__meta {
  font-size: 22rpx;
  color: var(--sn-mp-color-text-tertiary);
}
.sn-demo__hint {
  font-size: 24rpx;
  color: var(--sn-mp-color-text-tertiary);
}
</style>
