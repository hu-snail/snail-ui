<script setup lang="ts">
/** Demo: SnInfiniteScroll — chat message stream with pending spinner. */
import { ref } from 'vue'
import { SnInfiniteScroll } from '@snui/vue-web'

interface ChatMessage {
  id: number
  from: 'me' | 'peer'
  text: string
}

const weekdays = ['星期一', '星期二', '星期三', '星期四', '星期五']

let nextId = 10
const messages = ref<ChatMessage[]>(
  Array.from({ length: 10 }, (_, i) => ({
    id: i,
    from: i % 3 === 0 ? 'me' : 'peer',
    text: `${weekdays[i % weekdays.length]} 的会议纪要 #${i + 1}`,
  })),
)

const noMore = ref(false)

async function handleLoad(): Promise<void> {
  await new Promise(resolve => setTimeout(resolve, 800))
  if (messages.value.length >= 16) {
    noMore.value = true
    return
  }
  const batch: ChatMessage[] = []
  for (let i = 0; i < 2; i += 1) {
    batch.push({
      id: nextId,
      from: nextId % 3 === 0 ? 'me' : 'peer',
      text: `${weekdays[nextId % weekdays.length]} 的会议纪要 #${nextId + 1}`,
    })
    nextId += 1
  }
  messages.value.push(...batch)
}
</script>

<template>
  <div class="sn-demo">
    <SnInfiniteScroll
      style="height: 260px"
      :distance="10"
      :load="noMore ? undefined : handleLoad"
    >
      <div
        v-for="message in messages"
        :key="message.id"
        class="sn-demo__message"
        :class="{ 'sn-demo__message--me': message.from === 'me' }"
      >
        {{ message.text }}
      </div>
      <p v-if="noMore" class="sn-demo__notice">没有更多消息了</p>
    </SnInfiniteScroll>
  </div>
</template>

<style scoped>
.sn-demo { max-width: 320px; }
.sn-demo__message {
  margin-bottom: 10px;
  padding: 8px 10px;
  border-radius: 6px;
  background: var(--sn-web-color-background-subtle);
  font-size: 13px;
}
.sn-demo__message--me {
  margin-left: auto;
  width: fit-content;
  background: color-mix(in srgb, var(--sn-web-color-action-primary) 12%, transparent);
}
.sn-demo__notice {
  margin: 4px 0 0;
  text-align: center;
  font-size: 12px;
  color: var(--sn-web-color-text-tertiary);
}
</style>
