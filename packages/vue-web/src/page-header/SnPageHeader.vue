<script setup lang="ts">
/**
 * SnPageHeader — web-end page header (AUI-WEB-DD-027).
 *
 * Reference library: naive-ui `n-page-header`
 *   (https://www.naiveui.com/zh-CN/light/components/page-header)
 * Per AGENTS.md §112, props + semantics mirror n-page-header 1:1:
 *   title / subtitle / extra + onBack. Slots: back / icon / title /
 *   subtitle / header / extra / footer / default.
 *
 * Documented divergences (not §112 violations):
 *   - The default back glyph is an inline chevron-left SVG (lucide path
 *     data); packages/vue-web does not ship an icon dependency, and the
 *     `icon` slot replaces it.
 *   - The back control is a real `<button aria-label="Back">` for
 *     keyboard + screen-reader access (the reference renders a plain
 *     clickable wrapper).
 *   - Theme colors are mapped to web tokens: title → text-primary,
 *     subtitle → text-tertiary, extra → text-secondary; title 16px /
 *     subtitle 12px.
 *   - No config-provider / RTL integration (web-end v3 has no provider
 *     yet).
 *
 * Per AUI-FOUND-003 + AUI-FOUND-004, this component is end: web and uses
 * `--sn-web-*` token aliases only (px units).
 *
 * Usage:
 *   <SnPageHeader title="返回" subtitle="详情页" extra="操作" @back="goBack">
 *     <template #footer>页脚内容</template>
 *   </SnPageHeader>
 */

defineOptions({ name: 'SnPageHeader' })

const props = withDefaults(
  defineProps<{
    /** Page title text; the `title` slot takes precedence. Mirrors n-page-header `title`. */
    title?: string | undefined
    /** Subtitle under the title; the `subtitle` slot takes precedence. Mirrors n-page-header `subtitle`. */
    subtitle?: string | undefined
    /** Right-side extra content; the `extra` slot takes precedence. Mirrors n-page-header `extra`. */
    extra?: string | undefined
  }>(),
  {
    title: undefined,
    subtitle: undefined,
    extra: undefined,
  },
)

const emit = defineEmits<{
  /** Fired when the back control is activated. Mirrors n-page-header `onBack`. */
  (e: 'back', event: MouseEvent): void
}>()

defineSlots<{
  /** Replaces the whole header row. Mirrors n-page-header `header`. */
  header?(): unknown
  /** Replaces the back control entirely. Mirrors n-page-header `back`. */
  back?(): unknown
  /** Replaces the back glyph inside the control. Mirrors n-page-header `icon`. */
  icon?(): unknown
  /** Title content — used only when `title` is not passed. Mirrors n-page-header `title`. */
  title?(): unknown
  /** Subtitle content — used only when `subtitle` is not passed. Mirrors n-page-header `subtitle`. */
  subtitle?(): unknown
  /** Extra content — used only when `extra` is not passed. Mirrors n-page-header `extra`. */
  extra?(): unknown
  /** Bottom area, separated by a top border. Mirrors n-page-header `footer`. */
  footer?(): unknown
  /** Content between the header and the footer. Mirrors n-page-header `default`. */
  default?(): unknown
}>()

function handleBack(event: MouseEvent): void {
  emit('back', event)
}
</script>

<template>
  <div data-snui-component="page-header" class="sn-page-header">
    <div v-if="$slots.header" class="sn-page-header__header">
      <slot name="header" />
    </div>
    <div v-else class="sn-page-header__header">
      <div class="sn-page-header__back">
        <slot name="back">
          <button
            type="button"
            class="sn-page-header__back-button"
            aria-label="Back"
            @click="handleBack"
          >
            <slot name="icon">
              <!--
                Default back glyph: chevron-left (inline SVG — the package
                itself carries no icon dependency).
              -->
              <svg
                class="sn-page-header__back-icon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                aria-hidden="true"
              >
                <path d="m15 18-6-6 6-6" />
              </svg>
            </slot>
          </button>
        </slot>
      </div>
      <div class="sn-page-header__content">
        <div v-if="$slots.title || title !== undefined" class="sn-page-header__title">
          <slot v-if="$slots.title" name="title" />
          <template v-else>{{ title }}</template>
        </div>
        <div v-if="$slots.subtitle || subtitle !== undefined" class="sn-page-header__subtitle">
          <slot v-if="$slots.subtitle" name="subtitle" />
          <template v-else>{{ subtitle }}</template>
        </div>
      <div v-if="$slots.extra || extra !== undefined" class="sn-page-header__extra">
        <slot v-if="$slots.extra" name="extra" />
        <template v-else>{{ extra }}</template>
      </div>
      </div>
    </div>

    <div v-if="$slots.default" class="sn-page-header__body">
      <slot />
    </div>

    <div v-if="$slots.footer" class="sn-page-header__footer">
      <slot name="footer" />
    </div>
  </div>
</template>

<style scoped>
/* Web side: --sn-web-* aliases only. Direct --aui-* / --sn-mp-* forbidden
 * (enforced by `pnpm snui token-check --dir packages/vue-web --end web`). */

.sn-page-header {
  box-sizing: border-box;
  color: var(--sn-web-color-text-primary);
}

.sn-page-header__header {
  display: flex;
  align-items: center;
  gap: 12px;
}

.sn-page-header__back {
  display: inline-flex;
  flex: 0 0 auto;
}

.sn-page-header__back-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  padding: 0;
  border: none;
  border-radius: 50%;
  background: transparent;
  color: var(--sn-web-color-text-secondary);
  cursor: pointer;
  transition: background 0.2s cubic-bezier(0.4, 0, 0.2, 1), color 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.sn-page-header__back-button:hover {
  background: var(--sn-web-color-background-subtle);
  color: var(--sn-web-color-text-primary);
}

.sn-page-header__back-button:focus-visible {
  outline: var(--sn-web-focus-ring, 2px solid var(--sn-web-color-action-primary));
  outline-offset: 2px;
}

.sn-page-header__back-icon {
  width: 18px;
  height: 18px;
}

.sn-page-header__content {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.sn-page-header__title {
  font-size: 16px;
  font-weight: 600;
  color: var(--sn-web-color-text-primary);
}

.sn-page-header__subtitle {
  font-size: 12px;
  color: var(--sn-web-color-text-tertiary);
}

.sn-page-header__extra {
  margin-left: auto;
  flex: 0 0 auto;
  font-size: 14px;
  color: var(--sn-web-color-text-secondary);
}

.sn-page-header__body {
  padding-top: 16px;
}

.sn-page-header__footer {
  margin-top: 16px;
  padding-top: 12px;
  border-top: 1px solid var(--sn-web-color-border-subtle);
  font-size: 14px;
  color: var(--sn-web-color-text-secondary);
}
</style>
