# Button (uni / Mobile)

`sn-button` is the core interactive component in `@snui/uni` (mobile / miniprogram / H5). easycom auto-register, rpx for cross-device scaling.

## Auto-register (easycom)

Conforms to easycom — **no import needed in templates**:

```vue
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

<Demo name="button-mp-variant" description="6 variant tiers: base (filled), plain (transparent + colored border), dashed (dashed border), soft (soft bg + colored text), subtle (very light bg), text (text-only)." />

## Cell: hover / fill / menu

<Demo name="button-mp-cell" description="Cell list: hover (active bg), fill (always gray bg), menu (transparent + no radius)." />

## Custom background / color / loading color

<Demo name="button-mp-custom" description="bgColor / color overrides; loadingColor changes spinner color; loadingSize changes rpx size." />

## Iconfont icons (`icon` / `class-prefix` / `css-icon`)

`icon` takes the wot-ui iconfont path: the component forwards `icon` to the embedded sn-icon, which renders `<view class="{classPrefix}-{icon}">`; the glyph comes from the iconfont stylesheet the host app loads. `class-prefix` defaults to `sn-icon`; a string `css-icon` is used as the class prefix itself, and the boolean form plus `icon` applies both class names. Mutually exclusive with the SVG path (`iconData` / `iconName`), which wins.

<Demo name="button-mp-iconfont" description="icon + class-prefix build {prefix}-{icon}; a string css-icon renders verbatim; the boolean form applies both class names." />

## loading config and hairline (`loading-props` / `hairline`)

`loading-props` is the wot-ui `wd-button` object shape (`{ color, size, text }`). This component reads `color` / `size` and ignores the rest, so a config written for wd-button passes through. The flat `loading-color` / `loading-size` props win; `loading-props` is the fallback.

`hairline` only applies to `type="default"` (the semantic types already carry a coloured border). It defaults to `true`; `false` makes the border transparent.

<Demo name="button-mp-loading-props" description="loading-props color / size; the flat props win; hairline next to the loading state." />

## Open-type (MP-only)

<Demo name="button-mp-open-type" description="open-type: share / feedback / launchApp / contact / getUserInfo / openSetting / favorite / chooseAvatar." />

## Extension attributes (`session-from` / `send-message-*` / `app-parameter` / `scope` …)

Beyond `open-type`, WeChat / Alipay expect a companion set of attributes. The component forwards them to the root node as-is: the H5 preview has no such capability, so they land on the node without triggering anything; a miniprogram runtime reads the same attribute and calls the platform API.

| Attribute | Belongs to |
| --- | --- |
| `session-from` / `send-message-title` / `send-message-path` / `send-message-img` / `show-message-card` | `open-type="contact"` customer-service card |
| `app-parameter` | payload carried by `open-type="launchApp"` |
| `lang` | customer-service language: `zh_CN` / `zh_TW` / `en` |
| `button-id` | unique id for anchoring customer-service messages |
| `scope` | Alipay authorization scope (`phoneNumber` / `userInfo`) |
| `hover-stop-propagation` | generic: the press state does not bubble to ancestors |

<Demo name="button-mp-mp-open-type" description="open-type extension attributes: contact session config, three lang values, app-parameter, scope, hover-stop-propagation." />

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
| `variant` | `'base' \| 'plain' \| 'dashed' \| 'soft' \| 'subtle' \| 'text'` | `'base'` | Visual variant: filled, outlined, dashed, soft fill, very light bg, text-only. |
| `cell` | `'hover' \| 'fill' \| 'menu'` | — | Cell list style. |
| `loadingColor` | `string` | `''` | Custom spinner color. |
| `loadingSize` | `number \| string` | `32` | Spinner rpx / px size. |
| `hoverClass` | `string` | `'sn-button--feedback'` | Touch-feedback class. |
| `hoverStartTime` | `number` | `0` | How long to hold before triggering hoverClass. |
| `hoverStayTime` | `number` | `70` | How long after release before removing hoverClass. |
| `openType` | `'share' \| 'feedback' \| 'launchApp' \| 'contact' \| 'getUserInfo' \| 'openSetting' \| 'lifestyle' \| 'livePlayer' \| 'favorite' \| 'chooseAvatar' \| 'weRunGroup'` | — | WeChat MP open-type passthrough. |
| `formType` | `'submit' \| 'reset'` | — | Form submission type. |
| `bgColor` | `string` | `''` | Inline `background-color` override. |
| `color` | `string` | `''` | Inline `color` + `border-color` override. |
| `customClass` | `string` | `''` | Root extra class. |
| `customStyle` | `string \| Record<string,string>` | `''` | Root inline style. |
| `iconData` | `IconData` | — | Frozen `{ viewBox, paths }`. |
| `iconName` | `string` | — | Resolve via `registerSnIcons`. |
| `iconSize` | `number \| string` | `32` | rpx / px size. |
| `icon` | `string` | `''` | Iconfont glyph name, built into `{classPrefix}-{icon}`. |
| `classPrefix` | `string` | `'sn-icon'` | Iconfont class prefix. |
| `cssIcon` | `boolean \| string` | `false` | A string becomes the class prefix; the boolean form plus `icon` applies both class names. |
| `loadingProps` | `{ color?, size?, text?, … }` | — | wot-ui `loading-props` object; the flat `loadingColor` / `loadingSize` win. |
| `hoverStopPropagation` | `boolean` | `false` | The press state does not bubble to ancestors. |
| `lang` | `'zh_CN' \| 'zh_TW' \| 'en' \| ''` | `''` | `open-type=contact` session language. |
| `sessionFrom` | `string` | `''` | `open-type=contact` session source. |
| `sendMessageTitle` | `string` | `''` | `open-type=contact` message card title. |
| `sendMessagePath` | `string` | `''` | `open-type=contact` message card path. |
| `sendMessageImg` | `string` | `''` | `open-type=contact` message card image. |
| `appParameter` | `string` | `''` | `open-type=launchApp` payload. |
| `showMessageCard` | `boolean` | `false` | `open-type=contact` — show the session card. |
| `buttonId` | `string` | `''` | Unique id for anchoring customer-service messages. |
| `scope` | `'phoneNumber' \| 'userInfo' \| ''` | `''` | Alipay authorization scope. |
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