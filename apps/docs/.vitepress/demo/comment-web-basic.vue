<script setup lang="ts">
/** Demo: SnComment — avatar / author / datetime / content / actions 完整评论场景。 */
import { SnComment } from '@snui/vue-web'
</script>

<template>
  <div class="comment-demo">
    <SnComment
      author="苏格拉底"
      avatar="https://picsum.photos/id/1005/64/64"
      datetime="1 小时前"
      content="未经审视的人生不值得过。设计亦然：每一个界面决策都应该能回答「为什么这样」。"
    >
      <template #actions>
        <span class="action">赞同 83</span>
        <span class="action">回复</span>
      </template>
    </SnComment>
    <SnComment
      author="巴尔扎克"
      datetime="30 分钟前"
      content="好设计是尽可能少的设计。"
    >
      <template #actions>
        <span class="action">赞同 21</span>
        <span class="action">回复</span>
      </template>
    </SnComment>
  </div>
</template>

<style scoped>
.comment-demo {
  width: 100%;
  max-width: 640px;
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
  background: color-mix(in srgb, var(--sn-web-color-text-primary) 2%, var(--sn-web-color-background-surface));
}
</style>
