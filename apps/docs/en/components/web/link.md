# Link · Web

A themed text link: semantic status colors, hover underline, disabled
state, an optional leading icon, and a custom render tag.

## When to use

- Inline navigation links inside body text.
- Lightweight action entries distinguished by semantic colors
  (primary / info / success / warning / error).
- Disabled states, or link-like interaction on non-`<a>` elements.

## Basic

Six semantic `type` colors; `underline` makes the underline permanent
(default: hover only); `disabled` dims the link and blocks clicks.

<Demo name="link-web-basic" description="Type colors / underline / disabled / custom tag / icon slot." />

## API

### SnLink Props

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| href | `string` | — | Navigation target (rendered only on `tag='a'`) |
| target | `string` | — | Browsing context (`_blank`, …) |
| rel | `string` | — | Relationship metadata |
| type | `'default' \| 'primary' \| 'info' \| 'success' \| 'warning' \| 'error'` | `'default'` | Semantic color |
| disabled | `boolean` | `false` | Blocks clicks + navigation, `aria-disabled="true"` |
| underline | `boolean` | `false` | `true` underlines permanently; `false` on hover only |
| tag | `string` | `'a'` | Root element to render |

### SnLink Events

| Event | Payload | Notes |
| --- | --- | --- |
| click | `(event: MouseEvent)` | Fired on activation; suppressed while `disabled` |

### SnLink Slots

| Slot | Notes |
| --- | --- |
| default | Link text |
| icon | Leading icon |

## Tokens

| Token | Purpose |
| --- | --- |
| `--sn-web-color-text-primary` | Default type color |
| `--sn-web-color-action-primary / -hover` | Primary color + hover |
| `--sn-web-color-feedback-info / -success / -warning` | Matching type colors |
| `--sn-web-color-feedback-danger / -hover` | Error color + hover |

## Accessibility

- Disabled sets `aria-disabled="true"`, suppresses `click`, and drops
  `href` so navigation and keyboard activation are blocked.
- Non-anchor tags keep click semantics but lose link semantics — add an
  explicit role upstream when it acts as a link.
- info / success / warning hover via an opacity step (no dedicated hover
  tokens); primary / error use their hover tokens.

## AI Patch Boundary

- Patches may change `href` / `type` / `underline` / `disabled`.
- `click` is an interaction event; navigation logic lives in the
  business layer — patches must not fake navigation.
- Changing `tag` only affects the rendered element; patches must not
  attach critical interactions to decorative text.

See the component `ai-description.md` for the full contract.
