<script setup lang="ts">
/** Demo: SnList — header / items / footer + prefix / suffix 槽位。 */
import { SnList, SnListItem } from '@snui/vue-web'
</script>

<template>
  <div class="list-demo">
    <SnList>
      <template #header>待办事项</template>
      <SnListItem>
        <template #prefix>1</template>
        补齐数据展示组件测试
        <template #suffix>今天</template>
      </SnListItem>
      <SnListItem>
        <template #prefix>2</template>
        过审 Descriptions 文档
        <template #suffix>明天</template>
      </SnListItem>
      <SnListItem>
        <template #prefix>3</template>
        排期 Timeline 水平模式
        <template #suffix>本周</template>
      </SnListItem>
      <template #footer>共 3 项</template>
    </SnList>
  </div>
</template>

<style scoped>
.list-demo {
  width: 100%;

}
</style>
