<script setup lang="ts">
/** Demo: sn-tag (uni-end) — closable 筛选条件 + dynamic 新增标签。 */
import { ref } from 'vue';
import SnTag from '@snui/uni-src/components/sn-tag/sn-tag.vue';

/** 已选筛选条件：点关闭即移除，清空后点虚线标签整体恢复。 */
const filters = ref(['数码', '户外', '美食', '影音']);

function removeFilter(filter: string): void {
  filters.value = filters.value.filter((item) => item !== filter);
}

function resetFilters(): void {
  filters.value = ['数码', '户外', '美食', '影音'];
}

/** dynamic 新增：确认后进入已添加列表，同样可关闭。 */
const added = ref<string[]>([]);

function addTag(payload: { value: string }): void {
  const value = payload.value.trim();
  if (value !== '') added.value.push(value);
}

function removeAdded(tag: string): void {
  added.value = added.value.filter((item) => item !== tag);
}
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <view class="sn-demo__row">
      <template v-if="filters.length > 0">
        <SnTag
          v-for="filter in filters"
          :key="filter"
          type="primary"
          variant="light"
          closable
          @close="removeFilter(filter)"
        >
          {{ filter }}
        </SnTag>
      </template>
      <SnTag v-else variant="dashed" @click="resetFilters">已清空，点此恢复</SnTag>
    </view>

    <view class="sn-demo__row">
      <SnTag dynamic type="primary" variant="plain" @confirm="addTag" />
      <SnTag
        v-for="tag in added"
        :key="tag"
        type="primary"
        closable
        @close="removeAdded(tag)"
      >
        {{ tag }}
      </SnTag>
    </view>
  </view>
</template>

<style scoped>
.sn-demo--stack {
  display: flex;
  flex-direction: column;
  gap: var(--sn-mp-spacing-5);
  align-items: flex-start;
}

.sn-demo__row {
  display: flex;
  flex-wrap: wrap;
  gap: var(--sn-mp-spacing-4) var(--sn-mp-spacing-5);
  align-items: center;
}
</style>
