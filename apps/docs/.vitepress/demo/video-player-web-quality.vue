<script setup lang="ts">
/**
 * Demo: SnVideoPlayer — progressive quality ladder.
 *
 * Three public renditions of the same 10s clip (test-videos.co.uk); the
 * settings menu switches sources and preserves the playback position.
 */
import { ref } from 'vue';
import { SnVideoPlayer } from '@snui/vue-web';
import type { SnVideoQuality } from '@snui/vue-web';

const ladder: SnVideoQuality[] = [
  {
    label: '1080P',
    value: '1080p',
    src: 'https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/1080/Big_Buck_Bunny_1080_10s_1MB.mp4',
  },
  {
    label: '720P',
    value: '720p',
    src: 'https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/720/Big_Buck_Bunny_720_10s_1MB.mp4',
  },
  {
    label: '360P',
    value: '360p',
    src: 'https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/360/Big_Buck_Bunny_360_10s_1MB.mp4',
  },
];

const current = ref<string | null>(null);
</script>

<template>
  <div class="demo-stack">
    <SnVideoPlayer
      :qualities="ladder"
      default-quality="1080p"
      title="清晰度切换演示"
      @quality-change="(d: { id: string | number; label?: string }) => (current = String(d.label))"
    />
    <p class="demo-hint">
      打开控制条右侧「设置」→ 清晰度：切换时播放进度自动保留。
      <template v-if="current"
        >当前档位：<code>{{ current }}</code></template
      >
    </p>
  </div>
</template>

<style scoped>
.demo-stack {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.demo-hint {
  margin: 0;
  color: var(--sn-web-color-text-secondary, #666);
  font-size: 12px;
}
</style>
