# SSR (Server-Side Rendering) with Nuxt.js

Every component in `@snui/vue-web` renders on the server via
`renderToString` from `vue/server-renderer`. The repo ships a full-library
smoke test (`packages/vue-web/src/ssr-render.test.ts`) that runs in a real
Node environment — no `window` / `document` — so any regression that touches
browser globals at module top level, during `setup()`, or inside an
`immediate` watcher fails CI immediately.

## Nuxt 3 setup

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  build: {
    // Vue SFC libraries must be transpiled
    transpile: ['@snui/vue-web'],
  },
  css: ['@snui/vue-web/styles'],
});
```

```vue
<!-- app.vue -->
<template>
  <SnConfigProvider>
    <NuxtPage />
  </SnConfigProvider>
</template>
```

`SnConfigProvider` owns the global skin / locale / font configuration; the
`styles` entry emits the full `--aui-*` base layer and the `--sn-web-*`
alias layer as CSS variables.

## Server behavior contract

- Browser APIs (`window` / `document` / `matchMedia` / observers, …) are
  SSR-guarded everywhere: the server renders safe defaults and full
  interactivity (listeners, observers, canvas drawing) is restored in
  `onMounted` on the client.
- Teleported overlays (Dialog / Drawer / Popover, …) render nothing on the
  server while closed; the open state is driven by client interaction and
  never participates in hydration mismatches.
- `immediate: true` watchers skip all listener registration on the server.

## Notes

- As with any SSR app, components that measure layout (`SnAffix`,
  `SnVirtualList`) render a skeleton on the server; sizes are computed
  after client hydration.
- Canvas-based components (`SnQrCode`, `SnEquation`) render a placeholder
  on the server and draw on the client.
- Custom fonts configured through the `SnConfigProvider` `font` prop are
  emitted as an inline `<style>` tag that ships with the SSR output — no
  font flash (see [Fonts](/en/guide/web/fonts)).
