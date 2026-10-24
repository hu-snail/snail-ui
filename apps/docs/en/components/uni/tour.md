# Tour · uni-app

`sn-tour` is the step-by-step feature guide of `@snui/uni` (mobile / miniprogram / H5). Auto-registered via easycom; geometry uses `rpx` so it scales with the device.

## Basic usage

`v-model` controls visibility, `v-model:current` controls the step cursor and `steps` supplies the copy:

<Demo name="tour-mp-basic" description="v-model toggles the tour; v-model:current tracks the step; steps supplies the copy; the last step's button becomes Finish." />

## Custom copy and mask taps

`clickMaskNext` advances on a mask tap; all four button labels are configurable:

<Demo name="tour-mp-custom" description="clickMaskNext advances on a mask tap; prev-text / next-text / skip-text / finish-text customise the labels; border-radius rounds the panel." />

## Mask toggle and custom panel

`mask=false` drops the scrim, `mask-color` overrides it, `duration` sets the animation length, and with `show-tour-buttons=false` the `footer` slot renders the actions; the default slot scope customises the panel body:

<Demo name="tour-mp-mask" description="mask=false leaves no scrim; mask-color / duration / z-index; show-tour-buttons=false with a custom footer slot." />

## Auto registration (easycom)

The component follows the easycom convention, so **no import is needed in a template**:

```vue
<sn-tour v-model="visible" v-model:current="current" :steps="steps" />
```

For an explicit import:

```ts
import { SnTour } from '@snui/uni/components/sn-tour/sn-tour.vue'
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `modelValue` | `boolean` | `false` | Whether the tour is open |
| `steps` | `TourStep[]` | `[]` | Step list |
| `current` | `number` | `0` | Current step index |
| `mask` | `boolean` | `true` | Render the mask |
| `maskColor` | `string` | `''` | Mask colour override |
| `offset` | `number` | `20` | Panel-to-highlight gap (not implemented, see note) |
| `duration` | `number` | `300` | Animation duration in ms |
| `borderRadius` | `number` | `4` | Highlight radius |
| `padding` | `number` | `8` | Highlight padding (not implemented, see note) |
| `prevText` | `string` | `'上一步'` | Previous button label |
| `nextText` | `string` | `'下一步'` | Next button label |
| `skipText` | `string` | `'跳过'` | Skip button label |
| `finishText` | `string` | `'完成'` | Finish button label |
| `bottomSafetyOffset` | `number` | `100` | Bottom safety offset (not implemented) |
| `topSafetyOffset` | `number` | `0` | Top safety offset (not implemented) |
| `customNav` | `boolean` | `false` | Custom navigation-bar mode (not implemented) |
| `clickMaskNext` | `boolean` | `false` | Advance on a mask tap |
| `highlightStyle` | `Record<string, string>` | `{}` | Default highlight style (not implemented) |
| `zIndex` | `number` | `undefined` | Stacking level |
| `showTourButtons` | `boolean` | `true` | Render the guide buttons |
| `missingStrategy` | `'skip' \| 'stop' \| 'hide'` | `'stop'` | Missing-target strategy (not implemented) |
| `customClass` | `string` | `''` | Extra class on the root node |
| `customStyle` | `string` | `''` | Inline style on the root node |

`TourStep` shape: `{ element?: string, content?: string, padding?: number, offset?: number, placement?: 'auto' | 'top' | 'bottom' | 'left' | 'right' }`.

> **Not implemented**: `element` / `padding` / `offset` / `placement` / `highlightStyle` / `missingStrategy` / `topSafetyOffset` / `bottomSafetyOffset` / `customNav` all depend on synchronously measuring a target DOM node (`getBoundingClientRect` / `uni.createSelectorQuery`). No uni host offers one uniform synchronous measurement API, and a wrong rect produces a cut-out pointing at nothing — worse than no cut-out. The uni implementation therefore renders the mask plus a centred panel and hands the step data to the host through the default slot, so a host that *can* measure (H5 / App) positions the highlight itself. The props stay in the surface for contract parity and are marked "not implemented" here.

## Events

| Event | Description | Payload |
| --- | --- | --- |
| `update:modelValue` | Visibility changed | `(value: boolean)` |
| `update:current` | Step changed | `(value: number)` |
| `change` | Step changed | `({ current })` |
| `prev` | Previous tapped | `({ prevCurrent, current, total, isElementInTop })` |
| `next` | Next tapped | `({ prevCurrent, current, total, isElementInTop })` |
| `finish` | Finish tapped | `({ current, total })` |
| `skip` | Skip tapped | `({ current, total })` |
| `error` | Target lookup failed | `({ message, element })` |

## Slots

| Slot | Description |
| --- | --- |
| `default` | Custom panel content; scope `{ step, current, total }` |
| `footer` | Custom footer actions; same scope |

## Theme variables

| Variable | Purpose |
| --- | --- |
| `--sn-mp-color-background-overlay` | Mask scrim |
| `--sn-mp-color-background-elevated` | Panel surface |
| `--sn-mp-color-background-surface` | Button fill |
| `--sn-mp-color-border-default` | Secondary button border |
| `--sn-mp-color-text-primary` | Body and secondary button text |
| `--sn-mp-color-text-secondary` | Skip button text |
| `--sn-mp-color-text-tertiary` | Progress text |
| `--sn-mp-color-action-primary` | Primary button fill |
| `--sn-mp-color-text-on-primary` | Primary button text |
| `--sn-mp-shadow-lg` | Panel elevation |
| `--sn-mp-font-size-md` / `--sn-mp-font-size-sm` | Body / button size |
| `--sn-mp-radius-md` | Button radius |
| `--sn-mp-spacing-3` / `--sn-mp-spacing-4` | Panel gap / padding |

## Accessibility

- The root is `role="dialog"` with `aria-modal="true"` and `aria-label="Guide"`.
- All three buttons are `role="button"` with `aria-label` matching their visible copy; on the last step the primary label becomes `finishText`.
- The progress indicator is `aria-hidden="true"` and is not announced.
- Mobile only: interaction is `tap`; miniprogram has no keyboard focus.

## Dark mode

Every colour in `sn-tour` comes from `--sn-mp-color-*` with no light `var()` fallback, so it adapts automatically under `.sn-theme-dark`: the panel flips to the dark elevated surface, the mask stays a translucent near-black scrim, and the primary button keeps the brand fill with white text.

Verify it by wrapping in sn-config-provider 的 theme 设为 dark:


## Related

- Popup: [`sn-popup`](/en/components/uni/popup)
- Overlay: [`sn-overlay`](/en/components/uni/overlay)
