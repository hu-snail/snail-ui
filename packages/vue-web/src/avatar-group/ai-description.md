# SnAvatarGroup — AI-Friendly Component Description

> Human-readable + AI-parseable description of the web-end avatar group component.
> Consumed by `@snui/cli` and `@snui/ai` (MCP) for end-aware listing.
> **`end: web`** marker — consumed by `list_components({ end: 'web' })`.

## Purpose

Stacks avatars in a row and collapses the overflow into a `+k` summary
avatar. Two layouts: overlapping (`tightening`) or progressively scaled
(`shrink`).

## Reference Library

Per AGENTS.md §112, this component's API surface mirrors naive-ui
`n-avatar-group` (https://www.naiveui.com/zh-CN/light/components/avatar).

## Import

```ts
import SnAvatarGroup from '@snui/vue-web/src/avatar-group/SnAvatarGroup.vue';
```

## Props

| Name           | Type                                               | Default        | Required | Description                                                                                                                                       |
| -------------- | -------------------------------------------------- | -------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| `maxOptions`   | `{ max: number; onExpand?: () => void } \| number` | `undefined`    | no       | Overflow control. With `max: n` the group shows `n − 1` avatars plus a `+k` summary (`k = total − n + 1`). Clicking the summary calls `onExpand`. |
| `size`         | `number \| 'small' \| 'medium' \| 'large'`         | `'medium'`     | no       | Size of the overflow summary avatar.                                                                                                              |
| `sizeBehavior` | `'tightening' \| 'shrink'`                         | `'tightening'` | no       | `tightening` overlaps avatars (−10px margin); `shrink` scales each following avatar down slightly.                                                |

## Events

None (the expand callback arrives through `maxOptions.onExpand`).

## Slots

| Name      | Description                                                                         |
| --------- | ----------------------------------------------------------------------------------- |
| `default` | Avatar list — render `SnAvatar` elements (fragments / nested arrays are flattened). |

## Divergences from the reference API

- `sizeBehavior` is implemented per the task spec; the reference
  documents only `maxOptions` + `size` on the group, so treat it as a
  local extension.
- `size` styles the overflow summary avatar; child avatars come from the
  slot and keep their own size (the reference injects the group size
  into child n-avatars, which would require modifying SnAvatar).
- Each avatar is wrapped in a `span.sn-avatar-group__item` for layout;
  target `.sn-avatar` inside it for custom styling.
- No config-provider / RTL integration (web-end v3 has no provider yet).

## Accessibility

- The expandable summary renders as a `<button type="button">` with
  `aria-label="还有 k 个头像"`; without `onExpand` it stays a static span.
- Avatars carry their own accessibility from `SnAvatar`; the group adds
  no wrapper role.

## Tokens Consumed (end: web)

| Token              | CSS Variable                        | Purpose                                |
| ------------------ | ----------------------------------- | -------------------------------------- |
| Background surface | `--sn-web-color-background-surface` | Avatar outline in the tightening stack |
| Background subtle  | `--sn-web-color-background-subtle`  | Summary avatar background              |
| Text secondary     | `--sn-web-color-text-secondary`     | Summary avatar text                    |
| Focus ring         | `--sn-web-focus-ring`               | Keyboard focus on the expand button    |

## Versioning

`@snui/vue-web@0.1.0` — initial release. Part of AUI-WEB-DD-026.
