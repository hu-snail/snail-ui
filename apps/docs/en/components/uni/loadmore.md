# LoadMore · uni-app

`sn-loadmore` is the list footer of `@snui/uni` (mobile / miniprogram / H5): `state` reports loading / finished / failed (tap to retry). It is **state-driven** — the component never fetches, never registers a scroll listener and never starts a timer; paging belongs to the host page. Auto-registered through easycom (`components/sn-loadmore/sn-loadmore.vue` → `<sn-loadmore>`); geometry uses `rpx`.

> **Not implemented**
>
> - wot-ui's i18n default texts are hardcoded to Simplified Chinese this round (the uni end has no locale provider yet); pass `loadingText` / `finishedText` / `errorText` to localize.

## Basic usage

`state="loading"` renders a spinner plus text, `finished` renders the completion text, `error` renders the failure text plus a "tap to retry" hint and emits `reload` on tap.

<Demo name="loadmore-mp-basic" description="Switch between the three states and count retries." />

## Custom texts and slots

The three `*-text` props override the defaults; the `loading` / `finished` / `error` slots fully replace that state's content.

<Demo name="loadmore-mp-text" description="Custom texts and a custom loading slot." />

## Spinner props and custom styles

`loadingProps` is forwarded straight to the inner `sn-loading`, so `type` / `color` / `size` all work; `customClass` / `customStyle` land on the root node.

<Demo name="loadmore-mp-custom" description="loading-props swaps spinner shape and color / custom-class dashed outline / custom-style radius." />

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| state | '' \| 'loading' \| 'finished' \| 'error' | '' | Load state; an empty string renders nothing |
| loadingText | string | 'Loading…' | Loading text |
| finishedText | string | 'All loaded' | Finished text |
| errorText | string | 'Load failed' | Error text |
| loadingProps | Record<string, unknown> | `{}` | Props forwarded to the inner `sn-loading` |
| customClass | string | '' | Custom class for the root node |
| customStyle | string | '' | Custom inline style for the root node |

## Events

| Event | Description | Payload |
| --- | --- | --- |
| reload | Tapped while `state="error"` | — |

## Slots

| Slot | Description |
| --- | --- |
| loading | Custom loading content |
| finished | Custom finished content |
| error | Custom error content |

## Theme variables

| Variable | Purpose |
| --- | --- |
| --sn-mp-color-text-secondary | Loading text |
| --sn-mp-color-text-tertiary | Finished text |
| --sn-mp-color-feedback-danger | Error text |
| --sn-mp-color-action-primary | Retry hint |
| --sn-mp-font-size-sm | Footer text size |
| --sn-mp-font-line-height-normal | Footer line height |
| --sn-mp-spacing-2` / `-4` / `-5 | Padding and gaps |

## Accessibility

- Root: `role="status"` + `aria-live="polite"`, with `aria-busy` mirroring `state === "loading"`
- The error state is tappable; the retry hint is visible text

## Dark mode

The text colors come from semantic tokens (`--sn-mp-color-text-secondary` / `-tertiary` / `--sn-mp-color-feedback-danger` / `--sn-mp-color-action-primary`), all overridden in the dark block of `@snui/tokens-mp/styles`, so it adapts automatically. Verify with sn-config-provider 的 theme 设为 dark:


## Related

- Skeleton screen: [`sn-skeleton`](/en/components/uni/skeleton)
- Empty state: [`sn-empty`](/en/components/uni/empty)
