<script setup lang="ts">
/**
 * Demo: sn-paging (uni-end) — 状态：空态 / 失败重试 / 手动重新加载。
 *
 * - total=0 时首屏走内置空态（可用 empty 插槽自定义）
 * - 「下次失败」让下一次请求返回失败：首屏失败显示可点击重试的页脚，
 *   翻页失败则停在原列表、页脚可重试同一页
 * - reload() 不播放下拉动画，refresh() 会播放
 */
import { ref } from 'vue';
import SnPaging from '@snui/uni-src/components/sn-paging/sn-paging.vue';
import SnButton from '@snui/uni-src/components/sn-button/sn-button.vue';

const TOTAL = 20;
const PAGE_SIZE = 5;
const list = ref<string[]>([]);
const paging = ref<InstanceType<typeof SnPaging> | null>(null);
const total = ref(TOTAL);
const failNext = ref(false);

function query(pageNo: number, pageSize: number): void {
  setTimeout(() => {
    if (failNext.value) {
      failNext.value = false;
      paging.value?.complete(false);
      return;
    }
    const start = (pageNo - 1) * pageSize;
    const rows = Array.from(
      { length: Math.max(0, Math.min(pageSize, total.value - start)) },
      (_, i) => `条目 ${start + i + 1}`,
    );
    paging.value?.completeByTotal(rows, total.value);
  }, 500);
}

function load(next: number): void {
  total.value = next;
  paging.value?.reload();
}
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <view class="paging-controls">
      <SnButton size="small" @click="load(TOTAL)">重新加载</SnButton>
      <SnButton size="small" @click="load(0)">空数据</SnButton>
      <SnButton size="small" type="danger" plain @click="failNext = true">下次失败</SnButton>
    </view>
    <view class="paging-frame">
      <SnPaging ref="paging" v-model="list" :default-page-size="PAGE_SIZE" @query="query">
        <view v-for="row in list" :key="row" class="paging-row">
          <text class="paging-row__label">{{ row }}</text>
        </view>
        <template #empty>
          <view class="paging-empty">
            <text class="paging-empty__text">这里还没有内容</text>
          </view>
        </template>
      </SnPaging>
    </view>
  </view>
</template>

<style scoped>
.paging-controls {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: var(--sn-mp-spacing-2);
}

.paging-frame {
  box-sizing: border-box;
  height: 480rpx;
  border: 2rpx solid var(--sn-mp-color-border-default);
  border-radius: var(--sn-mp-radius-md);
  overflow: hidden;
}

.paging-row {
  box-sizing: border-box;
  width: 100%;
  padding: var(--sn-mp-spacing-4);
  border-bottom: 2rpx solid var(--sn-mp-color-border-subtle);
  background-color: var(--sn-mp-color-background-surface);
}

.paging-row__label {
  color: var(--sn-mp-color-text-primary);
  font-size: var(--sn-mp-font-size-md);
  line-height: var(--sn-mp-font-line-height-normal);
}

.paging-empty {
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  width: 100%;
  padding: var(--sn-mp-spacing-10) var(--sn-mp-spacing-4);
}

.paging-empty__text {
  color: var(--sn-mp-color-text-tertiary);
  font-size: var(--sn-mp-font-size-sm);
  line-height: var(--sn-mp-font-line-height-normal);
}
</style>
