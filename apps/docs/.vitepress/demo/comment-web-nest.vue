<script setup lang="ts">
/** Demo: SnComment — 嵌套评论：回复通过 default 插槽放进父评论内容区，缩进跟随父头像。 */
import { SnComment } from '@snui/vue-web';
</script>

<template>
  <div class="comment-nest-demo">
    <SnComment
      author="苏格拉底"
      avatar="https://picsum.photos/id/1011/64/64"
      datetime="1 小时前"
      content="评论可以嵌套使用，回复会缩进到父评论头像右侧。"
    >
      <template #actions>
        <span class="action">回复</span>
      </template>
      <SnComment
        author="柏拉图"
        avatar="https://picsum.photos/id/64/64/64"
        datetime="40 分钟前"
        content="感谢分享，正想确认缩进的实现方式。"
      >
        <template #actions>
          <span class="action">回复</span>
        </template>
      </SnComment>
      <SnComment
        author="亚里士多德"
        avatar="https://picsum.photos/id/1074/64/64"
        datetime="20 分钟前"
        content="同问，嵌套层级之间的间距也和顶层一致。"
      >
        <template #actions>
          <span class="action">回复</span>
        </template>
      </SnComment>
    </SnComment>
  </div>
</template>

<style scoped>
.comment-nest-demo {
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
  background: color-mix(
    in srgb,
    var(--sn-web-color-text-primary) 2%,
    var(--sn-web-color-background-surface)
  );
}
</style>
