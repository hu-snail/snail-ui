<script setup lang="ts">
/** Demo: SnDescriptionsItem — span 让条目占据多列。 */
import { SnDescriptions, SnDescriptionsItem } from '@snui/vue-web'
</script>

<template>
  <div class="descriptions-demo">
    <SnDescriptions title="缺陷单" bordered>
      <SnDescriptionsItem label="缺陷编号">AUI-WEB-DD-005</SnDescriptionsItem>
      <SnDescriptionsItem label="级别">P1</SnDescriptionsItem>
      <SnDescriptionsItem label="状态" :span="2">修复中 · 预计本周回归</SnDescriptionsItem>
      <SnDescriptionsItem label="现象描述" :span="3">
        多列网格在 label-placement 为 left 时，最后一列内容单元格没有撑满剩余轨道。
      </SnDescriptionsItem>
    </SnDescriptions>
  </div>
</template>

<style scoped>
.descriptions-demo {
  width: 100%;
}
</style>
