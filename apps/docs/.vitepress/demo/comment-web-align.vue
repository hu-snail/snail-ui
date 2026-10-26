<script setup lang="ts">
/** Demo: SnComment — align 属性控制 datetime / actions 行的对齐（左 / 右 / 对象形态）。 */
import { SnComment } from '@snui/vue-web';
</script>

<template>
  <div class="comment-align-demo">
    <p class="comment-align-demo__label">默认（datetime 与 actions 靠左）</p>
    <SnComment
      author="巴尔扎克"
      avatar="https://picsum.photos/id/1025/64/64"
      datetime="1 小时前"
      content="设计是一种计划，把对象或系统按规格构造出来。"
    >
      <template #actions>
        <span class="action">赞同 3</span>
        <span class="action">回复</span>
      </template>
    </SnComment>

    <p class="comment-align-demo__label">align=&quot;right&quot;（两行都靠右）</p>
    <SnComment
      author="巴尔扎克"
      avatar="https://picsum.photos/id/1025/64/64"
      datetime="1 小时前"
      content='align="right" 时作者留在左边，datetime 与 actions 一起靠到右缘。'
      align="right"
    >
      <template #actions>
        <span class="action">赞同 3</span>
        <span class="action">回复</span>
      </template>
    </SnComment>

    <p class="comment-align-demo__label">
      :align=&quot;{ actions: 'right' }&quot;（仅 actions 靠右）
    </p>
    <SnComment
      author="巴尔扎克"
      avatar="https://picsum.photos/id/1025/64/64"
      datetime="1 小时前"
      content="对象形态可以单独控制：datetime 保持跟随作者，actions 靠右。"
      :align="{ actions: 'right' }"
    >
      <template #actions>
        <span class="action">赞同 3</span>
        <span class="action">回复</span>
      </template>
    </SnComment>
  </div>
</template>

<style scoped>
.comment-align-demo {
  width: 100%;
  max-width: 640px;
}

.comment-align-demo__label {
  margin: 16px 0 12px;
  font-size: 12px;
  color: var(--sn-web-color-text-secondary);
}

.comment-align-demo__label:first-child {
  margin-top: 0;
}

.action {
  display: inline-block;
  padding: 0 4px;
  line-height: 24px;
  border-radius: 2px;
  color: var(--sn-web-color-text-primary);
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.action:hover {
  background: color-mix(
    in srgb,
    var(--sn-web-color-text-primary) 2%,
    var(--sn-web-color-background-surface)
  );
}
</style>
