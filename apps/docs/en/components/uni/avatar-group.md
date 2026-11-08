# AvatarGroup (uni end / mobile)

`sn-avatar-group` stacks a list of `sn-avatar` elements into an overlapping group and collapses the overflow past `max-count` into a `+N` bubble. The API mirrors wot-ui `wd-avatar-group` 1:1.

## Basic usage

<Demo name="avatar-mp-group" description="Max-count collapse, custom collapse text (collapse-avatar), cascading direction, vertical stacking and uniform size / shape." />

```vue
<sn-avatar-group :max-count="3">
  <sn-avatar v-for="user in users" :key="user.id" :src="user.avatar" />
</sn-avatar-group>
```

## Max count and collapse text

`max-count` counts **slots**: past the limit the group shows `max-count − 1` avatars plus one collapse bubble (`max-count` visible slots in total). The bubble prints `collapse-avatar` verbatim, or the derived `+{hidden}` when it is empty.

- `max-count="3"` with 5 avatars → 2 avatars + `+3`
- `collapse-avatar="B+1"` → 2 avatars + `B+1`

`size` must resolve to a length (preset name / px number / `rpx` / `px` string). Percentages and other unmeasurable sizes disable `max-count` (everything visible, no bubble) — a documented, predictable fallback.

## Cascading

- `cascading="left-up"` (default): the stack grows to the left.
- `cascading="right-up"`: the stack grows to the right.

`vertical` stacks the members in a column (ignoring `cascading`); `max-count` still applies.

## Uniform size / shape

The group's `size` / `shape` **override** the same prop on every member `sn-avatar` (the reference's "uniformly set the group's avatars" contract). Members also receive the stack overlap and separating ring; a standalone `sn-avatar` is unaffected.

## Auto registration (easycom)

```vue
<sn-avatar-group :max-count="3" collapse-avatar="+2">
  <sn-avatar src="/static/a.png" />
  <sn-avatar src="/static/b.png" />
</sn-avatar-group>
```

Explicit import:

```ts
import { SnAvatarGroup } from '@snui/uni/components/sn-avatar-group/sn-avatar-group.vue';
```

## Props

| Prop             | Type                      | Default     | Description                                          |
| ---------------- | ------------------------- | ----------- | ---------------------------------------------------- |
| `maxCount`       | `number`                  | `undefined` | Max visible slots (the bubble occupies the last one) |
| `cascading`      | `'left-up' \| 'right-up'` | `'left-up'` | Stack direction (ignored in vertical mode)           |
| `collapseAvatar` | `string`                  | `''`        | Collapse bubble text; derived `+{hidden}` when empty |
| `vertical`       | `boolean`                 | `false`     | Stack vertically                                     |
| `shape`          | `'round' \| 'square'`     | `'round'`   | Uniform member shape (overrides members)             |
| `size`           | `string \| number`        | `'normal'`  | Uniform member size (overrides members)              |
| `customClass`    | `string`                  | `''`        | Extra class on the root node                         |
| `customStyle`    | `string`                  | `''`        | Inline style appended to the root node               |

## Slots

| Name      | Description                            |
| --------- | -------------------------------------- |
| `default` | The avatar list (`sn-avatar` elements) |

## Theme variables

| Variable                           | Purpose         |
| ---------------------------------- | --------------- |
| `--sn-mp-color-background-surface` | Separating ring |

The stack overlap / ring reach the members through inherited CSS variables (`--sn-avatar-group-overlap-left/-top`, `--sn-avatar-group-ring`); the members style themselves — no `:deep()` (unavailable on App).

## Accessibility

- The group is a layout container (no role); each member `sn-avatar` carries its own accessible name.
- The collapse bubble is a text avatar read as `+3` or the custom text.

## Dark mode

The ring colour comes from `--sn-mp-color-background-surface` with no light fallback: it follows the dark theme automatically. Verify by wrapping in `sn-config-provider` with `theme="dark"`.

## Related

- Web: [`SnAvatarGroup`](/components/web/avatar-group)
- Single avatar: [`sn-avatar`](/components/uni/avatar)
- Badge: [`sn-badge`](/components/uni/badge)
