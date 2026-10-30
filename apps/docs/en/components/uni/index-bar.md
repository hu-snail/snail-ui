# IndexBar · uni-app

`sn-index-bar` is the alphabetical index list of `@snui/uni` (mobile / miniprogram / H5); `sn-index-anchor` is one lettered group. Auto-registered via easycom; geometry uses `rpx` so it scales with the device.

## Basic usage

Each `sn-index-anchor`'s `index` becomes both the sidebar entry and that group's heading; tapping an entry jumps to the group:

<Demo name="index-bar-mp-basic" description="The anchor index generates the sidebar entry; tapping it jumps to the group; sticky pins the bar." />

## Custom content and the change event

Group content is fully custom, and `change` reports the active index:

<Demo name="index-bar-mp-custom" description="Group content is custom; change reports the active index; without sticky the bar scrolls with the list." />

## The scrollTo method and custom styling

`scrollTo(index)` on a template ref jumps to a group from code (and emits `change`); `custom-class` / `custom-style` land on the root:

<Demo name="index-bar-mp-scrollto" description="scrollTo(index) jumps to a group from code; custom-class / custom-style on the root." />

## Full-page contacts directory

A complete contacts screen: a search bar filters by keyword (empty groups are dropped so the index bar follows along), every row uses an `sn-avatar` text avatar (the colour maps stably from a name hash onto a token palette); `show-indicator` echoes the active letter in the middle of the list and `anchor-id` gives each group a stable DOM id for deep links:

<Demo name="index-bar-mp-contacts" description="Full-page contacts: built-in Search icon + keyword filter; sn-avatar text avatars; show-indicator centre bubble; stable anchor-group ids." />

> **Contract slot**: `sticky` currently only toggles the `sn-index-bar--sticky` class on the root and ships no matching CSS rule, so it has no visible effect. The prop stays for contract parity.

## Auto registration (easycom)

The component follows the easycom convention, so **no import is needed in a template**:

```vue
<sn-index-bar sticky>
  <sn-index-anchor index="A">…</sn-index-anchor>
</sn-index-bar>
```

For an explicit import:

```ts
import { SnIndexBar } from '@snui/uni/components/sn-index-bar/sn-index-bar.vue';
import { SnIndexAnchor } from '@snui/uni/components/sn-index-bar/sn-index-anchor.vue';
```

## Props

### sn-index-bar

| Prop            | Type      | Default | Description                             |
| --------------- | --------- | ------- | --------------------------------------- |
| `sticky`        | `boolean` | `false` | Pin the index bar                       |
| `showIndicator` | `boolean` | `false` | Echo the active index in a centre bubble |
| `customClass`   | `string`  | `''`    | Extra class on the root node            |
| `customStyle`   | `string`  | `''`    | Inline style on the root node           |

### sn-index-anchor

| Prop          | Type               | Default | Description                              |
| ------------- | ------------------ | ------- | ---------------------------------------- |
| `index`       | `string \| number` | `''`    | Index character(s)                       |
| `anchorId`    | `string`           | `''`    | Custom anchor DOM id (auto value when empty) |
| `customClass` | `string`           | `''`    | Extra class on the anchor root           |
| `customStyle` | `string`           | `''`    | Inline style on the anchor root          |

## Events

| Event    | Description          | Payload       |
| -------- | -------------------- | ------------- |
| `change` | Active index changed | `({ index })` |

## Slots

| Slot                  | Description                             |
| --------------------- | --------------------------------------- |
| `default` (index-bar) | Index list (`sn-index-anchor` children) |
| `default` (anchor)    | Entries under that index                |

## Theme variables

| Variable                                        | Purpose                                   |
| ----------------------------------------------- | ----------------------------------------- |
| `--sn-mp-color-background-surface`              | List and entry surface                    |
| `--sn-mp-color-background-soft`                 | Group heading surface                     |
| `--sn-mp-color-action-primary-soft`             | Active group heading surface              |
| `--sn-mp-color-text-secondary`                  | Sidebar entry and heading text            |
| `--sn-mp-color-action-primary`                  | Active entry fill and active heading text |
| `--sn-mp-color-text-on-primary`                 | Active entry label                        |
| `--sn-mp-font-size-xs` / `--sn-mp-font-size-sm` | Entry / heading size                      |
| `--sn-mp-font-weight-medium`                    | Heading weight                            |
| `--sn-mp-radius-full`                           | Entry pill radius                         |
| `--sn-mp-radius-lg`                             | Index tip bubble radius                   |
| `--sn-mp-font-size-xl` / `--sn-mp-font-weight-semibold` | Index tip bubble size and weight  |
| `--sn-mp-spacing-1` / `--sn-mp-spacing-3`       | Entry gap / heading padding               |

## AI Patch Boundary

- AI may patch display configs such as `sticky` / `showIndicator`, and each `sn-index-anchor`'s `index` / `anchorId`.
- The `change` event and `scrollTo()` are runtime behaviour; patches must not fake index changes or hard-code scroll targets.
- Group entry content (default slot) is business data; patches should only adjust container configs, never rewrite entry internals.

## Accessibility

- The sidebar is `role="tablist"` with `aria-orientation="vertical"`.
- Every entry is `role="tab"` with `aria-selected` tracking the active index and `aria-label` set to the index character.
- Group headings are plain text; the enclosing group carries the meaning.
- Mobile only: interaction is `tap`; miniprogram has no keyboard focus.

## Dark mode

Every colour in `sn-index-bar` comes from `--sn-mp-color-*` with no light `var()` fallback, so it adapts automatically under `.sn-theme-dark`: the list flips to the dark surface, headings use the dark soft fill, and the active entry keeps the brand pill.

Verify it by wrapping in sn-config-provider 的 theme 设为 dark:

## Related

- Side navigation: [`sn-sidebar`](/en/components/uni/sidebar)
- Sticky container: [`sn-sticky`](/en/components/uni/sticky)
- Back to top: [`sn-backtop`](/en/components/uni/backtop)
