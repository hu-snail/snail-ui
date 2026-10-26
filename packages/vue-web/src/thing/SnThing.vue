<script setup lang="ts">
/**
 * SnThing — structured "thing" display block: avatar / header / extra /
 * description / content / footer / action (AUI-WEB-DD-018).
 *
 * Reference library: naive-ui `n-thing`
 *   (https://www.naiveui.com/zh-CN/light/components/thing)
 * Per AGENTS.md §112, props + slots mirror n-thing 1:1:
 *   title / title-extra / description / content / content-indented /
 *   description-class / description-style / content-class /
 *   content-style; slots: avatar / header / header-extra / description /
 *   default / footer / action.
 *
 * Structure parity: without `content-indented` the avatar sits in an
 * avatar-header-wrapper next to the header column (description included);
 * with `content-indented` the avatar moves out to the left of the whole
 * main column and the header/description stack returns to the main flow.
 *
 * Per AUI-FOUND-003 + AUI-FOUND-004, this component is end: web and uses
 * `--sn-web-*` token aliases only (px units).
 *
 * Usage:
 *   <SnThing title="标题" description="描述">
 *     正文内容
 *     <template #action><SnButton size="small">操作</SnButton></template>
 *   </SnThing>
 */

import type { CSSProperties } from 'vue';
import { useSlots } from 'vue';

defineOptions({ name: 'SnThing' });

const slots = useSlots();

const props = withDefaults(
  defineProps<{
    /** Title text; the `header` slot overrides it. */
    title?: string;
    /** Extra content at the far end of the header row. */
    titleExtra?: string;
    /** Description text; the `description` slot overrides it. */
    description?: string;
    /** Content text; the `default` slot overrides it. */
    content?: string;
    /** Indent the whole content column under the header instead of the
     * avatar (requires the `avatar` slot to matter). */
    contentIndented?: boolean;
    /** Class applied to the description block. */
    descriptionClass?: string;
    /** Style applied to the description block. */
    descriptionStyle?: string | CSSProperties;
    /** Class applied to the content block. */
    contentClass?: string;
    /** Style applied to the content block. */
    contentStyle?: string | CSSProperties;
  }>(),
  {
    contentIndented: false,
  },
);

defineSlots<{
  /** Content body. */
  default?(): unknown;
  /** Avatar (rendered beside the header, or leading when indented). */
  avatar?(): unknown;
  /** Header content — overrides the `title` prop. */
  header?(): unknown;
  /** Header trailing content — overrides `title-extra`. */
  'header-extra'?(): unknown;
  /** Description — overrides the `description` prop. */
  description?(): unknown;
  /** Footer area. */
  footer?(): unknown;
  /** Action area (buttons row). */
  action?(): unknown;
}>();

const hasHeaderArea = (): boolean =>
  Boolean(slots.header || props.title || slots['header-extra'] || props.titleExtra);

const hasDescriptionArea = (): boolean => Boolean(slots.description || props.description);
</script>

<template>
  <div data-snui-component="thing" class="sn-thing">
    <div v-if="$slots.avatar && contentIndented" class="sn-thing__avatar">
      <slot name="avatar" />
    </div>
    <div class="sn-thing__main">
      <template v-if="!contentIndented && (hasHeaderArea() || $slots.avatar)">
        <div class="sn-thing__avatar-header-wrapper">
          <div v-if="$slots.avatar" class="sn-thing__avatar">
            <slot name="avatar" />
          </div>
          <div v-if="hasHeaderArea() || hasDescriptionArea()" class="sn-thing__header-wrapper">
            <div v-if="hasHeaderArea()" class="sn-thing__header">
              <div v-if="slots.header || title" class="sn-thing__title">
                <slot v-if="slots.header" name="header" />
                <template v-else>{{ title }}</template>
              </div>
              <div v-if="slots['header-extra'] || titleExtra" class="sn-thing__extra">
                <slot v-if="slots['header-extra']" name="header-extra" />
                <template v-else>{{ titleExtra }}</template>
              </div>
            </div>
            <div
              v-if="hasDescriptionArea()"
              class="sn-thing__description"
              :class="descriptionClass"
              :style="descriptionStyle"
            >
              <slot v-if="slots.description" name="description" />
              <template v-else>{{ description }}</template>
            </div>
          </div>
        </div>
      </template>
      <template v-else>
        <div v-if="hasHeaderArea()" class="sn-thing__header">
          <div v-if="slots.header || title" class="sn-thing__title">
            <slot v-if="slots.header" name="header" />
            <template v-else>{{ title }}</template>
          </div>
          <div v-if="slots['header-extra'] || titleExtra" class="sn-thing__extra">
            <slot v-if="slots['header-extra']" name="header-extra" />
            <template v-else>{{ titleExtra }}</template>
          </div>
        </div>
        <div
          v-if="hasDescriptionArea()"
          class="sn-thing__description"
          :class="descriptionClass"
          :style="descriptionStyle"
        >
          <slot v-if="slots.description" name="description" />
          <template v-else>{{ description }}</template>
        </div>
      </template>
      <div
        v-if="$slots.default || content"
        class="sn-thing__content"
        :class="contentClass"
        :style="contentStyle"
      >
        <slot v-if="$slots.default" />
        <template v-else>{{ content }}</template>
      </div>
      <div v-if="$slots.footer" class="sn-thing__footer">
        <slot name="footer" />
      </div>
      <div v-if="$slots.action" class="sn-thing__action">
        <slot name="action" />
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Web side: --sn-web-* aliases only. Direct --aui-* / --sn-mp-* forbidden
 * (enforced by `pnpm snui token-check --dir packages/vue-web --end web`). */

.sn-thing {
  display: flex;
  transition: color 0.3s ease;
  font-size: 14px;
  color: var(--sn-web-color-text-secondary);
}

.sn-thing__avatar {
  margin-right: 12px;
  margin-top: 2px;
}

.sn-thing__avatar-header-wrapper {
  display: flex;
  flex-wrap: nowrap;
}

.sn-thing__header-wrapper {
  flex: 1;
}

.sn-thing__main {
  flex-grow: 1;
}

.sn-thing__header {
  display: flex;
  margin-bottom: 4px;
  justify-content: space-between;
  align-items: center;
}

.sn-thing__title {
  font-size: 16px;
  font-weight: 500;
  transition: color 0.3s ease;
  color: var(--sn-web-color-text-primary);
}

.sn-thing__description:not(:last-child) {
  margin-bottom: 4px;
}

.sn-thing__content:not(:first-child) {
  margin-top: 12px;
}

.sn-thing__footer:not(:first-child) {
  margin-top: 12px;
}

.sn-thing__action:not(:first-child) {
  margin-top: 12px;
}
</style>
