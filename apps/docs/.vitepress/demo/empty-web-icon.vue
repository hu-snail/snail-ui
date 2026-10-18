<script setup lang="ts">
/** Demo: SnEmpty — icon 槽位自定义图标 + extra 槽位放操作。 */
import { Inbox } from 'lucide-vue-next'
import { registerSnIcons, SnButton, SnEmpty, SnIcon } from '@snui/vue-web'

registerSnIcons({ Inbox })
</script>

<template>
  <div class="empty-demo">
    <SnEmpty description="搜索结果为空">
      <template #icon>
        <SnIcon :icon="Inbox" :size="40" />
      </template>
      <template #extra>
        <SnButton size="small">清空筛选条件</SnButton>
      </template>
    </SnEmpty>
  </div>
</template>

<style scoped>
.empty-demo {
  display: flex;
  justify-content: center;
  padding: 24px 0;
  width: 100%;
}
</style>
