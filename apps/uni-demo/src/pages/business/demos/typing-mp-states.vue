<script setup lang="ts">
/**
 * Demo: sn-typing (uni-end) — 状态与事件：会话模拟 —— 发送后 peer 进入
 * typing 态，回复到达卸载 typing 气泡换上真实消息。
 */
import { onBeforeUnmount, ref } from 'vue';
import SnTyping from '@snui/uni-src/components/sn-typing/sn-typing.vue';

interface ChatMessage {
  id: number;
  from: 'me' | 'peer';
  text: string;
}

const replies = ['收到，马上处理。', '这个方案可行，继续。', '好的，稍后同步你。'];
let replyIndex = 0;
let nextId = 1;

const messages = ref<ChatMessage[]>([{ id: nextId++, from: 'peer', text: '你好，看看新方案？' }]);
const peerTyping = ref(false);
const replyTimer: ReturnType<typeof setTimeout>[] = [];

function send(): void {
  if (peerTyping.value) return;
  messages.value.push({ id: nextId++, from: 'me', text: '方案发你了，帮我看下第 2 页' });
  peerTyping.value = true;
  replyTimer.push(
    setTimeout(() => {
      messages.value.push({
        id: nextId++,
        from: 'peer',
        text: replies[replyIndex % replies.length] ?? '',
      });
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
        <SnTyping text="对方正在输入…" :speed="280" />
      </view>
    </view>

    <view class="chat-actions">
      <view class="chat-actions__btn" hover-class="chat-actions__btn--down" @tap="send">
        <text class="chat-actions__btn-text">发送消息</text>
      </view>
    </view>
    <text class="sn-demo__meta">发送后 1.8s 出现回复；期间 typing 气泡占位，回复到达即卸载</text>
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
