<script setup lang="ts">
/** Demo: SnThing — 标题 / 描述 / 正文 / 尾部 / 操作 各区域。 */
import { SnButton, SnThing } from '@snui/vue-web'
</script>

<template>
  <div class="thing-demo">
    <SnThing title="货币" description="一般等价物" content-class="thing-demo__content">
      货币是为了提高交易效率而用于交换的中介商品。货币有多种形式，如贝壳粮食等自然物、金属纸张等加工品、银行卡信用卡等磁条卡、移动支付加密货币等。
      <template #footer>发布于 2026-10-18</template>
      <template #action>
        <SnButton size="small">查看详情</SnButton>
      </template>
    </SnThing>
  </div>
</template>

<style scoped>
.thing-demo {
  width: 100%;
  max-width: 560px;
}
</style>
