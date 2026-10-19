# PageHeader · Web

A page-level header: back control on the left, title / subtitle in the
middle, extra actions on the right, optional body and footer areas.

## When to use

- Detail or secondary pages need a standard "back + title + actions"
  header.
- Body content below the header and a separated footer note.

## Basic

The default back control is a circular icon button
(`aria-label="Back"`); activating it emits `back`.

<Demo name="page-header-web-basic" description="Back + title / subtitle / extra actions / footer separator." />

## API

### SnPageHeader Props

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| title | `string` | — | Title text; the `title` slot wins |
| subtitle | `string` | — | Subtitle; the `subtitle` slot wins |
| extra | `string` | — | Right-side extra text; the `extra` slot wins |

### SnPageHeader Events

| Event | Payload | Notes |
| --- | --- | --- |
| back | `(event: MouseEvent)` | Fired when the back control is activated |

### SnPageHeader Slots

| Slot | Notes |
| --- | --- |
| header | Replaces the whole header row |
| back | Replaces the back control entirely |
| icon | Replaces the back glyph (default: inline chevron-left SVG) |
| title | Title content |
| subtitle | Subtitle content |
| extra | Right-side action content |
| footer | Bottom area (top-border separator) |
| default | Body content between header and footer |

## Tokens

| Token | Purpose |
| --- | --- |
| `--sn-web-color-text-primary` | Title color |
| `--sn-web-color-text-secondary` | Back glyph / extra / footer color |
| `--sn-web-color-text-tertiary` | Subtitle color |
| `--sn-web-color-background-subtle` | Back button hover background |
| `--sn-web-color-border-subtle` | Footer separator |
| `--sn-web-focus-ring` | Back button focus outline |

## Accessibility

- Back control: `<button type="button" aria-label="Back">` — keyboard
  reachable with a visible focus ring.
- The title is a plain `div`; wrap it in a semantic heading upstream
  when it is the page's main heading.
- The back glyph is decorative (`aria-hidden="true"`).

## AI Patch Boundary

- Patches may change `title` / `subtitle` / `extra`.
- `back` is an interaction event; patches must not fake clicks — the
  navigation logic lives in the business layer.
- The back control can be replaced wholesale via the `back` slot (e.g.
  a breadcrumb); patches must not rewrite the button internals.

See the component `ai-description.md` for the full contract.
