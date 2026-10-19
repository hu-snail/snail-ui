<script setup lang="ts">
/**
 * SnLink — web-end link (AUI-WEB-DD-028).
 *
 * Reference library: naive-ui `n-a`
 *   (https://www.naiveui.com/zh-CN/light/components/a)
 * Per AGENTS.md §112, props + semantics mirror n-a 1:1:
 *   href / target / rel / type ('default' | 'primary' | 'info' |
 *   'success' | 'warning' | 'error') / disabled / underline / tag.
 *   Event: click (suppressed while disabled). Slots: default / icon.
 *
 * Documented divergences (not §112 violations):
 *   - The reference exposes `size`; not implemented here (font size is
 *     inherited from the surrounding text).
 *   - Type colors map to web tokens: primary → action-primary, info /
 *     success / warning → feedback-*, error → feedback-danger, default →
 *     text-primary. Hover darkening uses the two `-hover` tokens where
 *     they exist (primary, error) and an opacity step otherwise.
 *   - `underline: false` (default) underlines on hover only;
 *     `underline: true` underlines permanently. Disabled links never
 *     underline and get `aria-disabled="true"`.
 *   - No config-provider / RTL integration (web-end v3 has no provider
 *     yet).
 *
 * Per AUI-FOUND-003 + AUI-FOUND-004, this component is end: web and uses
 * `--sn-web-*` token aliases only (px units).
 *
 * Usage:
 *   <SnLink href="https://example.com">默认链接</SnLink>
 *   <SnLink type="primary" underline href="/docs">文档</SnLink>
 *   <SnLink tag="span" @click="open">伪链接</SnLink>
 */

import { computed } from 'vue'

defineOptions({ name: 'SnLink' })

type LinkType = 'default' | 'primary' | 'info' | 'success' | 'warning' | 'error'

const props = withDefaults(
  defineProps<{
    /** Navigation target. Mirrors n-a `href`. */
    href?: string | undefined
    /** Browsing context for the navigation (`_blank`, …). Mirrors n-a `target`. */
    target?: string | undefined
    /** Relationship metadata for the target. Mirrors n-a `rel`. */
    rel?: string | undefined
    /** Visual type — drives the text color. Mirrors n-a `type`. Default 'default'. */
    type?: LinkType
    /** Disabled state — blocks clicks and navigation. Mirrors n-a `disabled`. Default false. */
    disabled?: boolean
    /** `true` underlines permanently; `false` underlines on hover only. Mirrors n-a `underline`. Default false. */
    underline?: boolean
    /** Element to render as the root. Mirrors n-a `tag`. Default 'a'. */
    tag?: string
  }>(),
  {
    href: undefined,
    target: undefined,
    rel: undefined,
    type: 'default',
    disabled: false,
    underline: false,
    tag: 'a',
  },
)

const emit = defineEmits<{
  /** Fired on activation; suppressed while `disabled`. Mirrors n-a `onClick`. */
  (e: 'click', event: MouseEvent): void
}>()

defineSlots<{
  /** Link text. Mirrors n-a `default`. */
  default?(): unknown
  /** Leading icon. Mirrors n-a `icon`. */
  icon?(): unknown
}>()

const isAnchor = computed(() => props.tag === 'a')

const rootProps = computed<Record<string, string | undefined>>(() => {
  if (!isAnchor.value) return {}
  return {
    href: props.disabled ? undefined : props.href,
    target: props.target,
    rel: props.rel,
  }
})

function handleClick(event: MouseEvent): void {
  if (props.disabled) {
    // Keep the page from navigating; keyboard activation is covered by
    // aria-disabled + the click guard.
    event.preventDefault()
    return
  }
  emit('click', event)
}

const rootClass = computed(() => [
  `sn-link--${props.type}`,
  {
    'sn-link--disabled': props.disabled,
    'sn-link--underline': props.underline,
  },
])
</script>

<template>
  <component
    :is="tag"
    data-snui-component="link"
    class="sn-link"
    :class="rootClass"
    v-bind="rootProps"
    :aria-disabled="disabled ? 'true' : undefined"
    @click="handleClick"
  >
    <span v-if="$slots.icon" class="sn-link__icon" aria-hidden="true">
      <slot name="icon" />
    </span>
    <span class="sn-link__text"><slot /></span>
  </component>
</template>

<style scoped>
/* Web side: --sn-web-* aliases only. Direct --aui-* / --sn-mp-* forbidden
 * (enforced by `pnpm snui token-check --dir packages/vue-web --end web`). */

.sn-link {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  color: var(--sn-web-color-text-primary);
  text-decoration: none;
  cursor: pointer;
  transition: color 0.2s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.sn-link__icon {
  display: inline-flex;
  align-items: center;
}

/* ── type colors ──────────────────────────────────────────────────── */

.sn-link--primary {
  color: var(--sn-web-color-action-primary);
}

.sn-link--info {
  color: var(--sn-web-color-feedback-info);
}

.sn-link--success {
  color: var(--sn-web-color-feedback-success);
}

.sn-link--warning {
  color: var(--sn-web-color-feedback-warning);
}

.sn-link--error {
  color: var(--sn-web-color-feedback-danger);
}

/* ── hover ────────────────────────────────────────────────────────── */

/* Only primary + danger ship `-hover` tokens; the rest dim slightly. */
.sn-link--default:hover {
  text-decoration: underline;
  text-underline-offset: 2px;
}

.sn-link--primary:hover {
  color: var(--sn-web-color-action-primary-hover, var(--sn-web-color-action-primary));
}

.sn-link--info:hover,
.sn-link--success:hover,
.sn-link--warning:hover {
  opacity: 0.8;
}

.sn-link--error:hover {
  color: var(--sn-web-color-feedback-danger-hover, var(--sn-web-color-feedback-danger));
}

/* Hover underline for the colored types. */
.sn-link--primary:hover,
.sn-link--info:hover,
.sn-link--success:hover,
.sn-link--warning:hover,
.sn-link--error:hover {
  text-decoration: underline;
  text-underline-offset: 2px;
}

/* ── underline ────────────────────────────────────────────────────── */

.sn-link--underline {
  text-decoration: underline;
  text-underline-offset: 2px;
}

/* ── disabled ─────────────────────────────────────────────────────── */

.sn-link--disabled {
  opacity: 0.5;
  text-decoration: none;
  cursor: not-allowed;
}
</style>
