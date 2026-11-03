# Admin Layout SnProLayout

An installable **layout shell** for admin dashboards: the logo, sider, top
bar, content area, footer placement and geometry, four layout shapes and
collapse state — all packed into one `SnProLayout`. Projects already using
`@snui/vue-web` install the package and replace their own `layout.vue`.

> Platform: `Web` · Package: `@snui/admin-layout` · Status: `@experimental`

> **Scope boundary (read this first)**
>
> This template **handles layout only — no business features**: no auth, no
> requests, no token/store handling, no route registration. Where menu data
> comes from (static routes or a backend API) and what a click navigates to
> (`router.push`) are host decisions — the template only emits `select(key)`.

## When to use

- Starting a new admin project without re-typing the sider + header + breadcrumb shell
- Switching layout shapes in an existing project (classic sider ↔ top nav ↔ mixed), or letting users switch
- Menus coming from a local static route table, or from a backend menu API
- Keeping business wiring (auth, requests, stores) in the host — the template never touches it

## Install

```bash
pnpm add @snui/admin-layout
```

Peer requirement: `@snui/vue-web` (tokens and base components come from it;
this package does not re-emit them). Import on demand plus one stylesheet:

```ts
import { SnProLayout, routesToMenuOptions } from '@snui/admin-layout';
import '@snui/admin-layout/styles'; // shell classes only; tokens come from @snui/vue-web/styles
```

## Layout shapes

Four built-in shapes mirroring vue-element-admin / vben-admin / ant-design-pro,
switchable via `v-model:layout`:

| `layout` | Structure                                                            | Reference                |
| -------- | -------------------------------------------------------------------- | ------------------------ |
| `side`   | Sider (logo + vertical menu) + header (toggle / breadcrumb / actions) | vue-element-admin        |
| `top`    | Header (logo + horizontal menu + actions) + content                   | ant-design-pro top       |
| `mix`    | Header hosts top-level menu; sider shows its children                 | vben-admin mixed-nav     |
| `dual`   | Icon rail (top level) + secondary menu column + content               | vben mixed-sidebar       |

<Demo name="pro-layout-web-side" description="side — classic sider, breadcrumb derived from the menu path." />

<Demo name="pro-layout-web-top" description="top — top-level menu collapsed into the header." />

<Demo name="pro-layout-web-mix" description="mix — top level in the header, children in the sider; sider hides when the branch is childless." />

<Demo name="pro-layout-web-dual" description="dual — icon rail + secondary column; the strip toggle folds the second column." />

## Switching shapes

Bind `v-model:layout` to a host state — a settings panel can switch freely:

<Demo name="pro-layout-web-switch" description="Four shapes, one menu data source — switching only changes geometry." />

## Menu sources

Two sources, one shape (`SnMenuOption[]`) — the layout is agnostic:

1. **Static routes** — `routesToMenuOptions(routes, { iconMap })` is a pure
   function over the local route table reading `meta.title / meta.icon /
   meta.hidden / meta.order` (structurally typed; both `RouteRecordRaw[]` and
   `router.options.routes` fit, no vue-router dependency);
2. **Dynamic menus (backend)** — the host maps API rows into
   `{ key, label, children?, icon? }`. The mapping (field names, permission
   filtering, i18n) is business logic and stays in the host.

<Demo name="pro-layout-web-routes" description="Menus derived from a route table: redirect parents collapse, hidden subtrees drop, order sorts." />

A click only emits `select(key, item)`; navigation lives in the host:

```vue
<SnProLayout :menus="menus" :active-key="route.name" @select="(key) => router.push({ name: key })">
  <RouterView />
</SnProLayout>
```

## Replace your layout.vue

Before / after for a typical admin project:

