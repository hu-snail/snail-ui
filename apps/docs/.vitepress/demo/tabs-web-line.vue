<script setup lang="ts">
/**
 * tabs-web-line — SnTabs `type="line"` with an underline indicator.
 * The most common shape for detail-page section switching.
 */
import { ref } from 'vue';
import { SnTabs, SnTabPane } from '@snui/vue-web';

const active = ref<string>('detail');
</script>

<template>
  <div class="tabs-demo">
    <SnTabs v-model:value="active" type="line">
      <SnTabPane name="detail" tab="基本信息"> 名称、标识、创建时间、负责人。 </SnTabPane>
      <SnTabPane name="members" tab="成员"> 当前 12 名成员，3 名管理员。 </SnTabPane>
      <SnTabPane name="logs" tab="操作日志"> 最近 30 天共 148 条操作记录。 </SnTabPane>
      <SnTabPane name="archive" tab="归档" disabled> 该分组未开启归档能力。 </SnTabPane>
    </SnTabs>
  </div>
</template>

<style scoped>
.tabs-demo {
  width: 100%;
}
</style>
