# Resize · uni-app (Mobile)

`sn-resize` wraps content and emits a `resize` event whenever the wrapped box changes size or position. Auto-registered via easycom; consumes no colour tokens.

## Basic

A host usually needs to recompute layout after its content grows (a longer list, a wrapped title). `sn-resize` reports the box on the first measurement and on every change.

<Demo name="resize-mp-basic" description="Adding a row updates the measured box." />

## Custom classes and the measured boundary

`customClass` / `customStyle` apply to the outer wrapper node; `customContainerClass` applies to the inner node that `boundingClientRect` actually measures:

<Demo name="resize-mp-custom" description="customClass / customStyle draw the outer wrapper boundary; customContainerClass draws the measured inner node." />

## Why polling instead of ResizeObserver

| Target | `ResizeObserver` | `uni.createSelectorQuery` |
| --- | --- | --- |
| H5 | available | available |
| WeChat / Alipay MP | **not available** | available |
| App (uni-app x) | not guaranteed | available |

The lowest common denominator is the selector query, so the component polls `uni.createSelectorQuery().boundingClientRect()` every 100 ms. That is also the only resource it owns, so unmounting is a single `clearInterval`.

An unchanged box is **not** re-emitted, so a host listening to `resize` never re-renders on a quiet tick.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `customStyle` | `string` | `''` | Inline style on the root node |
| `customClass` | `string` | `''` | Class on the root node |
| `customContainerClass` | `string` | `''` | Class on the measured inner node |

## Events

| Event | Description | Payload |
| --- | --- | --- |
| `resize` | Fired on the first measurement and on every box change | `{ width, height, top, left, bottom, right }` (px, rounded) |

## Slots

| Slot | Description |
| --- | --- |
| `default` | Content whose size is observed |

## Theme variables

This component is geometry-only and consumes no `--sn-mp-*` colour or spacing variable.

## Accessibility

The wrapper adds no role and does not change focus behaviour — it is a measurement boundary, not a widget, so the accessibility tree of its children is untouched.

## Dark mode

The component paints nothing, so it needs no dark-mode adaptation. Colours inside its content are the content's own responsibility (use `--sn-mp-color-*` and they follow the theme automatically).
