# AvatarGroup · Web

Stacks avatars in a row and collapses the overflow into a `+k` summary
avatar.

## When to use

- Compact member lists, collaborators, group chats.
- The avatar count is unknown and needs an overflow cap.
- Clicking the `+N` summary reveals the full member list.

## Basic

Default layout overlaps avatars (tightening); with `maxOptions` the
overflow collapses into a `+k` summary whose click calls `onExpand`.

<Demo name="avatar-group-web-basic" description="Tightening overlap / shrink scaling / maxOptions + onExpand." />

## API

### SnAvatarGroup Props

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| maxOptions | `{ max: number; onExpand?: () => void } \| number` | — | With `max: n` the group shows `n − 1` avatars + a `+k` summary (`k = total − n + 1`); clicking calls `onExpand`; the number form has no click hook |
| size | `number \| 'small' \| 'medium' \| 'large'` | `'medium'` | Summary avatar size |
| sizeBehavior | `'tightening' \| 'shrink'` | `'tightening'` | `tightening` overlaps (−10px margin); `shrink` scales each following avatar down |

### SnAvatarGroup Slots

| Slot | Notes |
| --- | --- |
| default | Avatar list — render `SnAvatar` elements (fragments / nested arrays are flattened) |

No events (the expand callback arrives via `maxOptions.onExpand`).
Note: `size` only styles the summary avatar; child avatars keep their
own `SnAvatar` size.

## Tokens

| Token | Purpose |
| --- | --- |
| `--sn-web-color-background-surface` | Avatar outline in the tightening stack |
| `--sn-web-color-background-subtle` | Summary avatar background |
| `--sn-web-color-text-secondary` | Summary avatar text |
| `--sn-web-focus-ring` | Keyboard focus on the expand button |

## Accessibility

- The expandable summary renders as `<button type="button">` with
  `aria-label` ("还有 k 个头像"); without `onExpand` it stays a static
  span.
- Child avatars carry their own semantics from `SnAvatar`.

## AI Patch Boundary

- Patches may change `maxOptions` / `size` / `sizeBehavior`.
- The member list is business data; patches adjust display config only.
- The `+k` count is computed at runtime; patches must not write it.

See the component `ai-description.md` for the full contract.
