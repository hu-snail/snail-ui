# Button (Web)

`SnButton` is the most common interactive component in `@snui/vue-web` (PC desktop). All visual properties are driven by the `--sn-web-*` Token alias layer.

## Basic usage

<Demo name="button-web-basic" description="Six semantic types: default / primary / success / warning / danger / info." />

## Sizes

`tiny` / `small` / `medium` / `large` correspond to `--sn-web-button-height-{tiny,small,medium,large}`.

<Demo name="button-web-size" description="Four height tiers, covering everything from compact lists to hero CTAs." />

## Block & round

<Demo name="button-web-shape" description="block spans the parent width; round applies pill-shaped corners." />

## States

<Demo name="button-web-state" description="disabled fully disables; loading shows spinner and is unclickable; can manually toggle loading state." />

While `loading`, the button is unclickable and shows a spinner. Override via the `loading` slot.

## API

### Props

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| type | `'primary' \| 'default' \| 'success' \| 'warning' \| 'danger' \| 'info'` | `'default'` | Button type |
| size | `'tiny' \| 'small' \| 'medium' \| 'large'` | `'medium'` | Button size |
| block | `boolean` | `false` | Block (full width) |
| round | `boolean` | `false` | Pill shape |
| disabled | `boolean` | `false` | Disabled |
| loading | `boolean` | `false` | Loading |
| htmlType | `'button' \| 'submit' \| 'reset'` | `'button'` | Native button type |
| bordered | `boolean` | `true` | Show border (for `default` type) |
| ariaLabel | `string` | — | A11y label |

### Events

| Name | Payload | Description |
| --- | --- | --- |
| click | `(event: MouseEvent)` | Click; not emitted when `disabled` or `loading` |

### Slots

| Name | Description |
| --- | --- |
| default | Button content |
| icon | Custom icon (replaces spinner) |
| loading | Custom loading icon (replaces spinner) |

### Types

```ts
type ButtonType = 'primary' | 'default' | 'success' | 'warning' | 'danger' | 'info'
type ButtonSize = 'tiny' | 'small' | 'medium' | 'large'
```

## Token customization (Web alias layer)

Web component CSS uses only `--sn-web-*`. Override:

```css
:root {
  --sn-web-color-action-primary: #1677ff;       /* primary background */
  --sn-web-color-feedback-danger: #ef4444;      /* danger background */
  --sn-web-button-radius: 8px;                  /* radius */
  --sn-web-button-height-medium: 36px;          /* medium height */
}
```

> **Forbidden**: Web component CSS must not reference `--sn-mp-*` or `--aui-*` directly. SnButton source CSS internally uses `--sn-web-*`. To override: re-declare `--sn-web-*` aliases in `:root` (aliases ultimately reference `--aui-*`).

## Accessibility

- Native `<button>`, `role="button"`
- `disabled` → `aria-disabled="true"`
- `loading` → `aria-busy="true"`
- Supports `aria-label` override
- Keyboard Enter / Space trigger click natively

## Related

- uni: [`sn-button`](/en/components/uni/button)
