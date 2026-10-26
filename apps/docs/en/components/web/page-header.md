# PageHeader · Web

A page-level header: a back control, title / subtitle, an extra action area
on the right, and optional body and footer regions.

## When to use

- Detail or secondary pages need a standard "back + title + actions"
  header.
- Body content below the header and a separated footer note.
- The whole header row needs replacing (e.g. by a breadcrumb) via the
  `header` slot.

## Demos

### Basic header

The back control renders as a circular icon button (`aria-label="Back"`)
that emits `back` when activated; `title` / `subtitle` / `extra` can also be
supplied through the same-named slots.

<Demo name="page-header-web-basic" description="Back + title / subtitle / extra actions / footer separator." />

### Composite header

`#extra` holds an arbitrary action group, `#footer` carries the bottom note,
and `@back` updates real state.

<Demo name="page-header-web-composite" description="subtitle + #extra buttons + #footer + a real back handler." />

## API

### Props

All props are optional.

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| title | `string` | `undefined` | Title text; the `title` slot wins |
| subtitle | `string` | `undefined` | Subtitle; the `subtitle` slot wins |
| extra | `string` | `undefined` | Right-side extra text; the `extra` slot wins |

### Events

| Name | Payload | Description |
| --- | --- | --- |
| back | `(event: MouseEvent)` | Fired when the back control is activated |

### Slots

| Name | Scope | Description |
| --- | --- | --- |
| header | — | Replaces the whole header row |
| back | — | Replaces the back control entirely |
| icon | — | Replaces the back glyph (default: inline chevron-left SVG) |
| title | — | Title content, used only when `title` is not passed |
| subtitle | — | Subtitle content, used only when `subtitle` is not passed |
| extra | — | Right-side action content, used only when `extra` is not passed |
| footer | — | Bottom area (top-border separator) |
| default | — | Body content between header and footer |

## Tokens

| Token | Purpose |
| --- | --- |
| `--sn-web-color-text-primary` | Title color |
| `--sn-web-color-text-secondary` | Back glyph / extra / footer color |
| `--sn-web-color-text-tertiary` | Subtitle color |
| `--sn-web-color-action-primary` | Back control hover color |
| `--sn-web-color-background-subtle` | Back button hover background |
| `--sn-web-color-border-subtle` | Footer separator |
| `--sn-web-focus-ring` | Back button focus outline |

## Accessibility

- Back control: `<button type="button" aria-label="Back">` — keyboard
  reachable with a visible focus ring.
- The title is a plain `div`; wrap it in a semantic heading upstream when it
  is the page's main heading.
- The back glyph is decorative (`aria-hidden="true"`).

## AI Patch Boundary

- Patches may change `title` / `subtitle` / `extra`.
- `back` is an interaction event; patches must not fake clicks — the
  navigation logic lives in the business layer.
- The back control can be replaced wholesale via the `back` slot (e.g. a
  breadcrumb); patches must not rewrite the button internals.

See the component `ai-description.md` for the full contract.
