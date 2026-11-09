/** Menu (Web) — English page data. Props from SnMenu.vue. */
import type { SnDocPageData } from '../../components/doc-page/types';

export const menuDocPageEn: SnDocPageData = {
  crumbs: [{ text: 'Docs', link: '/en/' }, { text: 'Navigation' }, { text: 'Menu' }],
  title: 'Menu',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'Web & Uni-App parity', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [
    {
      t: 'text',
      s: 'Hierarchical navigation menu. Horizontal mode for top-bar nav; vertical mode for sidebar / sidenav with collapsible sub-groups.',
    },
  ],
  quickActions: [
    {
      icon: 'copy',
      label: 'Add @snui/vue-web',
      copy: 'pnpm add @snui/vue-web',
      copiedLabel: 'Copied',
    },
    {
      icon: 'link',
      label: 'View source',
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/vue-web/src/menu',
    },
  ],
  usage: {
    hint: [],
    fileLabel: 'Menu.vue',
    meta: 'Vue 3 · <script setup>',
    code: `
<script setup lang="ts">
import { Menu } from '@snui/vue-web';
</script>

<template>
  <Menu />
</template>`,
  },
  demos: [
    { name: 'menu-web-basic', title: 'Basic usage', blurb: 'Basic usage' },
    { name: 'menu-web-vertical', title: 'Vertical layout', blurb: 'Vertical layout' },
    { name: 'menu-web-icons', title: 'With icons', blurb: 'With icons' },
    { name: 'menu-web-inverted', title: 'Inverted theme', blurb: 'Inverted theme' },
    { name: 'menu-web-field-remap', title: 'Field remapping', blurb: 'Field remapping' },
    { name: 'menu-web-collapsed', title: 'Collapsed', blurb: 'Collapsed' },
    { name: 'menu-web-collapsed-inline', title: 'Inline collapse', blurb: 'Inline collapse' },
    {
      name: 'menu-web-responsive-collapse',
      title: 'Responsive collapse',
      blurb: 'Responsive collapse',
    },
    { name: 'menu-web-inline-submenu', title: 'Inline submenu', blurb: 'Inline submenu' },
    { name: 'menu-web-pop-button', title: 'Pop-up menu', blurb: 'Pop-up menu' },
  ],
  props: {
    hint: [],
    rows: [
      {
        name: 'mode',
        type: "'vertical' | 'horizontal' | 'popButton'",
        default: "'vertical'",
        desc: "Display mode. Mirrors n-menu `mode` plus AUI extension `popButton`. Default 'vertical'. - `vertical`   — sidebar / inline expansion - `horizontal` — top navbar - `popButton`  — Floating Action Button (FAB) menu: all items render as circular icon buttons stacked vertically. The trigger (last by default, or the item whose key matches `triggerKey`) is always visible; hovering the menu area expands the other items above the trigger. Each item shows a `<SnTooltip>` on hover. Position the menu inside a `position: relative` parent to anchor it where you want. AUI extension beyond n-menu — naive-ui doesn't ship a popButton mode.",
      },
      {
        name: 'triggerKey',
        type: 'string | number',
        default: "''",
        desc: 'Which item is the always-visible trigger in popButton mode. Defaults to the last item in `options`. AUI extension.',
      },
      {
        name: 'options',
        type: 'SnMenuOption[]',
        default: '() => []',
        desc: 'Menu options tree. Mirrors n-menu `options`.',
      },
      {
        name: 'value',
        type: 'string | number | null',
        default: 'null',
        desc: 'Selected key. Mirrors n-menu `value`.',
      },
      {
        name: 'defaultValue',
        type: 'string | number | null',
        default: 'null',
        desc: 'Default selected key. Mirrors n-menu `defaultValue`. Default null.',
      },
      {
        name: 'expandedKeys',
        type: 'Array<string | number>',
        default: '() => []',
        desc: 'Expanded submenu keys. Mirrors n-menu `expandedKeys`.',
      },
      {
        name: 'defaultExpandedKeys',
        type: 'Array<string | number>',
        default: '() => []',
        desc: 'Default expanded keys. Mirrors n-menu `defaultExpandedKeys`.',
      },
      {
        name: 'defaultExpandAll',
        type: 'boolean',
        default: 'false',
        desc: 'Whether to expand all submenus by default. Mirrors n-menu `defaultExpandAll`.',
      },
      {
        name: 'accordion',
        type: 'boolean',
        default: 'false',
        desc: 'Restrict to single expanded submenu. Mirrors n-menu `accordion`.',
      },
      {
        name: 'indent',
        type: 'number',
        default: '32',
        desc: 'Indent per level (px). Mirrors n-menu `indent`. Default 32.',
      },
      {
        name: 'inverted',
        type: 'boolean',
        default: 'false',
        desc: 'Dark backdrop variant — colors flip for use on color-background navbars. Mirrors n-menu `inverted`. Default false.',
      },
      {
        name: 'keyField',
        type: 'string',
        default: "'key'",
        desc: "Field name used to read each node's `key`. Mirrors n-menu `key-field`.",
      },
      {
        name: 'labelField',
        type: 'string',
        default: "'label'",
        desc: "Field name used to read each node's `label`. Mirrors n-menu `label-field`.",
      },
      {
        name: 'childrenField',
        type: 'string',
        default: "'children'",
        desc: "Field name used to read each node's children array. Mirrors n-menu `children-field`.",
      },
      {
        name: 'collapsed',
        type: 'boolean',
        default: 'false',
        desc: 'Whether the menu is rendered in collapsed (icon-only) form. Mirrors n-menu `collapsed`. Submenus in collapsed mode open via a hover popover anchored to the right of the parent item. Default false.',
      },
      {
        name: 'collapsedWidth',
        type: 'number',
        default: '48',
        desc: 'Width (px) of the collapsed bar. Mirrors n-menu `collapsed-width`. Default 48 (matches Element Plus).',
      },
      {
        name: 'collapsedIconSize',
        type: 'number',
        default: '24',
        desc: 'Icon size (px) used in collapsed mode. Mirrors n-menu `collapsed-icon-size`. Default 24.',
      },
      {
        name: 'iconSize',
        type: 'number',
        default: '20',
        desc: 'Icon size (px) used in normal mode. Mirrors n-menu `icon-size`. Default 20.',
      },
      {
        name: 'dropdownPlacement',
        type: "'right-start' | 'right' | 'right-end' | 'bottom-start' | 'bottom'",
        default: "'right-start'",
        desc: "Popover placement for submenus in collapsed mode. Mirrors n-menu `dropdown-placement`. Default 'right-start' (popover opens to the right of the bar, top-aligned with the hovered item — matches Element Plus and naive-ui default).",
      },
      {
        name: 'disabledField',
        type: 'string',
        default: "'disabled'",
        desc: "Field name used to read each node's `disabled` flag. Mirrors n-menu `disabled-field`. Default 'disabled'.",
      },
      {
        name: 'breakpoint',
        type: "'xs' | 'sm' | 'md' | 'lg' | 'xl' | number",
        default: '—',
        desc: "Viewport breakpoint below which the menu auto-collapses. Mirrors Element Plus `el-menu` `breakpoint`. When the window inner-width is strictly less than the threshold, the menu collapses and emits `update:collapsed`. Set to `undefined` (default) to disable responsive collapse — `collapsed` is then purely consumer-driven. Accepts either a named token (Element Plus convention): - `'xs'` → 480px - `'sm'` → 768px - `'md'` → 992px - `'lg'` → 1200px - `'xl'` → 1920px or an explicit pixel number. On SSR / non-browser environments the resize listener is not installed and the prop is a no-op.",
      },
      {
        name: 'defaultCollapsed',
        type: 'boolean',
        default: 'false',
        desc: 'Initial collapsed state for the responsive-collapse path (i.e. when `breakpoint` is set). When `breakpoint` is unset this prop is ignored — uncontrolled initial state is whatever `collapsed` is at mount. Default false.',
      },
    ],
  },
  ai: {
    badge: 'ai-description.md · bundled',
    heading: 'A machine-readable contract for LLMs',
    copy: 'Menu ships an AI-friendly description consumed by @snui/cli generateDocs() and generateLlmsTxt().',
    chip: "import { Menu } from '@snui/vue-web';",
    chipCopy: "import { Menu } from '@snui/vue-web';",
    stats: [
      { key: 'intent.action', value: 'Menu', tone: 'accent' },
      { key: 'intent.end', value: 'web', tone: 'cyan' },
      { key: 'a11y', value: 'token-driven', tone: 'ok' },
    ],
  },
  pager: {},
  toc: [
    { id: 'usage', text: 'Code Usage' },
    { id: 'demos', text: 'Examples' },
    { id: 'api', text: 'Props Reference' },
    { id: 'ai-native', text: 'AI-Native Integration' },
  ],
};
