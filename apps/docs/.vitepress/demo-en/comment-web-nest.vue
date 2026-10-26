<script setup lang="ts">
/** Demo: SnComment — 嵌套评论：回复通过 default 插槽放进父评论内容区，缩进跟随父头像。 */
import { SnComment } from '@snui/vue-web'
</script>

<template>
  <div class="comment-nest-demo">
    <SnComment
      author="Socrates"
      avatar="https://picsum.photos/id/1011/64/64"
      datetime="1 hour ago"
      content="Comments can be nested; replies indent to the right of the parent avatar."
    >
      <template #actions>
        <span class="action">Reply</span>
      </template>
      <SnComment
        author="Plato"
        avatar="https://picsum.photos/id/64/64/64"
        datetime="40 minutes ago"
        content="Thanks for sharing — I was just about to ask how the indentation works."
      >
        <template #actions>
          <span class="action">Reply</span>
        </template>
      </SnComment>
      <SnComment
        author="Aristotle"
        avatar="https://picsum.photos/id/1074/64/64"
        datetime="20 minutes ago"
        content="Same question here — is the spacing between nesting levels the same as the top level too?"
      >
        <template #actions>
          <span class="action">Reply</span>
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
  background: color-mix(in srgb, var(--sn-web-color-text-primary) 2%, var(--sn-web-color-background-surface));
}
</style>
