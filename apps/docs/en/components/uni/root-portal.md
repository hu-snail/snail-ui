# RootPortal · uni-app (Mobile)

`sn-root-portal` renders its content in a full-viewport fixed layer, so it escapes a clipped or transformed ancestor (`overflow: hidden`, `position: relative`, a `scroll-view` boundary). Auto-registered via easycom.

## Basic

The box below is `overflow: hidden`, so ordinary content is cut off. Wrapped in `sn-root-portal`, the content sits on the viewport layer and is no longer clipped.

<Demo name="root-portal-mp-basic" description="Mount / unmount the portal layer and watch whether the ancestor clips the content." />

## Custom class and inline style

The layer is the only node this component can style (there is no teleport target). `custom-class` / `custom-style` land on that fixed layer — position, background and stacking for an overlay all come from here:

<Demo name="root-portal-mp-custom" description="customClass drives the fixed layer (the preview makes it absolute so it does not cover the phone screen); customStyle adds inline styles." />

## What it guarantees — and what it does not

The web end uses Vue's `<Teleport to="body">`. Mini programs have no `body`, native App has no document tree, and no single API reparents a node across all uni targets — inventing one would silently change rendering on some platforms. This component therefore guarantees only what is portable:

| Guarantee                             | How                                                         |
| ------------------------------------- | ----------------------------------------------------------- |
| Content is not clipped by an ancestor | `position: fixed` layer with zero insets                    |
| The layer never blocks the page       | `pointer-events: none` on the layer, `auto` on its children |
| Visibility is explicit                | mount to show, unmount to hide (no boolean prop)            |

> **Not implemented**: true DOM reparenting (teleport). For a full overlay with mask, scroll lock and animation, use `sn-popup` / `sn-overlay` — that is the supported path on this end.

## Props

`wd-root-portal` declares none. Two additive AUI hooks exist because, without a teleport target, this layer is the only node a caller can style:

| Prop          | Type     | Default | Description                                |
| ------------- | -------- | ------- | ------------------------------------------ |
| `customClass` | `string` | `''`    | Class on the fixed layer (additive)        |
| `customStyle` | `string` | `''`    | Inline style on the fixed layer (additive) |

## Events

None.

## Slots

| Slot      | Description                             |
| --------- | --------------------------------------- |
| `default` | Content rendered inside the fixed layer |

## Theme variables

Consumes no token. This layer must not paint anything (background, border, shadow) or it would obscure the page beneath.

## Accessibility

No role is added — this is a layout layer, not a dialog. Because the layer itself is `pointer-events: none`, it never steals focus and never intercepts taps meant for the page below; only the slotted content is interactive.

## Dark mode

The layer paints no colour, so it needs no dark-mode adaptation. Colours inside the slotted content follow the theme through `--sn-mp-color-*`.
