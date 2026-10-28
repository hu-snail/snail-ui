# Avatar · Web

Avatar (n-avatar aligned). Image / text / icon with automatic fallback.

## Basic

<Demo name="avatar-web-basic" description="Image src + sizes." />

## Shapes & color

<Demo name="avatar-web-shapes" description="round / circle / color." />

## Fallback

<Demo name="avatar-web-fallback" description="Load error → fallbackText / icon; resets when src changes." />

## Lazy loading

 <Demo name="avatar-web-lazy" description="Avatars in a long scrollable list: lazy uses the native loading=lazy attribute; adding intersection-observer-options defers the request until the avatar enters the viewport (point root at the scroll container)." />

## API

### SnAvatar Props

| Prop                        | Type                                               | Default    | Notes                                                                                                              |
| --------------------------- | -------------------------------------------------- | ---------- | ------------------------------------------------------------------------------------------------------------------ |
| src                         | `string`                                           | —          | Image source                                                                                                       |
| size                        | `number \| 'small'\|'medium'\|'large'`             | `'medium'` | Size (28/34/40px)                                                                                                  |
| round                       | `boolean`                                          | `false`    | Rounded                                                                                                            |
| circle                      | `boolean`                                          | `false`    | Circular                                                                                                           |
| color                       | `string`                                           | —          | Background (fallbackText/icon)                                                                                     |
| objectFit                   | `'cover'\|'contain'\|'fill'\|'none'\|'scale-down'` | `'cover'`  | Image fit                                                                                                          |
| lazy                        | `boolean`                                          | `false`    | Lazy loading; on its own it uses native `loading="lazy"`                                                           |
| intersectionObserverOptions | `{ root?, rootMargin?, threshold? }`               | —          | With `lazy`, the `src` is withheld until the avatar enters the viewport (the fallback content renders while gated) |
| fallbackText                | `string`                                           | —          | Text fallback                                                                                                      |
| icon                        | `string`                                           | —          | SnIcon registry name                                                                                               |

Events: `error`; Slots: `default` (highest priority). Fallback chain: slot → fallbackText → icon → built-in SVG.

The IntersectionObserver gate is enabled by `lazy` **plus** `intersection-observer-options` — the same
implementation SnImage uses (`_internal/lazy-visibility`). Once an avatar has intersected it stays
loaded; scrolling past never unloads it. Without `IntersectionObserver` in the environment the gate
resolves immediately instead of leaving the image unloaded forever.

See the component `ai-description.md` for the full contract.
