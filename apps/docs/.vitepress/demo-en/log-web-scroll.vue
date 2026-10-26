<script setup lang="ts">
/** Demo: SnLog — programmatic scrollTo with and without silent. */
import { ref } from 'vue'
import { SnButton, SnLog } from '@snui/vue-web'

interface ScrollToOptions {
  top?: number
  position?: 'top' | 'bottom'
  silent?: boolean
}

function makeLog(): string {
  const lines: string[] = []
  for (let i = 0; i < 10; ++i) {
    lines.push(Math.random().toString(16))
  }
  return `${lines.join('\n')}\n`
}

const log = ref(makeLog())
const lastEvent = ref('(no events)')

const logRef = ref<InstanceType<typeof SnLog> | null>(null)

function scrollTo(options: ScrollToOptions) {
  logRef.value?.scrollTo(options)
}

function noteEvent(name: string) {
  lastEvent.value = name
}
</script>

<template>
  <div class="sn-demo">
    <div class="sn-demo__toolbar">
      <SnButton size="small" @click="scrollTo({ position: 'bottom' }); noteEvent('scrollTo bottom (event)')">
        Scroll to bottom
      </SnButton>
      <SnButton size="small" @click="scrollTo({ position: 'bottom', silent: true }); noteEvent('scrollTo bottom (silent)')">
        Scroll to bottom (silent)
      </SnButton>
      <SnButton size="small" @click="scrollTo({ position: 'top' }); noteEvent('scrollTo top (event)')">
        Scroll to top
      </SnButton>
      <SnButton size="small" @click="scrollTo({ position: 'top', silent: true }); noteEvent('scrollTo top (silent)')">
        Scroll to top (silent)
      </SnButton>
    </div>
    <p class="sn-demo__status">Last event: {{ lastEvent }}</p>
    <SnLog
      ref="logRef"
      :log="log"
      trim
      @require-more="noteEvent('require-more')"
      @reach-top="noteEvent('reach-top')"
      @reach-bottom="noteEvent('reach-bottom')"
    />
  </div>
</template>

<style scoped>
.sn-demo {
  display: flex;
  flex-direction: column;
  gap: 24px;
  color: var(--sn-web-color-text-primary);
}

.sn-demo__toolbar {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.sn-demo__status {
  margin: 0;
  color: var(--sn-web-color-text-secondary);
  font-size: 13px;
}
</style>
