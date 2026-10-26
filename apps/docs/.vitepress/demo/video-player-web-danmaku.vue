<script setup lang="ts">
/**
 * Demo: SnVideoPlayer — danmaku (bullet comments).
 *
 * Timeline danmus come from the `danmus` prop; the inline input sends
 * "self" danmus at the current time (highlighted, not replayed after a
 * seek back). The media is a public 10s sample clip (test-videos.co.uk).
 */
import { ref } from 'vue';
import { SnVideoPlayer } from '@snui/vue-web';
import type { SnVideoDanmu } from '@snui/vue-web';

const VIDEO =
  'https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/360/Big_Buck_Bunny_360_10s_1MB.mp4';

const danmus = ref<SnVideoDanmu[]>([
  { text: '前方高能预警！', time: 0.5 },
  { text: '哈哈哈哈哈哈', time: 1.5, color: '#69b1ff' },
  { text: '镜头给得太好了', time: 2.5 },
  { text: '这画质可以', time: 3.5, color: '#95de64' },
  { text: '顶部弹幕了解一下', time: 4, type: 'top', color: '#ffa940' },
  { text: '第一次来打卡', time: 5 },
  { text: '每日亿遍', time: 6.5, color: '#ff85c0' },
  { text: '底部居中弹幕', time: 7.5, type: 'bottom', color: '#b37feb' },
  { text: '完结撒花', time: 9 },
]);

const danmuVisible = ref(true);
const danmuSpeed = ref(1);
const danmuOpacity = ref(1);
const sentCount = ref(0);
const playerRef = ref<InstanceType<typeof SnVideoPlayer> | null>(null);

function quickSend(text: string): void {
  playerRef.value?.sendDanmu(text, { color: '#69b1ff' });
  sentCount.value++;
}
</script>

<template>
  <div class="demo-stack">
    <SnVideoPlayer
      ref="playerRef"
      :src="VIDEO"
      title="弹幕演示"
      :danmus="danmus"
      :danmu-visible="danmuVisible"
      :danmu-speed="danmuSpeed"
      :danmu-opacity="danmuOpacity"
      :danmu-font-size="16"
      :danmu-area="0.7"
      @danmu-send="sentCount++"
    />

    <div class="demo-controls">
      <button type="button" class="demo-chip" :class="{ 'demo-chip--on': danmuVisible }" @click="danmuVisible = !danmuVisible">
        {{ danmuVisible ? '弹幕开' : '弹幕关' }}
      </button>
      <button type="button" class="demo-chip" @click="danmuSpeed = danmuSpeed === 1 ? 1.6 : 1">
        速度 ×{{ danmuSpeed }}
      </button>
      <button type="button" class="demo-chip" @click="danmuOpacity = danmuOpacity === 1 ? 0.5 : 1">
        透明度 {{ danmuOpacity }}
      </button>
      <button type="button" class="demo-chip" @click="quickSend('我从中控台发的')">代发一条蓝色弹幕</button>
      <span class="demo-hint">已发送 {{ sentCount }} 条（含输入框）</span>
    </div>
  </div>
</template>

<style scoped>
.demo-stack {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.demo-controls {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
}

.demo-chip {
  padding: 3px 10px;
  border: 1px solid var(--sn-web-color-border-default, #d9d9d9);
  border-radius: var(--sn-web-radius-full, 999px);
  background: var(--sn-web-color-background-surface, #fff);
  color: var(--sn-web-color-text-primary, #333);
  font-size: 12px;
  cursor: pointer;
}

.demo-chip--on {
  border-color: var(--sn-web-color-action-primary, #1677ff);
  color: var(--sn-web-color-action-primary, #1677ff);
}

.demo-hint {
  color: var(--sn-web-color-text-tertiary, #999);
  font-size: 12px;
}
</style>
