<script setup lang="ts">
/** Demo: SnCode — code prop updates reactively (loop debug). */
import { onBeforeUnmount, ref } from 'vue'
import { SnCode } from '@snui/vue-web'

const code = ref('')

const timer = window.setInterval(() => {
  code.value = `Current: ${String(new Date())}`
}, 1000)

onBeforeUnmount(() => {
  window.clearInterval(timer)
})
</script>

<template>
  <div class="sn-demo">
    <SnCode :code="code" />
  </div>
</template>

<style scoped>
.sn-demo {
  color: var(--sn-web-color-text-primary);
}
</style>
