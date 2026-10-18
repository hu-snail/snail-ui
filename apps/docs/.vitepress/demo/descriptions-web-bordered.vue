<script setup lang="ts">
/** Demo: SnDescriptions — bordered 描边网格（含左置 label 变体）。 */
import { SnDescriptions, SnDescriptionsItem } from '@snui/vue-web'
</script>

<template>
  <div class="descriptions-demo">
    <SnDescriptions title="多行内容建议开启 bordered" bordered>
      <SnDescriptionsItem label="早餐">苹果</SnDescriptionsItem>
      <SnDescriptionsItem label="午餐">苹果</SnDescriptionsItem>
      <SnDescriptionsItem label="晚餐">苹果</SnDescriptionsItem>
      <SnDescriptionsItem label="备注">
        多行信息在描边网格里更容易对齐阅读，长文本会自动撑开所在单元格。
      </SnDescriptionsItem>
    </SnDescriptions>

    <SnDescriptions title="bordered + label-placement = left" bordered label-placement="left" label-align="right">
      <SnDescriptionsItem label="早餐">苹果</SnDescriptionsItem>
      <SnDescriptionsItem label="午餐">苹果</SnDescriptionsItem>
      <SnDescriptionsItem label="晚餐">苹果</SnDescriptionsItem>
    </SnDescriptions>
  </div>
</template>

<style scoped>
.descriptions-demo {
  display: flex;
  flex-direction: column;
  gap: 24px;
  width: 100%;
}
</style>
