# classic — classic enterprise admin

`classic` is the second layout style of `@snui/admin-layout`: **categorized sider + full-bleed
content header + module title band**.

> Platform: `Web` · Component: `SnProLayoutClassic` · Entry: `@snui/admin-layout/layouts/classic` · Status: `@experimental`

## Standalone import

```ts
import { SnProLayoutClassic } from '@snui/admin-layout/layouts/classic';
import '@snui/admin-layout/layouts/classic/style.css'; // classic shell CSS only
```

The barrel entry (`@snui/admin-layout` + `@snui/admin-layout/styles`) works too — see
[the overview](../admin-layout#how-styles-load).

## Structure

| Region         | Contents                                                                                                              |
| -------------- | --------------------------------------------------------------------------------------------------------------------- |
| Sider          | Brand on top (`SnProLogo`) → categorized menu with children (`SnMenu` vertical) → user card at the bottom (`SnProUser`, avatar only when folded) |
| Content header | Collapse toggle · breadcrumb (derived from the menu path when omitted) · menu search (`SnProSearch`) · notifications (`SnProNotice`) · `#actions` slot |
| Title band     | Large `pageTitle` heading (replaced wholesale by the `#title` slot)                                                    |
| Content        | Light full-bleed surface + default slot (`<RouterView />`), optional `#footer`                                         |

<Demo name="pro-layout-web-classic" description="classic — categorized sider + user card + header breadcrumb / search / notifications; the title band follows the menu." />

## Usage

```vue
<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';
import { SnProLayoutClassic } from '@snui/admin-layout/layouts/classic';
import '@snui/admin-layout/layouts/classic/style.css';
import { routesToMenuOptions } from '@snui/admin-layout';

const route = useRoute();
const router = useRouter();
const menus = routesToMenuOptions(router.options.routes);
</script>

<template>
  <SnProLayoutClassic
    v-model:collapsed="collapsed"
    title="Admin"
    :menus="menus"
    :active-key="route.name"
    :page-title="String(route.meta.title ?? '')"
    :user="user"
    :user-menus="userMenus"
    :notice-count="unread"
    :notice-items="notices"
    @select="(key) => router.push({ name: key })"
    @search-select="(key) => router.push({ name: key })"
    @notice-select="openNotice"
    @notice-read-all="markAllRead"
    @user-select="onUserMenu"
  >
    <RouterView />
  </SnProLayoutClassic>
</template>
```

## API

### SnProLayoutClassic Props

| Prop                | Type                       | Default      | Description                                    |
| ------------------- | -------------------------- | ------------ | ---------------------------------------------- |
| menus               | `SnMenuOption[]`           | `[]`         | Menu tree (categories + children)              |
| activeKey           | `string \| number \| null` | `null`       | Selected menu key (usually `route.name`)       |
| collapsed           | `boolean \| undefined`     | —            | Fold state, `v-model:collapsed`; omit = uncontrolled |
| siderWidth          | `number`                   | `224`        | Expanded sider width (px)                      |
| siderCollapsedWidth | `number`                   | `56`         | Folded sider width (px)                        |
| fixed               | `boolean`                  | `true`       | Pin to viewport (100vh); `false` → height 100% |
| showCollapse        | `boolean`                  | `true`       | Header collapse toggle                         |
| collapseLabel       | `string`                   | built-in zh  | Accessible label of the toggle                 |
| logo / title / mark | `string`                   | —            | Brand trio (image / title / letter tile)       |
| breadcrumb          | `string[]`                 | auto-derived | Explicit breadcrumb; omit → derive from menu path |
| pageTitle           | `string`                   | —            | Module heading (`#title` slot replaces it)     |
| showSearch          | `boolean`                  | `true`       | Built-in header menu search (`SnProSearch`)    |
| searchPlaceholder   | `string`                   | built-in zh  | Search placeholder                             |
| showNotice          | `boolean`                  | `true`       | Built-in header notifications (`SnProNotice`)  |
| noticeCount         | `number`                   | `0`          | Unread badge count (`0` hides it)              |
| noticeItems         | `SnProNoticeItem[]`        | `[]`         | Notification rows (host-owned data)            |
| user                | `SnProUserProfile`         | —            | Sider-footer user card; omitted → not rendered |
| userMenus           | `SnMenuOption[]`           | `[]`         | Rows of the user card's dropdown               |

### SnProLayoutClassic Events

| Event               | Payload       | Description                                        |
| ------------------- | ------------- | -------------------------------------------------- |
| `select`            | `(key, item)` | Menu click — **navigation is the host's job**      |
| `update:collapsed`  | `(collapsed)` | `v-model:collapsed`                                |
| `search-select`     | `(key, item)` | Search-result click — **navigation is the host's job** |
| `notice-select`     | `(key, item)` | Notification click — **opening / marking read is the host's job** |
| `notice-read-all`   | —             | "Mark all read" — **the host performs it**         |
| `user-select`       | `(key, item)` | User-card menu click — **the meaning is the host's call** |

### SnProLayoutClassic Slots

| Slot      | Description                                            |
| --------- | ------------------------------------------------------ |
| default   | Routed content (`<RouterView />`)                      |
| `logo`    | Full brand replacement                                 |
| `title`   | Full module-heading replacement                        |
| `search`  | Full header search replacement (default SnProSearch)   |
| `notice`  | Full header notification replacement (default SnProNotice) |
| `actions` | Extra right-hand header actions (after search + notice) |
| `user`    | Full sider-footer replacement (default SnProUser)      |
| `footer`  | Footer under the content area                          |

## Theming & dark mode

All colors go through `--sn-web-*` tokens and follow the host dark-mode mechanism. Shell hooks:
`--sn-pro-classic-sider-width` / `--sn-pro-classic-sider-collapsed-width` /
`--sn-pro-classic-sider-bg` / `--sn-pro-classic-sider-border-color` /
`--sn-pro-classic-header-bg` / `--sn-pro-classic-body-bg`.

## AI contract

The machine-readable contract lives at `src/pro-classic/ai-description.md` (the `classic` shell's
Patch Boundary: menus / breadcrumb / `pageTitle` / brand trio / user card / search & notice
switches are patchable; navigation, read state, logout, re-theming and auth never are).
