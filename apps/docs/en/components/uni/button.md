# Button (uni / Mobile)

`sn-button` is the core interactive component in `@snui/uni` (mobile / miniprogram / H5). easycom auto-register, rpx for cross-device scaling.

## Auto-register (easycom)

Conforms to easycom — **no import needed in templates**:

```html
<sn-button type="primary">Submit</sn-button>
```

easycom path: `^sn-(.*)` → `components/sn-$1/sn-$1.vue`.

Explicit import (optional):

```ts
import { SnButton } from '@snui/uni'
```

> easycom is uni-app's official on-demand registration. **Web has no easycom** — explicit import required (`import { SnButton } from '@snui/vue-web'`).

## Basic usage

<Demo name="button-mp-basic" description="Five semantic types (no info — mobile doesn't need cool-tone weak alerts)." />

## Sizes

`small` / `medium` / `large` (no `tiny` — mobile does not need it). Maps to `--sn-mp-button-height-{small,medium,large}` (auto-converted to rpx based on 750 design width).

<Demo name="button-mp-size" description="Three height tiers, mobile usually only needs these three." />

## Block & round

Block button (full parent width) is common on mobile:

<Demo name="button-mp-shape" description="block spans the parent width; round applies pill-shaped corners." />

## States

<Demo name="button-mp-state" description="disabled fully disables; loading shows spinner and is unclickable; can manually toggle loading state." />

> **Key difference**: uni side requires explicit `import '@snui/tokens-mp/styles'` (Web uses `import '@snui/tokens-web/styles'`).

## API

### Props

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| type | `'primary' \| 'default' \| 'success' \| 'warning' \| 'danger'` | `'default'` | Button type |
| size | `'small' \| 'medium' \| 'large'` | `'medium'` | Button size |
| block | `boolean` | `false` | Block |
| round | `boolean` | `false` | Pill shape |
| disabled | `boolean` | `false` | Disabled |
| loading | `boolean` | `false` | Loading |
| hairline | `boolean` | `true` | Hairline border (default type) |
| feedback | `boolean` | `true` | Active feedback (opacity) |

### Events

| Name | Payload | Description |
| --- | --- | --- |
| click | `(event: Event)` | Tap event (mobile uses `tap`) |

### Slots

| Name | Description |
| --- | --- |
| default | Button content |
| icon | Custom icon |
| loading | Custom loading icon |

## Cross-platform behavior

| Platform | Behavior |
| --- | --- |
| H5 | Renders as `<button>`, touch triggers click |
| WeChat miniprogram | Compiles to native view, auto-registers tap |
| Alipay miniprogram | Same |
| App (uni-app x) | Native render, touch feedback |
| Douyin miniprogram | Same as WeChat |

Cross-platform consistency is guaranteed by uni-app, source unchanged.

## Token customization (uni alias layer + rpx)

uni component CSS uses only `--sn-mp-*` alias layer, **unit is rpx** (auto-converted based on 750 design width):

```css
.sn-button {
  background-color: var(--sn-mp-color-action-primary);
  border-radius: var(--sn-mp-button-radius);    /* auto rpx */
  height: var(--sn-mp-button-height-medium);   /* auto rpx */
}
```

Or override at page top:

```css
page {
  --sn-mp-color-action-primary: #ff5722;
  --sn-mp-button-radius: 12rpx;
  --sn-mp-button-height-medium: 72rpx;
}
```

> **Forbidden**: uni component CSS must not reference `--sn-web-*` or `--aui-*` directly. Override: via Style Pack or re-declare `--sn-mp-*` on `page`.

## Accessibility

- `role="button"`
- `disabled` → `aria-disabled="true"`
- `loading` → `aria-busy="true"`
- Mobile tap (no keyboard)
- Miniprogram semantic nodes (`button` wrapped by compiler)

## Related

- Web: [`SnButton`](/en/components/web/button)
