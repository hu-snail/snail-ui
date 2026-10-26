<script setup lang="ts">
/** Demo: SnComment — avatar / author / datetime / content / actions 完整评论场景。 */
import { SnComment } from '@snui/vue-web';
</script>

<template>
  <div class="comment-demo">
    <SnComment
      author="Socrates"
      avatar="https://picsum.photos/id/1005/64/64"
      datetime="1 hour ago"
      content="The unexamined life is not worth living. Design is no different: every UI decision should be able to answer 'why this way'."
    >
      <template #actions>
        <span class="action">83 upvotes</span>
        <span class="action">Reply</span>
      </template>
    </SnComment>
    <SnComment
      author="Balzac"
      datetime="30 minutes ago"
      content="Good design is as little design as possible."
    >
      <template #actions>
        <span class="action">21 upvotes</span>
        <span class="action">Reply</span>
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
  background: color-mix(
    in srgb,
    var(--sn-web-color-text-primary) 2%,
    var(--sn-web-color-background-surface)
  );
}
</style>
