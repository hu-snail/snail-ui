# Link · Web

A themed text link: semantic status colors, hover underline, disabled state,
an optional leading icon, and a custom render tag.

## When to use

- Inline navigation links inside body text.
- Lightweight action entries distinguished by semantic colors
  (primary / info / success / warning / error).
- Disabled states, or link-like interaction on non-`<a>` elements.

## Demos

### Basic usage

The six semantic colors together with underline, disabled state and the icon
slot.

<Demo name="link-web-basic" description="Type colors / underline / disabled / custom tag / icon slot." />

### Semantic colors compared

`type` drives the text color and the hover feedback: primary / error darken
through their dedicated hover tokens, while info / success / warning use an
opacity step.

<Demo name="link-web-type" description="default / primary / info / success / warning / error side by side." />

### Underline, disabled and custom tag

`underline` controls whether the underline is permanent; `disabled` blocks
clicks and navigation; a non-anchor `tag` keeps click semantics only.

<Demo name="link-web-state" description="underline on/off + disabled + tag=&quot;span&quot; rendering." />

## API

### Props

All props are optional.

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| href | `string` | `undefined` | Navigation target; rendered only on `tag='a'` |
| target | `string` | `undefined` | Browsing context (`_blank`, …) |
| rel | `string` | `undefined` | Relationship metadata |
| type | `'default' \| 'primary' \| 'info' \| 'success' \| 'warning' \| 'error'` | `'default'` | Semantic color driving text and hover feedback |
| disabled | `boolean` | `false` | Blocks clicks + navigation, drops `href`, sets `aria-disabled="true"` |
| underline | `boolean` | `false` | `true` underlines permanently; `false` on hover only |
| tag | `string` | `'a'` | Root element to render |

### Events

| Name | Payload | Description |
| --- | --- | --- |
| click | `(event: MouseEvent)` | Fired on activation; suppressed (and not emitted) while `disabled` |

### Slots

| Name | Scope | Description |
| --- | --- | --- |
| default | — | Link text |
| icon | — | Leading icon |

## Tokens

| Token | Purpose |
| --- | --- |
| `--sn-web-color-text-primary` | Default type color |
| `--sn-web-color-action-primary / -hover` | Primary color and hover |
| `--sn-web-color-feedback-info / -success / -warning` | Matching type colors |
| `--sn-web-color-feedback-danger / -hover` | Error color and hover |

## Accessibility

- Disabled sets `aria-disabled="true"`, drops `href`, and suppresses
  `click`, so navigation and keyboard activation are blocked.
- Non-anchor tags keep click semantics but lose link semantics — add an
  explicit role upstream when it acts as a link.
- info / success / warning hover via an opacity step (no dedicated hover
  tokens); primary / error use their hover tokens.

## AI Patch Boundary

- Patches may change `href` / `type` / `underline` / `disabled`.
- `click` is an interaction event; navigation logic lives in the business
  layer — patches must not fake navigation.
- Changing `tag` only affects the rendered element; patches must not attach
  critical interactions to decorative text.

See the component `ai-description.md` for the full contract.
