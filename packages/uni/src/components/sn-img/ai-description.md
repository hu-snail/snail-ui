# sn-img — AI-Friendly Component Description

> Human-readable + AI-parseable description of the uni-end sn-img component.
> Consumed by `@snui/cli` and `@snui/ai` (MCP) for end-aware listing.
> **`end: mp`** marker — consumed by `list_components({ end: 'mp' })`.

## Purpose

Image with built-in loading and error states, crop modes, circular / radius shapes, lazy loading and tap-to-preview.

## Reference Library

Per AGENTS.md §112, this component's API surface mirrors wot-ui `wd-img`
(https://wot-ui.cn/component/img.html). New props added here MUST also be added
to the wd-img parity list.

## Preview

`enablePreview` calls `uni.previewImage` through a guarded `globalThis` lookup.
Where the API is absent the tap only emits `click`.

## Import

```vue
<!-- easycom auto-register; no import needed -->
<sn-img src="/static/demo.png" mode="aspectFill" radius="12" />
```

```ts
import { SnImg } from '@snui/uni';
```

## Props

| Name                  | Type      | Default       | Required | Description                                             |
| --------------------- | --------- | ------------- | -------- | ------------------------------------------------------- |
| `src`                 | string    | ''            | no       | Image source.                                           |
| `previewSrc`          | string    | ''            | no       | Image opened by `enablePreview` (defaults to `src`).    |
| `width`               | string    | number        | ''       | no                                                      | Width (bare number = rpx).         |
| `height`              | string    | number        | ''       | no                                                      | Height (bare number = rpx).        |
| `mode`                | ImageMode | 'scaleToFill' | no       | Crop mode (uni `<image mode>` set).                     |
| `round`               | boolean   | false         | no       | Render as a circle.                                     |
| `radius`              | string    | number        | ''       | no                                                      | Corner radius (bare number = rpx). |
| `lazyLoad`            | boolean   | false         | no       | Lazy-load the image.                                    |
| `enablePreview`       | boolean   | false         | no       | Tap opens `uni.previewImage`.                           |
| `showMenuByLongpress` | boolean   | false         | no       | Long-press shows the miniprogram QR menu (WeChat only). |
| `showLoading`         | boolean   | true          | no       | Show the loading overlay.                               |
| `showError`           | boolean   | true          | no       | Show the error overlay.                                 |
| `customClass`         | string    | ''            | no       | Custom class for the root node.                         |
| `customStyle`         | string    | ''            | no       | Custom inline style for the root node.                  |
| `customImage`         | string    | ''            | no       | Custom class for the inner `<image>`.                   |

## Events

| Event   | Payload | Description           |
| ------- | ------- | --------------------- |
| `click` | Event   | Image tapped.         |
| `load`  | Event   | Image loaded.         |
| `error` | Event   | Image failed to load. |

## Slots

| Slot      | Description           |
| --------- | --------------------- |
| `loading` | Custom loading state. |
| `error`   | Custom error state.   |

## Tokens Consumed (end: mp)

| Token              | CSS Variable                      | Purpose                |
| ------------------ | --------------------------------- | ---------------------- |
| Background subtle  | `--sn-mp-color-background-subtle` | Placeholder plate      |
| Border default     | `--sn-mp-color-border-default`    | Spinner track          |
| Action primary     | `--sn-mp-color-action-primary`    | Spinner head           |
| Text tertiary      | `--sn-mp-color-text-tertiary`     | Error text             |
| Font size SM       | `--sn-mp-font-size-sm`            | Error text size        |
| Line height normal | `--sn-mp-font-line-height-normal` | Error text line height |
| Radius full        | `--sn-mp-radius-full`             | `round` shape          |

## Accessibility

- The tap target is the root `<view>`; provide an accessible name on the surrounding link / button.
- The loading spinner is `aria-hidden="true"`.

## Dispose

No timer and no listener: the image element own load / error events drive the
states.

## Versioning

`@snui/uni@0.5.0` — initial release.
