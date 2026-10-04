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

<Demo name="button-mp-basic" description="6 semantic types: primary / success / warning / danger / info / default." />

## Sizes

3 tiers `small` / `medium` / `large` (no `tiny` / `huge` on mobile). Maps to `--sn-mp-button-height-{small,medium,large}` (auto-converted to rpx based on 750 design width).

<Demo name="button-mp-size" description="Three height tiers, mobile usually only needs these three." />

## Block & round

Block button (full parent width) is common on mobile:

<Demo name="button-mp-shape" description="block spans the parent width; round applies pill-shaped corners." />

## States

<Demo name="button-mp-state" description="disabled fully disables; loading shows spinner and is unclickable; can manually toggle loading state." />

## Variant: base / plain / dashed / soft / subtle / text

<Demo name="button-mp-variant" description="wot-ui variant 6 tiers: base (filled), plain (transparent + colored border), dashed (dashed border), soft (soft bg + colored text), subtle (very light bg), text (text-only)." />

## Cell: hover / fill / menu

<Demo name="button-mp-cell" description="Cell list: hover (active bg), fill (always gray bg), menu (transparent + no radius)." />

## Custom background / color / loading color

<Demo name="button-mp-custom" description="bgColor / color overrides; loadingColor changes spinner color; loadingSize changes rpx size." />

## Open-type (MP-only)

<Demo name="button-mp-open-type" description="open-type: share / feedback / launchApp / contact / getUserInfo / openSetting / favorite / chooseAvatar." />

## hover-class / hover-start-time / hover-stay-time

<Demo name="button-mp-hover" description="Custom press-feedback class; hover-start-time how long before triggering; hover-stay-time how long after release before removing." />

## formType (MP-only)

<Demo name="button-mp-form-type" description="form-type='submit' submits form; form-type='reset' resets form." />

> **Key difference**: uni side requires explicit `import '@snui/tokens-mp/styles'` (Web uses `import '@snui/tokens-web/styles'`).

## API

### Props

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `type` | `'primary' \| 'default' \| 'success' \| 'warning' \| 'danger' \| 'info'` | `'default'` | Semantic type. |
| `size` | `'small' \| 'medium' \| 'large'` | `'medium'` | Button size. |
| `block` | `boolean` | `false` | Block. |
| `round` | `boolean` | `false` | Pill shape. |
| `disabled` | `boolean` | `false` | Disabled. |
| `loading` | `boolean` | `false` | Loading (spinner + click suppression). |
| `hairline` | `boolean` | `true` | Hairline border on `default` type. |
| `feedback` | `boolean` | `true` | Active feedback (opacity). |
| `plain` | `boolean` | `false` | Low-emphasis style (v1: equals `variant='plain'`). |
| `variant` | `'base' \| 'plain' \| 'dashed' \| 'soft' \| 'subtle' \| 'text'` | `'base'` | wot-ui `wd-button variant`. |
| `cell` | `'hover' \| 'fill' \| 'menu'` | — | Cell list style (wot-ui `wd-button cell`). |
| `loadingColor` | `string` | `''` | Custom spinner color. |
| `loadingSize` | `number \| string` | `32` | Spinner rpx / px size. |
| `hoverClass` | `string` | `'sn-button--feedback'` | Touch-feedback class. |
| `hoverStartTime` | `number` | `0` | How long to hold before triggering hoverClass. |
| `hoverStayTime` | `number` | `70` | How long after release before removing hoverClass. |
| `openType` | `'share' \| 'feedback' \| 'launchApp' \| 'contact' \| 'getUserInfo' \| 'openSetting' \| 'lifestyle' \| 'livePlayer' \| 'favorite' \| 'chooseAvatar' \| 'weRunGroup'` | — | WeChat MP open-type passthrough. |
| `formType` | `'submit' \| 'reset'` | — | Form submission type (wot-ui `wd-button form-type`). |
| `bgColor` | `string` | `''` | Inline `background-color` override. |
| `color` | `string` | `''` | Inline `color` + `border-color` override. |
| `customClass` | `string` | `''` | Root extra class. |
| `customStyle` | `string \| Record<string,string>` | `''` | Root inline style. |
| `iconData` | `IconData` | — | Frozen `{ viewBox, paths }`. |
| `iconName` | `string` | — | Resolve via `registerSnIcons`. |
| `iconSize` | `number \| string` | `32` | rpx / px size. |
| `ariaLabel` | `string` | — | A11y label. |

### Events

| Name | Payload | Description |
| --- | --- | --- |
| `click` | `(event: Event)` | Tap (mobile uses `tap`). |

### Slots

| Name | Description |
| --- | --- |
| `default` | Button content. |
| `icon` | Custom icon. |
| `loading` | Custom loading icon. |

## Cross-platform behavior

| Platform | Behavior |
| --- | --- |
| H5 | Renders as `<button>`, touch triggers click |
| WeChat miniprogram | Compiles to native view, auto-registers tap; supports `open-type` |
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

- Web: [`SnButton`](/en/components/web/button) — includes text/ghost/dashed/circle/strong/secondary/tertiary/quaternary variants.