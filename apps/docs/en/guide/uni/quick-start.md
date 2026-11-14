# Quick start (uni-app x)

Wire snui into a uni-app x project (App side, vapor mode) in 5 minutes.

Recommended path: consume the `.uvue` artifacts of `@snui/uni-x`, generated
deterministically from the single `@snui/uni` source (see
[uni-app x (Vapor Mode) support](/en/guide/uni/uni-app-x)). Classic
uni-app (H5 / mini-programs / App-vue) is the compatibility target; its setup
is kept in the second half of this page.

## uni-app x setup (vapor mode)

### 1. Install

```bash
pnpm add @snui/uni-x
```

The component artifacts (`.uvue` + theme layer) ship with the package — no
local generation, no directory copying.

### 2. Configure easycom

Add to `pages.json`:

```json
{
  "easycom": {
    "autoscan": true,
    "custom": {
      "^sn-(.*)": "@snui/uni-x/components/sn-$1/sn-$1.uvue"
    }
  }
}
```

### 3. Import the theme tokens

Import the class-only token layer in `App.uvue`'s `<style>` (App side has no
`:root`; variables mount on `.sn-theme-root`, which `sn-config-provider`
carries automatically):

```css
@import '@snui/uni-x/theme/index.css';
```

### 4. Enable vapor mode

Tick "vapor mode" in the HBuilderX (5.31+) `manifest.json` visual editor, or
confirm it in source view:

```json
{
  "uni-app-x": { "vapor": true }
}
```

### 5. Use the components

Use them directly in templates (no import needed):

```vue
<template>
  <view class="container">
    <sn-button type="primary" @click="onSubmit">Submit</sn-button>
  </view>
</template>

<script setup lang="ts">
const onSubmit = () => {
  uni.showToast({ title: 'Submitted' });
};
</script>
```

A full in-repo example project lives at `apps/uni-demo-x` (100 component
demo pages, reproducible via its `gen` / `check` scripts). Status and the
device verification checklist:
[uni-app x (Vapor Mode) support](/en/guide/uni/uni-app-x).

## Classic uni-app setup (compatibility target: H5 / mini-programs / App-vue)

### Install

```bash
pnpm add @snui/uni
```

### Configure easycom

`@snui/uni` follows the easycom convention (`components/sn-*/sn-*.vue`);
configure it in your project's `pages.json`:

```json
{
  "easycom": {
    "autoscan": true,
    "custom": {
      "^sn-(.*)": "@snui/uni/src/components/sn-$1/sn-$1.vue"
    }
  }
}
```

Or rely on default scanning (recommended; place the components under
`src/components/`):

```json
{
  "easycom": {
    "autoscan": true,
    "custom": {}
  }
}
```

### Import the styles

Top of `App.vue`'s `<style>`:

```css
@import '@snui/tokens/styles/index.css';
```

### Use the components

Use them directly in templates (no import needed):

```vue
<template>
  <view class="container">
    <sn-button type="primary" @click="onSubmit">Submit</sn-button>
  </view>
</template>

<script setup lang="ts">
const onSubmit = () => {
  uni.showToast({ title: 'Submitted' });
};
</script>
```

Explicit import, when needed:

```ts
import { SnButton } from '@snui/uni';
```

### Cross-platform builds

`@snui/uni` components support H5, WeChat / Alipay / Douyin mini-programs
and App. Run:

```bash
pnpm dev:h5           # H5
pnpm dev:mp-weixin    # WeChat mini-program
pnpm dev:mp-alipay    # Alipay mini-program
pnpm build:app        # App
```

### Dark mode

```html
<html data-theme="dark"></html>
```

CSS variables cascade automatically.

## Next

- Component docs: [`sn-button`](/en/components/uni/button)
- uni-app x (Vapor Mode) support: [`/en/guide/uni/uni-app-x`](/en/guide/uni/uni-app-x)
- Cross-platform notes: [`capabilities`](/en/guide/uni/cross-platform)
- Web setup: [`Web quick start`](/en/guide/web/quick-start)
