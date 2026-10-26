<script setup lang="ts">
/**
 * Demo: SnVideoPlayer — mini floating window.
 *
 * `mini-on-scroll-out` docks the player into a draggable bottom-right
 * window while it is playing and scrolled out of view; scrolling back
 * restores it. The toolbar button / `v-model:mini` control it manually.
 */
import { ref } from 'vue';
import { SnVideoPlayer } from '@snui/vue-web';

const VIDEO =
  'https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/360/Big_Buck_Bunny_360_10s_1MB.mp4';

const mini = ref<boolean | undefined>(undefined);
</script>

<template>
  <div class="demo-wrap">
    <p class="demo-hint">
      ↓ 播放下方视频后向下滚动：播放器离开视口时自动缩为右下角小窗（可拖拽、可关闭），滚回来自动还原。也可以用控制条的小窗按钮手动切换（当前：<code>{{ mini === undefined ? '非受控' : mini ? '小窗' : '正常' }}</code>）。
    </p>

    <div class="demo-spacer">
      <p>滚动占位内容 1 —— 继续往下滚</p>
      <p>滚动占位内容 2</p>
      <p>滚动占位内容 3 —— 播放器应该在刚才已停靠为小窗</p>
      <p>滚回上方即可还原</p>
    </div>

    <SnVideoPlayer
      v-model:mini="mini"
      :src="VIDEO"
      title="小窗播放演示"
      mini-on-scroll-out
      :mini-width="300"
    />
  </div>
</template>

<style scoped>
.demo-wrap {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.demo-hint {
  margin: 0;
  color: var(--sn-web-color-text-secondary, #666);
  font-size: 12px;
}

.demo-spacer {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  height: 320px;
  border: 1px dashed var(--sn-web-color-border-default, #d9d9d9);
  border-radius: var(--sn-web-radius-md, 6px);
  color: var(--sn-web-color-text-tertiary, #999);
  font-size: 12px;
  text-align: center;
}

.demo-spacer p {
  margin: 8px 0;
}
</style>
