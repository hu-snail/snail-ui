# Avatar · Web

Avatar (n-avatar aligned). Image / text / icon with automatic fallback.

## Basic

<Demo name="avatar-web-basic" description="Image src + sizes." />

## Shapes & color

<Demo name="avatar-web-shapes" description="round / circle / color." />

## Fallback

<Demo name="avatar-web-fallback" description="Load error → fallbackText / icon; resets when src changes." />

## API

### SnAvatar Props

| Prop         | Type                                               | Default    | Notes                          |
| ------------ | -------------------------------------------------- | ---------- | ------------------------------ |
| src          | `string`                                           | —          | Image source                   |
| size         | `number \| 'small'\|'medium'\|'large'`             | `'medium'` | Size (28/34/40px)              |
| round        | `boolean`                                          | `false`    | Rounded                        |
| circle       | `boolean`                                          | `false`    | Circular                       |
| color        | `string`                                           | —          | Background (fallbackText/icon) |
| objectFit    | `'cover'\|'contain'\|'fill'\|'none'\|'scale-down'` | `'cover'`  | Image fit                      |
| fallbackText | `string`                                           | —          | Text fallback                  |
| icon         | `string`                                           | —          | SnIcon registry name           |

Events: `error`; Slots: `default` (highest priority). Fallback chain: slot → fallbackText → icon → built-in SVG.

See the component `ai-description.md` for the full contract.
