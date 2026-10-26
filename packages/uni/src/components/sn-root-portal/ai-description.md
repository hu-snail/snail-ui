# sn-root-portal — AI-Friendly Component Description (uni-end)

> Human-readable + AI-parseable description of the uni-end root portal.
> Reference library: wot-ui `wd-root-portal`
> (<https://wot-ui.cn/component/root-portal.html>).

## Purpose

Render content in a full-viewport fixed layer so it escapes a clipped or
transformed ancestor (`overflow: hidden`, `position: relative`, a scroll-view
boundary).

## What it actually does — and does not

The web end uses Vue's `<Teleport to="body">`. There is no `body` on a mini
program and no document tree on native App, and no single API reparents a node
on every uni target. Inventing one would silently change rendering on some
platforms, so this component guarantees only what is portable:

| Guarantee                             | How                                                         |
| ------------------------------------- | ----------------------------------------------------------- |
| Content is not clipped by an ancestor | `position: fixed` layer with zero insets                    |
| The layer never blocks the page       | `pointer-events: none` on the layer, `auto` on its children |
| Visibility is explicit                | mount to show, unmount to hide (no boolean prop)            |

**Not implemented:** true DOM reparenting (teleport). Callers who need a real
overlay — with mask, scroll lock, animation — should use `sn-popup` or
`sn-overlay`, which are the supported path on this end.

## Auto-registration

```text
packages/uni/src/components/sn-root-portal/sn-root-portal.vue
```

→ registered as `<sn-root-portal>` via uni-app easycom.

## Props

`wd-root-portal` declares none. Two additive AUI hooks exist because, without a
teleport target, the layer is the only node a caller can style:

| Name          | Type     | Default | Description                                |
| ------------- | -------- | ------- | ------------------------------------------ |
| `customClass` | `string` | `''`    | Class on the fixed layer. Additive.        |
| `customStyle` | `string` | `''`    | Inline style on the fixed layer. Additive. |

## Events

None.

## Slots

| Name      | Description                              |
| --------- | ---------------------------------------- |
| `default` | Content rendered inside the fixed layer. |

## Tokens Consumed

None. The layer has no colour, border or shadow of its own — it must not paint
anything, or it would obscure the page it is layered over.

## Accessibility

No role is added: this is a layout layer, not a dialog. Because the layer itself
is `pointer-events: none`, it never steals focus or intercepts taps meant for
the page beneath; only the slotted content is interactive.

## Cross-end Notes

| Platform           | Notes                                                |
| ------------------ | ---------------------------------------------------- |
| H5                 | `position: fixed` escapes any ancestor.              |
| WeChat / Alipay MP | Same; the layer is a normal view, so no reparenting. |
| App (uni-app x)    | Same.                                                |

## Versioning

`@snui/uni@0.1.0` — initial release. `customClass` / `customStyle` are additive
and documented as such per `CONTRIBUTING.md` §2.2.
