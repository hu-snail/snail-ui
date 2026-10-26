# Transition · uni-app

`sn-transition` is the enter / leave animation wrapper of `@snui/uni` (mobile / miniprogram / H5): 11 built-in animation names (combinable via an array), per-leg durations, lazy rendering and destroy-on-leave. Auto-registered through easycom (`components/sn-transition/sn-transition.vue` → `<sn-transition>`); geometry uses `rpx`.

## Basic usage

`show` toggles visibility and `name` picks the animation; every toggle emits `before-enter → enter → after-enter` (or the leave triple).

<Demo name="transition-mp-basic" description="Switching between fade / fade-up / zoom-in / slide-up." />

## Combining, per-leg durations and destroy

An array `name` is joined into `sn-transition--<a>-<b>` (e.g. `["fade", "up"]` → `fade-up`); an object `duration` sets the enter / leave legs separately; `destroy=false` keeps the node mounted after leaving (`display: none`).

<Demo name="transition-mp-config" description="Combined animation, enter 100ms / leave 600ms, destroy=false, plus the event sequence." />

## Per-stage classes and root styling

`enter-class` / `enter-active-class` / `enter-to-class` (with `leave-*` mirroring them) are applied to the root node per stage: `-class` is the first frame of the leg, `-active-class` covers the whole leg and `-to-class` is the settled state after it. The classes only ride along with the stage — the animation itself still comes from `name` / `duration`. `custom-class` stays on the root node and `custom-style` is appended to its inline style.

<Demo name="transition-mp-custom-class" description="All six stage classes with the event sequence; customClass dashed frame + customStyle inline radius; a customClass-only control." />

## Lazy rendering and blocking touch scroll

`lazy-render` defaults to `false` (the slot renders at mount and hides with `display: none` while `destroy` is true). With `true` the slot renders the first time `show` turns true and stays rendered afterwards. `disable-touch-move` makes the root swallow touchmove's default action, so the page behind a panel does not scroll along.

<Demo name="transition-mp-lazy" description="lazy-render on / off with the slot render state; disable-touch-move checked against a background scroll area." />

## Props

| Prop             | Type                                        | Default | Description                                                     |
| ---------------- | ------------------------------------------- | ------- | --------------------------------------------------------------- |
| show             | boolean                                     | false   | Whether the content is shown                                    |
| duration         | number \| boolean \| Record<string, number> | 300     | Animation duration; `false` disables it, an object sets per-leg |
| lazyRender       | boolean                                     | false   | Defer the first render until `show` turns true                  |
| name             | TransitionName \| TransitionName[]          | —       | Animation name, or an array to combine several                  |
| destroy          | boolean                                     | true    | Hide with `display: none` after the leave animation             |
| enterClass       | string                                      | ''      | Class on the enter start frame                                  |
| enterActiveClass | string                                      | ''      | Class while entering                                            |
| enterToClass     | string                                      | ''      | Class on the enter end frame                                    |
| leaveClass       | string                                      | ''      | Class on the leave start frame                                  |
| leaveActiveClass | string                                      | ''      | Class while leaving                                             |
| leaveToClass     | string                                      | ''      | Class on the leave end frame                                    |
| disableTouchMove | boolean                                     | false   | Intercept touchmove so the page behind cannot scroll            |
| customStyle      | string                                      | ''      | Custom inline style for the root node                           |
| customClass      | string                                      | ''      | Custom class for the root node                                  |

## Events

| Event        | Description     | Payload |
| ------------ | --------------- | ------- |
| before-enter | Before entering | —       |
| enter        | Entering        | —       |
| after-enter  | After entering  | —       |
| before-leave | Before leaving  | —       |
| leave        | Leaving         | —       |
| after-leave  | After leaving   | —       |
| click        | Root tapped     | Event   |

## Slots

| Slot    | Description            |
| ------- | ---------------------- |
| default | The content to animate |

## Theme variables

| Variable | Purpose                                                                    |
| -------- | -------------------------------------------------------------------------- |
| —        | The animation only touches transform / opacity and consumes no color token |

## Accessibility

- The wrapper adds no ARIA role — semantics belong to the content inside
- `disableTouchMove` intercepts touchmove only; no global listener is registered

## Dark mode

The animation only changes `transform` / `opacity` and consumes no color token, so nothing extra is needed in dark mode. Verify with sn-config-provider 的 theme 设为 dark:

## Related

- Layer with its own animation: [`sn-popup`](/en/components/uni/popup)
- Scrim with its own animation: [`sn-overlay`](/en/components/uni/overlay)