```vue
<script setup lang="ts">
// Before: hand-written aside / header / menu / breadcrumb structure + styles,
//         with auth store, i18n and logout wiring in the same file.
// After:  structure goes to SnProLayout; business wiring stays in the host.
import { useRoute, useRouter } from 'vue-router';
import { SnProLayout, routesToMenuOptions } from '@snui/admin-layout';

const route = useRoute();
const router = useRouter();
const menus = routesToMenuOptions(router.options.routes); // or host-mapped backend data
</script>

<template>
  <SnProLayout
    logo="/logo.svg"
    title="Admin"
    :menus="menus"
    :active-key="route.name"
    :breadcrumb="['Workbench', 'Home']"
    @select="(key) => router.push({ name: key })"
  >
    <RouterView />
  </SnProLayout>
</template>
```

Slots cover the brand, header actions and footer (`#logo` / `#actions` /
`#footer`); the four pieces (`SnProLogo` / `SnProSider` / `SnProHeader`) are
also importable standalone for custom compositions.

## API

### SnProLayout Props

| Prop                | Type                                    | Default      | Description                                        |
| ------------------- | --------------------------------------- | ------------ | -------------------------------------------------- |
| layout              | `'side' \| 'top' \| 'mix' \| 'dual'`    | `'side'`     | Layout shape, `v-model:layout`                     |
| logo / title / mark | `string`                                | —            | Brand trio (image / title / letter tile)           |
| menus               | `SnMenuOption[]`                        | `[]`         | Menu tree (route-derived or backend-mapped)        |
| activeKey           | `string \| number \| null`              | `null`       | Selected menu key (usually `route.name`)           |
| collapsed           | `boolean \| undefined`                  | —            | Collapse state, `v-model:collapsed`; omit = uncontrolled |
| siderWidth          | `number`                                | `224`        | Expanded sider width (px)                          |
| siderCollapsedWidth | `number`                                | `56`         | Collapsed sider width (px)                         |
| fixed               | `boolean`                               | `true`       | Pin to viewport (100vh); `false` → height 100%     |
| showCollapse        | `boolean`                               | `true`       | Toggle the collapse button                         |
| invertedSider       | `boolean`                               | `false`      | Dark sider surface (matches n-menu inverted)       |
| breadcrumb          | `string[]`                              | auto-derived | Explicit breadcrumb; omit → derive from menu path  |
| accordion           | `boolean`                               | `false`      | Single-open submenus                               |
| expandedKeys        | `(string \| number)[]`                  | —            | Controlled expansion; omit → menu self-manages     |

### Events

| Event                 | Payload       | Description                                        |
| --------------------- | ------------- | -------------------------------------------------- |
| `select`              | `(key, item)` | Menu click — **navigation is the host's job**      |
| `update:layout`       | `(mode)`      | `v-model:layout`                                   |
| `update:collapsed`    | `(collapsed)` | `v-model:collapsed`                                |
| `update:expandedKeys` | `(keys)`      | Controlled expansion sync                          |

### Slots

| Slot      | Description                                            |
| --------- | ------------------------------------------------------ |
| default   | Routed content (`<RouterView />`)                      |
| `actions` | Header right-hand actions (user menu, theme switch, …) |
| `logo`    | Full brand replacement                                 |
| `footer`  | Footer under the content area                          |

### Pieces

| Component     | Key props                                                 | Notes                                     |
| ------------- | --------------------------------------------------------- | ----------------------------------------- |
| `SnProLogo`   | `logo / title / mark / collapsed`                         | Brand; `#icon` swaps the mark, default slot replaces all |
| `SnProSider`  | `menus / activeKey / collapsed / inverted / showBrand`    | Left sider; forwards SnMenu events        |
| `SnProHeader` | `showBrand / menus / activeKey / breadcrumb / showCollapse` | Top bar; horizontal menu wins over breadcrumb |

## Theming & dark mode

All colors go through `--sn-web-*` tokens and follow the host dark-mode
mechanism; `invertedSider` is the classic dark admin sider (same surface as
SnMenu inverted). Component-level override hooks: `--sn-pro-sider-bg` /
`--sn-pro-sider-border-color` / `--sn-pro-sider-title-color` /
`--sn-pro-logo-title`.

## AI contract

The machine-readable contract lives at `src/pro-layout/ai-description.md` in
the package (including the AI Patch Boundary: `layout / menus / activeKey /
collapsed / breadcrumb / brand trio` are patchable; navigation, auth and
requests are readonly-never-patchable).
