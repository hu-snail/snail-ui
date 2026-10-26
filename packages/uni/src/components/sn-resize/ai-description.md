# sn-resize — AI-Friendly Component Description (uni-end)

> Human-readable + AI-parseable description of the uni-end resize observer.
> Reference library: wot-ui `wd-resize`
> (<https://wot-ui.cn/component/resize.html>).

## Purpose

Wrap content and emit a `resize` event whenever the wrapped box changes size or
position. Used by hosts that need to recompute a layout after their content
grows — charts, masonry columns, virtual lists.

## Auto-registration

```text
packages/uni/src/components/sn-resize/sn-resize.vue
```

→ registered as `<sn-resize>` via uni-app easycom.

## Why polling, not `ResizeObserver`

| Target             | `ResizeObserver`  | `uni.createSelectorQuery` |
| ------------------ | ----------------- | ------------------------- |
| H5                 | available         | available                 |
| WeChat / Alipay MP | **not available** | available                 |
| App (uni-app x)    | not guaranteed    | available                 |

The lowest common denominator is the selector query, so the component polls it
every 100 ms. That is also the only resource it owns, which makes the §41
dispose obligation a single `clearInterval`.

An unchanged box is **not** re-emitted, so a listener never re-renders on a
quiet tick.

## Props

| Name                   | Type     | Default | Description                       |
| ---------------------- | -------- | ------- | --------------------------------- |
| `customStyle`          | `string` | `''`    | Inline style on the root node.    |
| `customClass`          | `string` | `''`    | Class on the root node.           |
| `customContainerClass` | `string` | `''`    | Class on the measured inner node. |

## Events

| Name     | Payload                                                         | Description                                                  |
| -------- | --------------------------------------------------------------- | ------------------------------------------------------------ |
| `resize` | `{ width, height, top, left, bottom, right }` (all px, rounded) | Fired on the first measurement and whenever the box changes. |

## Slots

| Name      | Description                     |
| --------- | ------------------------------- |
| `default` | Content whose size is observed. |

## Tokens Consumed

None — this component is geometry-only.

## Accessibility

The wrapper adds no role and no focus behaviour; it is a measurement boundary,
not a widget. It does not alter the accessibility tree of its children.

## Cross-end Notes

| Platform                    | Notes                                        |
| --------------------------- | -------------------------------------------- |
| H5                          | Polls `boundingClientRect`; ~100 ms latency. |
| WeChat / Alipay MP          | Same mechanism, native call.                 |
| App (uni-app x)             | Same mechanism.                              |
| No uni runtime (unit tests) | Emits nothing and does not throw.            |

## Versioning

`@snui/uni@0.1.0` — initial release.
