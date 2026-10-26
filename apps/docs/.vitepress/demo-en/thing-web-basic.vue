<script setup lang="ts">
/** Demo: SnThing — 标题 / 描述 / 正文 / 尾部 / 操作 各区域。 */
import { SnButton, SnThing } from '@snui/vue-web'
</script>

<template>
  <div class="thing-demo">
    <SnThing title="Currency" description="A general equivalent" content-class="thing-demo__content">
      Money is a medium commodity used in exchange to make trading more efficient. It takes many forms: natural goods such as shells and grain, processed goods such as metal and paper, magnetic-strip cards such as bank and credit cards, and mobile payments and cryptocurrencies.
      <template #footer>Published 2026-10-18</template>
      <template #action>
        <SnButton size="small">View details</SnButton>
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
