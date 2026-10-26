# AvatarGroup · Web

Stacks avatars in a row and collapses the overflow into a `+k` summary
avatar.

## When to use

- Compact member lists, collaborators, group chats.
- The avatar count is unknown and needs an overflow cap.
- Clicking the `+N` summary reveals the full member list.

## Demos

### Basic group

The default layout overlaps avatars (tightening); it can also be switched to
a shrinking size gradient.

<Demo name="avatar-group-web-basic" description="Tightening overlap / shrink scaling / maxOptions overflow + onExpand." />

### Overflow cap and expand callback

With `maxOptions` set to `{ max, onExpand }` only the first `max − 1` avatars
are rendered plus a `+k` summary (k = total − max + 1); clicking the summary
calls `onExpand`. Passing a plain number keeps the summary static and emits
nothing.

<Demo name="avatar-group-web-max" description="max / onExpand revealing everyone + a plain number cap for comparison." />

### Shrink behavior vs tightening

`sizeBehavior` controls the stack: `tightening` overlaps with a negative
margin at full size, `shrink` scales each following avatar down (0.06 per
step, down to 0.7). `size` only styles the `+k` summary avatar.

<Demo name="avatar-group-web-shrink" description="tightening vs shrink + summary avatar size." />

## API

### Props

All props are optional.

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| maxOptions | `{ max: number; onExpand?: () => void } \| number` | `undefined` | Overflow control: with `max: n` the group shows `n − 1` avatars + a `+k` summary (k = total − n + 1); clicking calls `onExpand`, the number form has no click hook |
| size | `number \| 'small' \| 'medium' \| 'large'` | `'medium'` | Summary avatar size; child avatars keep their own `SnAvatar` size |
| sizeBehavior | `'tightening' \| 'shrink'` | `'tightening'` | `tightening` overlaps with a negative margin; `shrink` scales each avatar down (0.06 per step, min 0.7) |

### Slots

| Name | Scope | Description |
| --- | --- | --- |
| default | — | Avatar list — render `SnAvatar` elements (fragments and nested arrays are flattened, comment nodes are dropped) |

No events (the expand callback arrives via `maxOptions.onExpand`). When the
slotted count exceeds the cap, the `+k` summary renders as
`<button type="button">` with an `aria-label`; without a callback it stays a
static element.

## Tokens

| Token | Purpose |
| --- | --- |
| `--sn-web-color-background-surface` | Avatar outline in the tightening stack |
| `--sn-web-color-background-subtle` | Summary avatar background |
| `--sn-web-color-text-secondary` | Summary avatar text |
| `--sn-web-focus-ring` | Keyboard focus on the expand button |

## Accessibility

- The expandable summary renders as `<button type="button">` with an
  `aria-label` describing how many avatars remain; without `onExpand` it
  stays a static element.
- Child avatars carry their own semantics from `SnAvatar`.

## AI Patch Boundary

- Patches may change `maxOptions` / `size` / `sizeBehavior`.
- The member list is business data; patches adjust display config only.
- The `+k` count is computed at runtime; patches must not write it.

See the component `ai-description.md` for the full contract.
