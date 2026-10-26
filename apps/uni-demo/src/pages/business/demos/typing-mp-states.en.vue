<script setup lang="ts">
/**
 * Demo: sn-typing (uni-end) — States and events: a conversation simulation —
 * after sending, the peer enters the typing state, and the typing bubble is
 * swapped for the real message when the reply arrives.
 */
import { onBeforeUnmount, ref } from 'vue';
import SnTyping from '@snui/uni-src/components/sn-typing/sn-typing.vue';

interface ChatMessage {
  id: number;
  from: 'me' | 'peer';
  text: string;
}

const replies = ['Got it, on it now.', 'That plan works, go ahead.', 'Sure, will sync with you later.'];
let replyIndex = 0;
let nextId = 1;

const messages = ref<ChatMessage[]>([{ id: nextId++, from: 'peer', text: 'Hi, take a look at the new plan?' }]);
const peerTyping = ref(false);
const replyTimer: ReturnType<typeof setTimeout>[] = [];

function send(): void {
  if (peerTyping.value) return;
  messages.value.push({ id: nextId++, from: 'me', text: 'Plan sent — please check page 2' });
  peerTyping.value = true;
  replyTimer.push(
    setTimeout(() => {
      messages.value.push({ id: nextId++, from: 'peer', text: replies[replyIndex % replies.length] ?? '' });
      replyIndex += 1;
      peerTyping.value = false;
    }, 1800),
  );
}

onBeforeUnmount(() => {
  for (const timer of replyTimer) clearTimeout(timer);
});
</script>

<template>
  <view class="sn-demo sn-demo--column">
    <view class="chat">
      <view
        v-for="message in messages"
        :key="message.id"
        class="chat__bubble"
        :class="message.from === 'me' ? 'chat__bubble--me' : 'chat__bubble--peer'"
      >
        <text class="chat__text" :class="{ 'chat__text--me': message.from === 'me' }">
          {{ message.text }}
        </text>
      </view>
      <view v-if="peerTyping" class="chat__bubble chat__bubble--peer">
        <SnTyping text="The other side is typing…" :speed="280" />
      </view>
    </view>

    <view class="chat-actions">
      <view class="chat-actions__btn" hover-class="chat-actions__btn--down" @tap="send">
        <text class="chat-actions__btn-text">Send message</text>
      </view>
    </view>
    <text class="sn-demo__meta">Reply arrives after 1.8s; the typing bubble holds the slot until then</text>
  </view>
</template>

<style scoped>
.chat {
  display: flex;
  flex-direction: column;
  gap: var(--sn-mp-spacing-2);
}

.chat__bubble {
  max-width: 80%;
  padding: var(--sn-mp-spacing-2) var(--sn-mp-spacing-3);
  border-radius: 20rpx;
}

.chat__bubble--peer {
  align-self: flex-start;
  border-radius: 20rpx 20rpx 20rpx 4rpx;
  background-color: var(--sn-mp-color-background-subtle);
}

.chat__bubble--me {
  align-self: flex-end;
  border-radius: 20rpx 20rpx 4rpx 20rpx;
  background-color: var(--sn-mp-color-action-primary);
}

.chat__text {
  color: var(--sn-mp-color-text-primary);
  font-size: var(--sn-mp-font-size-sm);
}

.chat__text--me {
  color: var(--sn-mp-color-text-on-primary);
}

.chat-actions {
  display: flex;
  flex-direction: row;
  justify-content: center;
}

.chat-actions__btn {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding: 14rpx 48rpx;
  border-radius: 32rpx;
  background-color: var(--sn-mp-color-action-primary);
}

.chat-actions__btn--down {
  opacity: 0.85;
}

.chat-actions__btn-text {
  color: var(--sn-mp-color-text-on-primary);
  font-size: var(--sn-mp-font-size-sm);
}

.sn-demo__meta {
  font-size: var(--sn-mp-font-size-sm);
  color: var(--sn-mp-color-text-tertiary);
}
</style>
