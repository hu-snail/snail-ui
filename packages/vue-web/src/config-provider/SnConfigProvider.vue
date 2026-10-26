<script setup lang="ts">
/**
 * SnConfigProvider — global configuration for @snui/vue-web.
 *
 * Per AUI-PRD-v3.0 §3.4 + ADR-0002 + Spec-01 §2.4:
 *   - Web 端 skin prop 直接写到 document.body.classList（文档站 StyleSwitcher 也走这条路径）
 *   - App-level 接入只需用 <SnConfigProvider> 包裹根组件即可
 *
 * Per AGENTS.md §32 + §33, this component owns:
 *   - 全局 skin class 注入
 *   - 组件 locale 的响应式 provide（naive-ui 风格 i18n 入口，见 src/locales）
 *   - 主题持久化（占位：AUI-THEME-002）
 *
 * 不负责：
 *   - Schema 校验
 *   - 业务状态
 *   - 路由
 */

import { computed, inject, isRef, watch, onBeforeUnmount, provide } from 'vue';
import { SN_LOCALE_KEY } from '../locales/use-locale';
import type { SnLocaleInput } from '../locales/use-locale';

import type { SnFontOverride } from './sn-config-provider-types';
defineOptions({ name: 'SnConfigProvider' });

const props = withDefaults(
  defineProps<{
    /**
     * 当前激活的 Style Pack 标识（kebab-case）。
     * 传空字符串 / undefined 时清除已有 skin class。
     * 设为 'default' 等同于清空（默认皮肤无额外样式）。
     */
    skin?: string;
    /**
     * 组件文案 locale（naive-ui 风格）：传内置 `zhCN` / `enUS`（从
     * `@snui/vue-web` 导入）或自定义对象。不传时后代组件回落内置 zhCN。
     * 允许 partial 对象：整个未提供的命名空间回落 zhCN，已提供的命名空间
     * 必须完整（见 `use-locale.ts` 的合并约定）。
     */
    locale?: SnLocaleInput;
    /**
     * 字体覆盖（naive-ui fonts 文档模式）。每个键映射一个语义字体 token：
     * `body` / `heading` / `code` → `--aui-font-family-*`（同时覆盖
     * `--sn-web-font-family-*` 别名层）。提供 `body` 时额外发出
     * `body { font-family }` 规则使整个页面（含 Teleport 弹层）生效。
     * 以内联 `<style>` 标签输出 —— SSR 输出携带覆盖，无闪烁，组件卸载
     * 时随之移除，无全局残留。
     */
    font?: SnFontOverride;
  }>(),
  {
    skin: '',
  },
);

/* ── Font override（naive-ui fonts 文档模式）────────────────────────────── */

/** `--aui-*` semantic font-family tokens, in emission order. */
const FONT_TOKEN_TARGETS: ReadonlyArray<readonly [keyof SnFontOverride, string]> = [
  ['body', '--aui-font-family-body'],
  ['heading', '--aui-font-family-heading'],
  ['code', '--aui-font-family-code'],
] as const;

/**
 * A font stack never legitimately contains `</style` — strip any occurrence
 * so a value can never break out of the emitted `<style>` element (the DOM
 * `textContent` path is inert, but the SSR text path is raw).
 */
function sanitizeFontValue(value: string): string {
  return value.replace(/<\/style/gi, '');
}

/**
 * CSS text emitted into the provider's inline `<style>` tag:
 *   - `:root { --aui-*: X; --sn-web-*: X }` per provided key (the web alias
 *     layer mirrors the aui layer per ADR-0002 dual exposure);
 *   - `body { font-family }` only when `body` is provided — that is the
 *     opt-in global application (covers Teleported overlays too).
 * Empty string when no font / no keys → the tag is not rendered at all.
 */
const fontCss = computed(() => {
  const font = props.font;
  if (!font) return '';
  const declarations: string[] = [];
  for (const [key, auiVar] of FONT_TOKEN_TARGETS) {
    const raw = font[key];
    if (typeof raw !== 'string' || raw === '') continue;
    const value = sanitizeFontValue(raw);
    declarations.push(`${auiVar}:${value}`, `--sn-web-${auiVar.slice(6)}:${value}`);
  }
  if (declarations.length === 0) return '';
  let css = `:root{${declarations.join(';')}}`;
  if (typeof font.body === 'string' && font.body !== '') {
    css += `body{font-family:var(--sn-web-font-family-body, var(--aui-font-family-body))}`;
  }
  return css;
});

/** 给后代组件提供当前 skin（用于子组件内部局部读取）。 */
provide('snui-skin', props.skin);

/**
 * Reactive locale provision（响应式 provide）：提供的是一个跟随 `locale`
 * prop 的 ref，`locale` 变化时后代组件无需重挂载即可切换文案。`null`
 * 表示未提供 locale → 后代回落内置 zhCN。
 */
/**
 * Reactive locale provision（响应式 provide）。未传 `locale` 时**透传祖先**
 * 的注入值（chrome 组件里嵌套的 `<SnConfigProvider skin>` 不会把站点级
 * locale 覆盖掉），都没有才回落 `null` → 后代取内置 zhCN。提供的是跟随
 * `locale` prop 的 ref，后代组件无需重挂载即可切换文案。
 */
const parentLocale = inject(SN_LOCALE_KEY, null);
provide(
  SN_LOCALE_KEY,
  computed<SnLocaleInput | null>(() => {
    if (props.locale) return props.locale;
    return isRef(parentLocale) ? parentLocale.value : parentLocale;
  }),
);

const SKIN_CLASS_PREFIX = 'snui-skin-';

function applySkin(skin: string): void {
  if (typeof document === 'undefined') return;
  // 移除所有 snui-skin-* class
  const cls = document.body.className
    .split(/\s+/)
    .filter((c) => c && !c.startsWith(SKIN_CLASS_PREFIX))
    .join(' ');
  document.body.className = cls.trim();
  if (skin && skin !== 'default') {
    document.body.classList.add(`${SKIN_CLASS_PREFIX}${skin}`);
  }
}

watch(
  () => props.skin,
  (next) => applySkin(next),
  { immediate: true },
);

onBeforeUnmount(() => {
  // 组件卸载时清理 body class，避免影响外层应用
  if (typeof document !== 'undefined') {
    const cls = document.body.className
      .split(/\s+/)
      .filter((c) => c && !c.startsWith(SKIN_CLASS_PREFIX))
      .join(' ');
    document.body.className = cls.trim();
  }
});
</script>

<template>
  <component :is="'style'" v-if="fontCss" :textContent="fontCss" />
  <slot />
</template>
