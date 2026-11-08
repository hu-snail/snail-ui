<script setup lang="ts">
/** Demo: sn-tag (uni-end) — 基础用法：十种语义色覆盖任务状态与内容分类。 */
import SnTag from '@snui/uni-src/components/sn-tag/sn-tag.vue';

/** 任务状态：default 也能承场景（草稿），其余走语义色。 */
const stages = [
  { type: 'default', label: '草稿' },
  { type: 'primary', label: '进行中' },
  { type: 'success', label: '已完成' },
  { type: 'warning', label: '待处理' },
  { type: 'danger', label: '已逾期' },
] as const;

/** 内容分类：运营标记常用五色。 */
const topics = [
  { type: 'volcano', label: '热门' },
  { type: 'lightblue', label: '公告' },
  { type: 'cyan', label: '新品' },
  { type: 'pink', label: '推荐' },
  { type: 'purple', label: '会员' },
] as const;
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <view class="sn-demo__row">
      <SnTag v-for="stage in stages" :key="stage.type" :type="stage.type">
        {{ stage.label }}
      </SnTag>
    </view>
    <view class="sn-demo__row">
      <SnTag v-for="topic in topics" :key="topic.type" :type="topic.type">
        {{ topic.label }}
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
