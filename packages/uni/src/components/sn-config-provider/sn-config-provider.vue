<script setup lang="ts">
/**
 * sn-config-provider — global configuration for @snui/uni.
 *
 * Reference library: wot-ui `wd-config-provider`
 *   (https://wot-ui.cn/component/config-provider.html)
 * Per AGENTS.md §112, the prop surface below mirrors wd-config-provider 1:1
 * (`theme` / `theme-vars` / `custom-class` / `custom-style`). `skin` is the
 * AUI-specific Style Pack hook that wd has no equivalent for — it is additive,
 * never a replacement.
 *
 * Per AUI-PRD-v3.0 §3.4 + ADR-0002 + Spec-01 §2.4:
 *   - uni 端 skin 通过组件 scoped CSS 传递（小程序 WXSS 不支持 :root）
 *   - ConfigProvider 根元素加 .snui-skin-{name} class，覆盖范围局限于本子树
 *
 * ## Theme (dark mode)
 *
 * wd-config-provider flips its subtree to dark via `theme="dark"`. The uni end
 * has no `<html>` to toggle and no `:root` in miniprogram WXSS, so the dark
 * palette is expressed as a class on this component's root: `.sn-theme-dark`
 * (declared in `@snui/tokens-mp/styles`). Descendant components resolve their
 * `--sn-mp-color-*` aliases against that scoped class, which is exactly the
 * containment the prop promises — siblings outside the provider stay light.
 *
 * `themeVars` writes inline custom properties on the root, so a consumer can
 * override a single slot without shipping a stylesheet:
 *
 *   <sn-config-provider :theme-vars="{ '--sn-mp-color-action-primary': '#07c160' }">
 *
 * Keys may be written either fully (`--sn-mp-…`) or in wot-style camelCase
 * (`buttonPrimaryBgColor`) — the camelCase form is converted by prefixing
 * `--sn-mp-` and kebab-casing the segments, so both dialects land on the same
 * CSS variable.
 *
 * Per AGENTS.md §32, this component owns:
 *   - skin / theme / theme-vars 提供（向下传递）
 *
 * 不负责：Schema 校验 / 业务状态 / 路由。
 */

import { computed, provide } from 'vue';

defineOptions({ name: 'SnConfigProvider' });

/** Theme mode. Mirrors `wd-config-provider` `theme`. */
type ConfigProviderTheme = 'light' | 'dark';

/**
 * Theme variable overrides. Keys are either CSS custom property names
 * (`--sn-mp-color-action-primary`) or wot-style camelCase
 * (`buttonPrimaryBgColor`); values are any CSS value.
 */
type ConfigProviderThemeVars = Record<string, string>;

const props = withDefaults(
  defineProps<{
    /** 当前激活的 Style Pack 标识（kebab-case）。'default' 或空 = 无 skin class。 */
    skin?: string;
    /** Theme mode for this subtree. Mirrors `wd-config-provider` theme. */
    theme?: ConfigProviderTheme;
    /** Per-subtree CSS variable overrides. Mirrors `wd-config-provider` theme-vars. */
    themeVars?: ConfigProviderThemeVars;
    /** Custom class on the root node. Mirrors `wd-config-provider` custom-class. */
    customClass?: string;
    /** Custom inline style on the root node. Mirrors `wd-config-provider` custom-style. */
    customStyle?: string;
  }>(),
  {
    skin: '',
    theme: 'light',
    themeVars: () => ({}),
    customClass: '',
    customStyle: '',
  },
);

provide('snui-skin', props.skin);

/** camelCase → `--sn-mp-kebab-case`. Already-prefixed keys pass through. */
function toCssVarName(key: string): string {
  if (key.startsWith('--')) return key;
  const kebab = key.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
  return `--sn-mp-${kebab}`;
}

const themeVarsStyle = computed(() => {
  const entries = Object.entries(props.themeVars);
  if (entries.length === 0) return '';
  return entries.map(([key, value]) => `${toCssVarName(key)}: ${value}`).join('; ');
});

const rootStyle = computed(() => {
  const parts = [themeVarsStyle.value, props.customStyle].filter(Boolean);
  return parts.length > 0 ? parts.join('; ') : undefined;
});

const rootClass = computed(() => [
  'sn-config-provider',
  props.skin && props.skin !== 'default' ? `snui-skin-${props.skin}` : '',
  props.theme === 'dark' ? 'sn-theme-dark' : '',
  props.customClass,
]);
</script>

<template>
  <view :class="rootClass" :style="rootStyle" :data-snui-theme="theme">
    <slot />
  </view>
</template>

<style scoped>
/*
 * The dark palette, declared by THIS component's own stylesheet.
 *
 * Why a copy of tokens-mp's `.sn-theme-dark` block lives here: on
 * mini-programs, app.wxss (global) styles cannot match nodes inside a custom
 * component (default style isolation) — and the provider root IS such a node,
 * so the global dark rule never landed and the whole subtree stayed light
 * (user-reported). A scoped rule matches the root it ships with, and the
 * custom properties then inherit into every child component normally.
 *
 * Only LITERAL payloads are mirrored: the brand / feedback hues keep their
 * identity in dark mode (they resolve from the page-level definitions), and
 * a var() payload would be unresolvable on WeChat MP anyway — consumers keep
 * their two-line floors there.
 */
.sn-theme-dark {
  --sn-mp-color-text-primary: #fafafa;
  --sn-mp-color-text-secondary: #a1a1aa;
  --sn-mp-color-text-tertiary: #71717a;
  --sn-mp-color-text-disabled: #52525b;
  --sn-mp-color-background-surface: #09090b;
  --sn-mp-color-background-subtle: #27272a;
  --sn-mp-color-background-elevated: #18181b;
  --sn-mp-color-background-soft: #27272a;
  --sn-mp-color-background-sunken: #18181b;
  --sn-mp-color-border-default: #27272a;
  --sn-mp-color-border-subtle: #27272a;
  --sn-mp-color-feedback-success-soft: rgba(16, 185, 129, 0.22);
  --sn-mp-color-feedback-warning-soft: rgba(245, 158, 11, 0.22);
  --sn-mp-color-feedback-danger-soft: rgba(239, 68, 68, 0.22);
  --sn-mp-color-feedback-info-soft: rgba(113, 113, 122, 0.22);
  --sn-mp-color-volcano-soft: rgba(250, 140, 22, 0.22);
  --sn-mp-color-lightblue-soft: rgba(56, 189, 248, 0.22);
  --sn-mp-color-cyan-soft: rgba(8, 145, 178, 0.22);
  --sn-mp-color-pink-soft: rgba(219, 39, 119, 0.22);
  --sn-mp-color-purple-soft: rgba(124, 58, 237, 0.22);
  --sn-mp-color-input-bg: #18181b;
  --sn-mp-color-input-text: #fafafa;
  --sn-mp-color-input-placeholder: #52525b;
  --sn-mp-color-input-border: #27272a;
  --sn-mp-color-control-unchecked: #3f3f46;
  --sn-mp-color-control-knob: #fafafa;
  --sn-mp-color-background-overlay: rgba(0, 0, 0, 0.8);
  --sn-mp-color-background-solid: #000000;
  --sn-mp-color-text-on-primary: #ffffff;
}
</style>
