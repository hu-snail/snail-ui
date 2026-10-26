# Divider (uni / Mobile)

`sn-divider` is the visual separator component in `@snui/uni` (mobile / miniprogram / H5). easycom auto-register, rpx for cross-device scaling.

## Live preview

<Demo name="divider-mp" description="Comprehensive preview of all variants: horizontal / dashed / with text / marginSize / vertical." />

## Content position

`contentPosition` only applies to the horizontal axis with slot text: the line always spans the full width, the text is what moves, and the text background punches the visible gap:

<Demo name="divider-mp-content-position" description="All three content-position steps — left / center / right — and how they stack with dashed / marginSize." />

## Vertical dividers and custom styles

`vertical` is equivalent to `direction` set to `vertical`. A vertical divider defaults to `height: 1em`; override the height and colour with `custom-class` / `custom-style`:

<Demo name="divider-mp-vertical" description="Both the vertical and direction spellings; dashed / color; customClass and customStyle overriding the default 1em height." />

## Hairline (`hairline`)

`hairline` defaults to `true`: a horizontal line gets `border-top-width: 1rpx` and a vertical one `border-left-width: 1rpx` (1rpx is 0.5px on the 750 canvas — the mobile one-physical-pixel hairline). `false` restores the regular `2rpx` width. It stacks with `dashed`.

<Demo name="divider-mp-hairline" description="hairline on / off side by side: horizontal, with text, vertical and a thin dashed line." />

## Auto-register (easycom)

Conforms to easycom — **no import needed in templates**:

```vue
<p>Above</p>
<sn-divider />
<p>Below</p>
```

Explicit import (when easycom is disabled):

```ts
import { SnDivider } from '@snui/uni'
```

## API

### Props

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `direction` | `'horizontal' \| 'vertical'` | `'horizontal'` | Axis |
| `dashed` | `boolean` | `false` | Dashed border |
| `hairline` | `boolean` | `true` | 1rpx hairline |
| `color` | `string` | — | Custom color |
| `marginSize` | `'small' \| 'medium' \| 'large'` | `'medium'` | Vertical margin (horizontal only) |
| `contentPosition` | `'left' \| 'center' \| 'right'` | `'center'` | Text position (horizontal with text only) |
| `vertical` | `boolean` | `false` | Vertical divider (same as `direction="vertical"`) |
| `customClass` | `string` | `''` | Root class |
| `customStyle` | `string \| Record<string,string>` | `''` | Root inline style |

### Slots

| Name | Description |
| --- | --- |
| `default` | Text on the line (horizontal only) |

## Related

- Web: [`SnDivider`](/en/components/web/divider)
