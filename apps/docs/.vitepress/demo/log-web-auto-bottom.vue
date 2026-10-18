<script setup lang="ts">
/** Demo: SnLog — keep the viewer scrolled to the newest line. */
import { nextTick, onBeforeUnmount, ref, watchEffect } from 'vue'
import { SnButton, SnLog } from '@snui/vue-web'

function makeLog(): string {
  const lines: string[] = []
  for (let i = 0; i < 10; ++i) {
    lines.push(Math.random().toString(16))
  }
  return `${lines.join('\n')}\n`
}

const log = ref(makeLog())
const logRef = ref<InstanceType<typeof SnLog> | null>(null)
const running = ref(false)
let timer: number | null = null

function toggleRun() {
  running.value = !running.value
  if (running.value) {
    timer = window.setInterval(() => {
      log.value = log.value + makeLog()
    }, 1000)
  } else if (timer !== null) {
    window.clearInterval(timer)
    timer = null
  }
}

onBeforeUnmount(() => {
  if (timer !== null) {
    window.clearInterval(timer)
    timer = null
  }
})

watchEffect(() => {
  if (log.value) {
    void nextTick(() => {
      logRef.value?.scrollTo({ position: 'bottom', silent: true })
    })
  }
})
</script>

<template>
  <div class="sn-demo">
    <div class="sn-demo__toolbar">
      <SnButton size="small" @click="toggleRun">
        {{ running ? '停止追加' : '追加数据' }}
      </SnButton>
    </div>
    <SnLog ref="logRef" :log="log" trim />
  </div>
</template>

<style scoped>
.sn-demo__toolbar {
  display: flex;
  gap: 8px;
  margin-bottom: 8px;
}

.sn-demo {
  color: var(--sn-web-color-text-primary);
}
</style>
