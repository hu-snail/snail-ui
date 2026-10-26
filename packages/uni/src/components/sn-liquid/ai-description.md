# sn-liquid — AI-Friendly Component Description

> Human-readable + AI-parseable description of the uni-end sn-liquid component.
> **`end: mp`** marker — consumed by `list_components({ end: 'mp' })`.
> Reference library: lime-ui `l-liquid` (additive business component, AUI-BIZ-001).

## Purpose

Animated water-wave progress ball: percentage shown as a rising liquid level with two rotating wave sheets. transform/opacity-only keyframes; no canvas; safe on both uni-app and uni-app x App.

## Import

```vue
<sn-liquid :percent="60" />
```

## Props

| Name          | Type      | Default            | Required | Description                                  |
| ------------- | --------- | ------------------ | -------- | -------------------------------------------- |
| `percent`     | `number`  | `0`                | no       | Progress percentage (clamped 0-100).         |
| `size`        | `string`  | `'160rpx'`         | no       | Ball size (rpx/px).                          |
| `duration`    | `number`  | `500`              | no       | Level transition duration (ms); 0 = instant. |
| `outline`     | `boolean` | `false`            | no       | Show outer ring.                             |
| `radius`      | `string`  | `'50%'`            | no       | Corner radius.                               |
| `waveColor`   | `string`  | primary token      | no       | Wave color.                                  |
| `innerColor`  | `string`  | soft primary token | no       | Background above water.                      |
| `customClass` | `string`  | `''`               | no       | Root custom class.                           |
| `customStyle` | `string`  | `''`               | no       | Root custom style.                           |

## Events

| Name             | Payload  | Description                                  |
| ---------------- | -------- | -------------------------------------------- |
| `update:current` | `number` | Transitioning level (for `v-model:current`). |

## Slots

| Name      | Description                             |
| --------- | --------------------------------------- |
| `default` | Center content; defaults to `current%`. |
