# Button (Web)

`SnButton` is the most common interactive component in `@snui/vue-web` (PC desktop). All visual properties are driven by the `--sn-web-*` Token alias layer.

## Basic usage

<Demo name="button-web-basic" description="6 semantic types: default / primary / info / success / warning / error." />

## Sizes

5 tiers `tiny` / `small` / `medium` / `large` / `huge`, mapped to `--sn-web-button-height-{size}`.

<Demo name="button-web-size" description="5 height tiers, covering everything from compact lists to hero CTAs." />

## Block & round

<Demo name="button-web-shape" description="block spans the parent width; round applies pill-shaped corners." />

## States

<Demo name="button-web-state" description="disabled fully disables; loading shows spinner and is unclickable; can manually toggle loading state." />

While `loading`, the button is unclickable and shows a spinner. Override via the `loading` slot.

## Variant: text / ghost / dashed

<Demo name="button-web-variant" description="text — text-only button; ghost — transparent bg + colored border; dashed — dashed border." />

## Circle / Strong / Secondary / Tertiary / Quaternary

<Demo name="button-web-emphasis" description="circle — round icon-only; strong — primary shadow; secondary / tertiary / quaternary — text variant emphasis gradient." />

## Custom color

<Demo name="button-web-color" description="color prop sets custom CSS color → `--sn-button-color` token override." />

## Tag-based rendering (`<a>` / `<div>` / `<span>`)

<Demo name="button-web-tag" description="tag='a' renders as link; tag='div' as container; default tag='button'." />

## iconPlacement + showIcon

<Demo name="button-web-icon-placement" description="iconPlacement 'right' puts icon on the right; showIcon false hides icon entirely (loading still renders spinner)." />

## attrType + focusable

<Demo name="button-web-attr-type" description="attrType for form submit / reset; focusable false removes tab focus." />

## API

### Props

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `type` | `'default' \| 'primary' \| 'info' \| 'success' \| 'warning' \| 'error' \| 'tertiary'` | `'default'` | Semantic type (naive-ui n-button). |
| `size` | `'tiny' \| 'small' \| 'medium' \| 'large' \| 'huge'` | `'medium'` | Button size. |
| `block` | `boolean` | `false` | Block (full width). |
| `round` | `boolean` | `false` | Pill shape (`border-radius: 999px`). |
| `circle` | `boolean` | `false` | Circle (square padding). |
| `text` | `boolean` | `false` | Text button — transparent bg, no border. |
| `ghost` | `boolean` | `false` | Transparent bg + colored border. |
| `dashed` | `boolean` | `false` | Dashed border. |
| `secondary` | `boolean` | `false` | Reverse hover (visual variant). |
| `tertiary` | `boolean` | `false` | Soft-bg variant of `primary`. |
| `quaternary` | `boolean` | `false` | Text variant of tertiary. |
| `strong` | `boolean` | `false` | Heavier shadow (filled buttons). |
| `color` | `string` | — | Custom CSS color; `--sn-button-color` token overrides type color. |
| `tag` | `'button' \| 'a' \| 'div' \| 'span'` | `'button'` | Root element. `a` disables `disabled` (HTMLAnchorElement doesn't support it). |
| `attrType` | `'button' \| 'submit' \| 'reset'` | `'button'` | Native `<button>` `type` (naive-ui `attr-type`). |
| `htmlType` *(deprecated)* | `'button' \| 'submit' \| 'reset'` | — | Legacy alias of `attrType`. |
| `disabled` | `boolean` | `false` | Disabled. |
| `loading` | `boolean` | `false` | Loading (spinner + click suppression). |
| `focusable` | `boolean` | `true` | Whether the button can be tab-focused. |
| `icon` | `IconComponent` | — | Pass lucide component directly. |
| `iconName` | `string` | — | Resolved via `registerSnIcons`. |
| `iconPlacement` | `'left' \| 'right'` | `'left'` | Icon placement (naive-ui `icon-placement`). |
| `iconSize` | `number \| string` | `14` | Icon px / CSS length. |
| `showIcon` | `boolean` | `true` | Whether to show the icon. `false` hides (loading still renders spinner). |
| `bordered` *(deprecated)* | `boolean` | `true` | Legacy border flag. naive-ui doesn't have this; kept for back-compat only. |
| `ariaLabel` | `string` | — | A11y label. |

### Events

| Name | Payload | Description |
| --- | --- | --- |
| `click` | `(event: MouseEvent)` | Click; not emitted when `disabled` or `loading` |

### Slots

| Name | Description |
| --- | --- |
| `default` | Button content |
| `icon` | Custom icon (overrides default icon rendering) |
| `loading` | Custom loading icon (replaces spinner) |

## Token customization (Web alias layer)

Web component CSS uses only `--sn-web-*`. Override:

```css
:root {
  --sn-web-color-action-primary: #1677ff;       /* primary background */
  --sn-web-color-feedback-danger: #ef4444;      /* error background */
  --sn-web-button-radius: 8px;                  /* radius */
  --sn-web-button-height-medium: 36px;          /* medium height */
}
```

> **Forbidden**: Web component CSS must not reference `--sn-mp-*` or `--aui-*` directly. To override: re-declare `--sn-web-*` aliases in `:root`.

## Accessibility

- Native `<button>` (unless `tag='a'`), `role="button"`
- `disabled` → `aria-disabled="true"`
- `loading` → `aria-busy="true"`
- Supports `aria-label` override
- Keyboard Enter / Space trigger click natively
- `focusable={false}` → `tabindex=-1`

## Related

- uni: [`sn-button`](/en/components/uni/button) — includes MP-only open-type / hover-class / cell concepts