# sn-card — AI-Friendly Component Description

> Human-readable + AI-parseable description of the uni-end sn-card component.
> Consumed by `@snui/cli` and `@snui/ai` (MCP) for end-aware listing.
> **`end: mp`** marker — consumed by `list_components({ end: 'mp' })`.

## Purpose

Card container for mobile / miniprogram. Three regions: title (optional),
content (default slot), footer (optional). Rectangle variant adds a
heavier shadow for list-item style cards. Mobile-specific mirror of the
Web SnCard.

## Reference Library

Per AGENTS.md §112, this component's API surface mirrors wot-ui `wd-card`
(https://wot-ui.cn/component/card.html). New props added here MUST also
be added to the wd-card parity list.

## Import

```vue
<!-- easycom auto-register; no import needed -->
<sn-card title="标题">默认内容</sn-card>
```

```ts
// Optional explicit import (when easycom is disabled)
import { SnCard } from '@snui/uni'
```

## Props

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `title` | `string` | `''` | no | Card title. Rendered in title region; ignored when `title` slot is provided. |
| `type` | `string` | `''` | no | Card type. `'rectangle'` applies the rectangle (大格) visual. |
| `customTitleClass` | `string` | `''` | no | Custom class for the title region. |
| `customContentClass` | `string` | `''` | no | Custom class for the content region. |
| `customFooterClass` | `string` | `''` | no | Custom class for the footer region. |
| `customClass` | `string` | `''` | no | Custom class for the root node. |
| `customStyle` | `string` | `''` | no | Custom inline style for the root node. |

## Slots

| Name | Description |
|---|---|
| `default` | Card content (rendered between title and footer). |
| `title` | Custom title region. Overrides the `title` prop. |
| `footer` | Bottom action area. Omitted when no slot content. |

## Tokens Consumed (end: mp)

| Token | CSS Variable | Purpose |
|---|---|---|
| Card padding | `--sn-mp-card-padding` | Default inner padding |
| Card radius | `--sn-mp-card-radius` | Border radius |
| Border default | `--sn-mp-color-border-default` | Footer divider line |
| Text primary | `--sn-mp-color-text-primary` | Title + body text color |
| Background surface | `--sn-mp-color-background-surface` | Card background |

## Accessibility

- `role="region"` on root node
- Pure decoration: no keyboard interaction (mobile tap does not focus)
- Title region uses semantic `<view>` for screen reader traversal

## Versioning

`@snui/uni@0.3.0` — initial release. Part of AUI-MP-BIZ-001
(M1 业务 uni components).