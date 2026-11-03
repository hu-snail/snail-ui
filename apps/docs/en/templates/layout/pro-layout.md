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

## Settings drawer & tab bar

Two controlled, purely additive capabilities — nothing renders unless wired:

- **Settings drawer** (`show-settings`) — the gear opens a preferences
  panel: four layout-shape cards, light/dark mode, primary-color swatches and
  the tab-bar style. The gear is reachable in every shape (header for
  side/top/mix; the strip's right side in headerless dual). Omitting `mode` /
  `primaryId` / `tabType` hides that
  section; copy is localized through `settingsLabels`, and choices only leave
  the package via `update:mode` / `update:primaryId` / `update:tabType` for the
  host to persist;
- **Visited-route tab bar** (`show-tabs`) — `tabs: { key, label, closable? }[]`
  is host-tracked (pass `closable: false` for affix tabs). Clicking and closing
  emit `tab-select` / `tab-close`; navigation and the post-close route
  convergence stay in the host.

<Demo name="pro-layout-web-prefs" description="Settings drawer (shape / mode / primary color / tab style) + visited-route tab bar with a non-closable affix tab." />

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
`#footer`); the six pieces (`SnProLogo` / `SnProSider` / `SnProHeader` /
`SnProTabbar` / `SnProSettings`) are also importable standalone for custom
compositions.

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
| showSettings        | `boolean`                               | `false`      | Show the header settings gear                      |
| settingsLabel       | `string`                                | built-in zh  | Gear accessible label                              |
| settingsLabels      | `Partial<SnProSettingsLabels>`          | built-in zh  | Settings panel copy (panel i18n comes from the host) |
| mode                | `'light' \| 'dark'`                     | —            | Theme mode, `v-model:mode`; omit → section hidden  |
| primaryId           | `string`                                | —            | Primary preset id, `v-model:primaryId`; omit → section hidden |
| primaryColors       | `SnProPrimaryColor[]`                   | `[]`         | Primary swatches (`{ id, color }`)                 |
| showTabs            | `boolean`                               | `false`      | Show the visited-route tab bar                     |
| tabs                | `SnProTabItem[]`                        | `[]`         | Tab list (host-tracked; `closable: false` = affix) |
| tabType             | `'line' \| 'card' \| 'bar' \| 'segment' \| 'chrome'` | `'chrome'` | Tab style, `v-model:tabType` switchable from the panel |

### Events

| Event                 | Payload       | Description                                        |
| --------------------- | ------------- | -------------------------------------------------- |
| `select`              | `(key, item)` | Menu click — **navigation is the host's job**      |
| `update:layout`       | `(mode)`      | `v-model:layout`                                   |
| `update:collapsed`    | `(collapsed)` | `v-model:collapsed`                                |
| `update:expandedKeys` | `(keys)`      | Controlled expansion sync                          |
| `update:mode`         | `(mode)`      | Light/dark switch from the settings panel          |
| `update:primaryId`    | `(id)`        | Primary-color switch from the settings panel       |
| `update:tabType`      | `(type)`      | Tab-style switch from the settings panel           |
| `tab-select`          | `(key)`       | Tab click — **navigation is the host's job**       |
| `tab-close`           | `(key)`       | Tab close — **post-close route convergence is the host's job** |

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
| `SnProTabbar` | `tabs / activeKey / type`                                 | Tab bar; five SnTabs styles                    |
| `SnProSettings` | `show / layout / mode / primaryId / primaryColors / tabType / labels` | Preferences drawer; omitting a controlled prop hides its section |

## Theming & dark mode

All colors go through `--sn-web-*` tokens and follow the host dark-mode
mechanism; `invertedSider` is the classic dark admin sider (same surface as
SnMenu inverted). Component-level override hooks: `--sn-pro-sider-bg` /
`--sn-pro-sider-border-color` / `--sn-pro-sider-title-color` /
`--sn-pro-logo-title`.

## AI contract

The machine-readable contract lives at `src/pro-layout/ai-description.md` in
the package (including the AI Patch Boundary: `layout / menus / activeKey /
collapsed / breadcrumb / brand trio / showSettings group / showTabs group` are
patchable; navigation, post-close route convergence, real reskinning, auth and
requests are readonly-never-patchable).
