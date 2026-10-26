# Fonts

Component typography is fully token-driven. The default font stacks live in
the `@snui/tokens` base layer with these semantic bindings (same idea as the
naive-ui [fonts guide](https://www.naiveui.com/zh-CN/light/docs/fonts) — font
files (@font-face / web fonts) are the host app's job; the library only
injects the stacks into the token cascade):

| Semantic token              | Default binding               | Purpose                                |
| --------------------------- | ----------------------------- | -------------------------------------- |
| `--aui-font-family-body`    | `var(--aui-font-family-sans)` | body / default component font          |
| `--aui-font-family-heading` | `var(--aui-font-family-sans)` | headings                               |
| `--aui-font-family-code`    | `var(--aui-font-family-mono)` | code / monospace                       |
| `--sn-web-font-family-*`    | `var(--aui-font-family-*)`    | alias layer consumed by web components |

## Option 1: the `font` prop on `SnConfigProvider`

```vue
<script setup lang="ts">
import { SnConfigProvider } from '@snui/vue-web';

const font = {
  body: '"Inter", "PingFang SC", sans-serif',
  heading: '"Inter Display", sans-serif',
  code: '"JetBrains Mono", ui-monospace, monospace',
};
</script>

<template>
  <SnConfigProvider :font="font">
    <router-view />
  </SnConfigProvider>
</template>
```

Behavior details:

- Each provided key emits a `:root`-level CSS variable override (both the
  `--aui-*` base layer and the `--sn-web-*` alias layer); omitted keys keep
  the token defaults.
- Providing `body` additionally emits a
  `body { font-family: var(--sn-web-font-family-body) }` rule — this is the
  **opt-in** global application, page-wide (including Teleported overlays).
  Overriding only `code` / `heading` never touches the page default font.
- Implemented as an inline `<style>` tag owned by the component: it ships
  with the SSR output (**no font flash**), is removed on unmount with no
  global residue, and updates reactively when the prop changes.
- Values are sanitized — `</style` sequences are stripped, so a font stack
  can never inject markup.

## Option 2: global stylesheet override (best for SSR / pure CSS)

No JS needed — override the tokens in your global stylesheet (source order
wins; place it after `@snui/vue-web/styles`):

```css
:root {
  --aui-font-family-body: 'Inter', 'PingFang SC', sans-serif;
  --sn-web-font-family-body: 'Inter', 'PingFang SC', sans-serif;
}

body {
  font-family: var(--sn-web-font-family-body, var(--aui-font-family-body));
}
```

This is the recommended path for Nuxt: the font variables take effect in the
server-rendered HTML natively — zero flash, zero JS.

## Loading font files

The font files themselves are app concerns:

```html
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap" rel="stylesheet" />
```

Or use `@font-face` with self-hosted fonts, then pass the stacks to the
`font` prop or your global CSS.
