<script setup lang="ts">
/** Demo: SnComment — align 属性控制 datetime / actions 行的对齐（左 / 右 / 对象形态）。 */
import { SnComment } from '@snui/vue-web'
</script>

<template>
  <div class="comment-align-demo">
    <p class="comment-align-demo__label">Default (datetime and actions aligned left)</p>
    <SnComment
      author="Balzac"
      avatar="https://picsum.photos/id/1025/64/64"
      datetime="1 hour ago"
      content="Design is a plan that constructs an object or a system to specification."
    >
      <template #actions>
        <span class="action">3 upvotes</span>
        <span class="action">Reply</span>
      </template>
    </SnComment>

    <p class="comment-align-demo__label">align=&quot;right&quot; (both rows right-aligned)</p>
    <SnComment
      author="Balzac"
      avatar="https://picsum.photos/id/1025/64/64"
      datetime="1 hour ago"
      content="With align=&quot;right&quot;, the author stays on the left while datetime and actions move to the right edge."
      align="right"
    >
      <template #actions>
        <span class="action">3 upvotes</span>
        <span class="action">Reply</span>
      </template>
    </SnComment>

    <p class="comment-align-demo__label">:align=&quot;{ actions: 'right' }&quot; (actions row only)</p>
    <SnComment
      author="Balzac"
      avatar="https://picsum.photos/id/1025/64/64"
      datetime="1 hour ago"
      content="The object form controls each part independently: datetime keeps following the author, actions align right."
      :align="{ actions: 'right' }"
    >
      <template #actions>
        <span class="action">3 upvotes</span>
        <span class="action">Reply</span>
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
  background: color-mix(in srgb, var(--sn-web-color-text-primary) 2%, var(--sn-web-color-background-surface));
}
</style>
