<script setup lang="ts">
/** Demo: SnButton (Web) — iconPlacement + showIcon. */
import { SnButton } from '@snui/vue-web';
import { Send, ArrowRight } from 'lucide-vue-next';
</script>

<template>
  <div class="sn-demo">
    <SnButton type="primary" :icon="Send">图标在左（默认）</SnButton>
    <SnButton type="primary" :icon="ArrowRight" icon-placement="right"> 图标在右 </SnButton>
    <SnButton type="primary" :icon="Send" :show-icon="false">
      隐藏图标
    </SnButton>
  </div>
</template>

<style scoped>
.sn-demo {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
}
</style>
