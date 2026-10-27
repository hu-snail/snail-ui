<script setup lang="ts">
/** Demo: sn-rich-text (uni-end) — 音视频与媒体控制方法。 */
import { ref } from 'vue';
import SnRichText from '@snui/uni-src/components/sn-rich-text/sn-rich-text.vue';
import type { RichTextInstance } from '@snui/uni-src/components/sn-rich-text/sn-rich-text-types';

const media = `
  <h3>视频片段</h3>
  <video id="trip" src="https://qiniu-web-assets.dcloud.net.cn/unidoc/zh/2minute-demo.mp4" poster="https://picsum.photos/id/1016/640/360"></video>
  <h3>音频片段</h3>
  <audio id="music" title="阅读时光" src="https://qiniu-web-assets.dcloud.net.cn/unidoc/zh/ForElise.mp3"></audio>
  <p>通过组件方法播放 / 暂停 / 跳转，<code>true</code> 表示指令已下发。</p>
`;

const richText = ref<RichTextInstance>();
const progress = ref('');

function play(): void {
  richText.value?.playMedia('trip');
}

function pause(): void {
  richText.value?.pauseMedia();
}

function seek(): void {
  richText.value?.seekMedia('trip', 5);
}

function onTimeUpdate(payload: { currentTime: number; duration: number }): void {
  progress.value = `${payload.currentTime.toFixed(1)}s / ${payload.duration.toFixed(1)}s`;
}
</script>

<template>
  <view class="sn-demo">
    <view class="sn-demo__actions">
      <view class="sn-demo__button" @click="play"
        ><text class="sn-demo__button-text">播放视频</text></view
      >
      <view class="sn-demo__button" @click="pause"
        ><text class="sn-demo__button-text">全部暂停</text></view
      >
      <view class="sn-demo__button" @click="seek"
        ><text class="sn-demo__button-text">跳到 5 秒</text></view
      >
    </view>
    <text v-if="progress !== ''" class="sn-demo__progress">进度：{{ progress }}</text>
    <SnRichText ref="richText" :content="media" enable-anchor @media-timeupdate="onTimeUpdate" />
  </view>
</template>

<style scoped>
.sn-demo {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.sn-demo__actions {
  display: flex;
  flex-direction: row;
  gap: 8px;
}

.sn-demo__button {
  padding: 8px 12px;
  border-radius: 6px;
  background-color: var(--sn-mp-color-action-primary);
}

.sn-demo__button-text {
  color: var(--sn-mp-color-text-on-primary);
  font-size: 12px;
}

.sn-demo__progress {
  color: var(--sn-mp-color-text-secondary);
  font-size: 12px;
}
</style>
