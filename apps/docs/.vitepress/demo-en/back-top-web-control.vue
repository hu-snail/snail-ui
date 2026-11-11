<script setup lang="ts">
/** Demo: SnBackTop — controlled `show` (ignores the scroll position). */
import { ref } from 'vue';
import { SnBackTop, SnButton } from '@snui/vue-web';
import { ChevronsUp } from 'lucide-vue-next';

const controlledShow = ref(false);
</script>

<template>
  <div class="back-top-demo">
    <div class="back-top-demo__actions">
      <SnButton size="small" @click="controlledShow = !controlledShow">
        Toggle controlled visibility (currently {{ controlledShow ? 'visible' : 'hidden' }})
      </SnButton>
    </div>

    <!-- Controlled: ignores the scroll position. -->
    <SnBackTop :show="controlledShow" :right="16" :bottom="16">
      <ChevronsUp :size="18" />
    </SnBackTop>
  </div>
</template>

<style scoped>
.back-top-demo {
  position: relative;
  width: 100%;
}
.back-top-demo__actions {
  margin-bottom: 10px;
}
</style>
