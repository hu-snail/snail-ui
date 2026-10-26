<script setup lang="ts">
/** Demo: SnButton (Web) — iconPlacement + showIcon. */
import { SnButton } from '@snui/vue-web'
import { Send, ArrowRight } from 'lucide-vue-next'
</script>

<template>
  <div class="sn-demo">
    <SnButton type="primary" :icon="Send">icon left (default)</SnButton>
    <SnButton type="primary" :icon="ArrowRight" icon-placement="right">
      icon right
    </SnButton>
    <SnButton type="primary" :icon="Send" :show-icon="false">
      showIcon=false (icon hidden)
    </SnButton>
  </div>
</template>

<style scoped>
.sn-demo { display: flex; flex-wrap: wrap; gap: 8px; align-items: center; }
</style>