# Button (uni / Mobile)

`sn-button` is the core interactive component in `@snui/uni` (mobile / miniprogram / H5). easycom auto-register, rpx for cross-device scaling.

> **v3.1 End-Independent**: `sn-button` (`@snui/uni`) and `SnButton` (`@snui/vue-web`) are **two independent components**. uni CSS uses only `var(--sn-mp-*)` (rpx). **Zero source-code reuse**. Full comparison at [Web SnButton](/components/web/button).

---

## Auto-register (easycom)

Located at `packages/uni/src/components/sn-button/sn-button.vue`, conforming to easycom — **no import needed in templates**:

```vue
<template>
  <sn-button type="primary">Submit</sn-button>
</template>
```

easycom path: `^sn-(.*)` → `components/sn-$1/sn-$1.vue`.

Explicit import (optional):

```ts
import { SnButton } from '@snui/uni'
```

> easycom is uni-app's official on-demand registration. **Web has no easycom** — explicit import required (`import { SnButton } from '@snui/vue-web'`).

---

## Basic usage

<Demo name="button-mp" />

```vue
<template>
  <view class="container">
    <sn-button>Default</sn-button>
    <sn-button type="primary">Primary</sn-button>
    <sn-button type="success">Success</sn-button>
    <sn-button type="warning">Warning</sn-button>
    <sn-button type="danger">Danger</sn-button>
  </view>
</template>

<script setup lang="ts">
import '@snui/tokens-mp/styles'  // ← required: rpx alias layer
</script>
```

> **Key difference**: uni side requires explicit `import '@snui/tokens-mp/styles'` (Web uses `import '@snui/tokens-web/styles'`).

---

## Sizes

`small` / `medium` / `large` (no `tiny` — mobile does not need it).

```vue
<sn-button size="small">S</sn-button>
<sn-button size="medium">M</sn-button>
<sn-button size="large">L</sn-button>
```

Maps to `--sn-mp-button-height-{small,medium,large}` (auto-converted to rpx based on 750 design width).

---

## Block & round

Block button (full parent width) is common on mobile:

```vue
<sn-button block type="primary">Block</sn-button>
<sn-button round type="success">Round</sn-button>
```

---

## States

```vue
<sn-button disabled>Disabled</sn-button>
<sn-button loading>Loading</sn-button>
```

---

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

---

## Cross-platform behavior

| Platform | Behavior |
| --- | --- |
| H5 | Renders as `<button>`, touch triggers click |
| WeChat miniprogram | Compiles to native view, auto-registers tap |
| Alipay miniprogram | Same |
| App (uni-app x) | Native render, touch feedback |
| Douyin miniprogram | Same as WeChat |

Cross-platform consistency is guaranteed by uni-app, source unchanged.

---

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

---

## End difference

| Dimension | Web (`SnButton`) | uni (`sn-button`) |
|---|---|---|
| Package | `@snui/vue-web` | `@snui/uni` |
| Component name | `SnButton` (PascalCase import) | `sn-button` (kebab-case easycom) |
| Token alias | `--sn-web-*` (px) | `--sn-mp-*` (rpx) |
| Sizes | tiny / small / medium / large | small / medium / large (no tiny) |
| Event | `click` (MouseEvent) | `click` (tap event) |
| End-specific Props | `htmlType` (native button type) | `hairline` / `feedback` |
| Default loading icon | CSS spinner | CSS spinner / uni-ui spinner |
| Platform scope | Modern browsers | H5 / WeChat / Alipay / App / Douyin |

---

## Accessibility

- `role="button"`
- `disabled` → `aria-disabled="true"`
- `loading` → `aria-busy="true"`
- Mobile tap (no keyboard)
- Miniprogram semantic nodes (`button` wrapped by compiler)

---

## Related

- Source: `packages/uni/src/components/sn-button/sn-button.vue`
- AI description: `packages/uni/src/components/sn-button/ai-description.md` (`end: mp`)
- Token alias layer: `packages/tokens-mp/` (`--sn-mp-*` + rpx conversion)
- Web: [`SnButton`](/components/web/button)