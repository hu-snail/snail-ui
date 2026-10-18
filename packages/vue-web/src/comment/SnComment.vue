<script lang="ts">
/** Comment alignment: the string form applies to both rows; the object form overrides rows separately. */
export interface SnCommentAlignParts {
  datetime?: 'left' | 'right'
  actions?: 'left' | 'right'
}

export type SnCommentAlign = 'left' | 'right' | SnCommentAlignParts
</script>

<script setup lang="ts">
/**
 * SnComment — comment block: avatar / author / datetime / content / actions
 * with nested replies.
 *
 * Reference library: Arco Design Vue `a-comment`
 *   (https://arco.design/vue/component/comment — source
 *    arco-design-vue packages/web-vue/components/comment/comment.vue +
 *    style/index.less).
 * Divergence registration: naive-ui has NO Comment component (verified
 * against naive-ui src/components.ts), so per the data-display batch plan
 * this is an explicit divergence from the "mirror naive-ui 1:1" rule —
 * props + slots mirror Arco instead:
 *   author / avatar / content / datetime / align
 *   ('left' | 'right' | { datetime?: 'left' | 'right'; actions?:
 *   'left' | 'right' });
 *   slots: avatar / author / datetime / content / actions + default
 *   (nested SnComment). The `editor` demo of the reference needs Input /
 *   Button and is registered as future work.
 *
 * Intentional divergence from the Arco source: slots override same-name
 * props (Arco renders the prop text when both are given). The repo
 * convention (SnThing and friends) is slot-wins, and the batch brief
 * mandates it.
 *
 * Per AUI-FOUND-003 + AUI-FOUND-004, this component is end: web and uses
 * `--sn-web-*` token aliases only (px units).
 *
 * Usage:
 *   <SnComment author="苏格拉底" avatar="/a.png" datetime="1 小时前"
 *              content="评论正文">
 *     <template #actions><span>回复</span></template>
 *     <SnComment ... />
 *   </SnComment>
 */

import { computed, useSlots } from 'vue'

defineOptions({ name: 'SnComment' })

const props = withDefaults(
  defineProps<{
    /** Author name; the `author` slot overrides it. */
    author?: string
    /** Avatar image URL; the `avatar` slot overrides it. */
    avatar?: string
    /** Comment body; the `content` slot overrides it. */
    content?: string
    /** Datetime text; the `datetime` slot overrides it. */
    datetime?: string
    /** Alignment of the datetime row and the actions row. A string applies
     * to both rows; an object overrides them separately. */
    align?: SnCommentAlign
  }>(),
  {
    align: 'left',
  },
)

defineSlots<{
  /** Avatar column content (overrides `avatar`). */
  avatar?(): unknown
  /** Author name (overrides `author`). */
  author?(): unknown
  /** Datetime text (overrides `datetime`). */
  datetime?(): unknown
  /** Comment body (overrides `content`). */
  content?(): unknown
  /** Actions row (usually plain spans). */
  actions?(): unknown
  /** Nested `<SnComment>` replies. */
  default?(): unknown
}>()

const slots = useSlots()

/** Reference truthiness: an empty-string prop counts as absent, a slot
 * always provides the area (arco `hasPropOrSlot`), with slot-wins order. */
const hasAuthor = (): boolean => Boolean(props.author || slots.author)
const hasAvatar = (): boolean => Boolean(props.avatar || slots.avatar)
const hasContent = (): boolean => Boolean(props.content || slots.content)
const hasDatetime = (): boolean => Boolean(props.datetime || slots.datetime)

/** Resolved row alignment; string form fans out to both rows, object form
 * falls back to `left` per missing key (arco computedAlign behavior). */
const alignParts = computed<{ datetime: 'left' | 'right'; actions: 'left' | 'right' }>(() => {
  const value = props.align
  if (typeof value === 'string') {
    return { datetime: value, actions: value }
  }
  return {
    datetime: value.datetime ?? 'left',
    actions: value.actions ?? 'left',
  }
})
</script>

<template>
  <div data-snui-component="comment" class="sn-comment">
    <div v-if="hasAvatar()" class="sn-comment__avatar">
      <slot v-if="slots.avatar" name="avatar" />
      <img v-else-if="avatar" :src="avatar" alt="comment avatar" />
    </div>
    <div class="sn-comment__main">
      <div class="sn-comment__body">
        <div
          v-if="hasAuthor() || hasDatetime()"
          class="sn-comment__title"
          :class="{ 'sn-comment__title--right': alignParts.datetime === 'right' }"
        >
          <span v-if="hasAuthor()" class="sn-comment__author">
            <slot v-if="slots.author" name="author" />
            <template v-else>{{ author }}</template>
          </span>
          <span v-if="hasDatetime()" class="sn-comment__datetime">
            <slot v-if="slots.datetime" name="datetime" />
            <template v-else>{{ datetime }}</template>
          </span>
        </div>
        <div v-if="hasContent()" class="sn-comment__content">
          <slot v-if="slots.content" name="content" />
          <template v-else>{{ content }}</template>
        </div>
        <div
          v-if="slots.actions"
          class="sn-comment__actions"
          :class="{ 'sn-comment__actions--right': alignParts.actions === 'right' }"
        >
          <slot name="actions" />
        </div>
      </div>
      <div v-if="slots.default" class="sn-comment__nested">
        <slot />
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Web side: --sn-web-* aliases only. Direct --aui-* / --sn-mp-* forbidden
 * (enforced by `pnpm snui token-check --dir packages/vue-web --end web`).
 * Metrics mirror arco-design-vue comment/style: avatar 32px circle,
 * spacing-6/4 gaps, margin-bottom spacing-8, body-3 14px base font,
 * body-1 12px datetime. */

.sn-comment {
  display: flex;
  flex-wrap: nowrap;
  font-size: 14px;
  line-height: 1.5715;
}

/* Sibling comments and the nested-comment container get the reference
 * vertical rhythm (arco @comment-margin-bottom = @spacing-8 = 20px). */
.sn-comment:not(:first-of-type),
.sn-comment__nested {
  margin-top: 20px;
}

.sn-comment__main {
  flex: 1;
}

.sn-comment__avatar {
  flex-shrink: 0;
  margin-right: 12px;
  cursor: pointer;
}

.sn-comment__avatar > img {
  width: 32px;
  height: 32px;
  border-radius: 50%;
}

.sn-comment__author {
  margin-right: 8px;
  color: var(--sn-web-color-text-secondary);
  font-size: 14px;
}

.sn-comment__datetime {
  color: var(--sn-web-color-text-tertiary);
  font-size: 12px;
}

.sn-comment__content {
  color: var(--sn-web-color-text-primary);
}

.sn-comment__title--right {
  display: flex;
  justify-content: space-between;
}

.sn-comment__actions {
  margin-top: 8px;
  color: var(--sn-web-color-text-secondary);
  font-size: 14px;
}

/* Action items come from the parent scope, hence :deep. */
.sn-comment__actions > :deep(*:not(:last-child)) {
  margin-right: 8px;
}

.sn-comment__actions--right {
  display: flex;
  justify-content: flex-end;
}
</style>
