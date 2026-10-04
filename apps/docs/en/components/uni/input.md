# Input · uni-app

Cross-end controlled input for uni-app (H5 / WeChat MP / App). Geometry in rpx, tokens drive the surface.

## Basic

<Demo name="input-mp-basic" description="v-model binding." />

## Types

<Demo name="input-mp-types" description="7 native types: text / password / email / number / tel / url / search." />

## Sizes

<Demo name="input-mp-sizes" description="3 size presets: small / medium / large." />

## Status

<Demo name="input-mp-status" description="default / error / warning." />

## States

<Demo name="input-mp-states" description="disabled / readonly / required." />

## Clearable + Counter

<Demo name="input-mp-clearable-count" description="clearable + showCount + maxlength." />

## Slots

<Demo name="input-mp-slots" description="prefix / suffix / clear-icon / count slots + sn-icon integration." />

## Border / Background / Radius

<Demo name="input-mp-bordered-bg-radius" description="bordered toggles 2rpx border; bg surface / transparent / soft; radius default / pill / square." />

## Textarea

`type="textarea"` renders multi-line.

## Props

| Prop | Type | Default |
| --- | --- | --- |
| `modelValue` | `string \| number` | `''` |
| `type` | `text \| password \| email \| number \| tel \| url \| search \| textarea` | `text` |
| `size` | `small \| medium \| large` | `medium` |
| `placeholder` | `string` | `''` |
| `disabled` | `boolean` | `false` |
| `readonly` | `boolean` | `false` |
| `required` | `boolean` | `false` |
| `maxlength` / `minlength` | `number` | — |
| `showCount` | `boolean` | `false` |
| `clearable` | `boolean` | `false` |
| `status` | `default \| error \| warning` | `default` |
| `min / max / step` | `number` | — |
| `rows` | `number` | `3` |
| `bordered` | `boolean` | `true` |
| `bg` | `surface \| transparent \| soft` | `surface` |
| `radius` | `default \| pill \| square` | `default` |

## Events

`update:modelValue` / `input` / `change` / `focus` / `blur` / `clear`.

## Slots

`prefix` / `suffix` / `clear-icon` / `count`.

## Source

Uni renderer at `@snui/uni`; contract shared with web.