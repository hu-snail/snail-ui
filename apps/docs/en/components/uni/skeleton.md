# Skeleton · uni-app

`sn-skeleton` is the loading placeholder of `@snui/uni` (mobile / miniprogram / H5): a set of shimmering text / rect / circle / image blocks that is replaced by the real content once `loading` turns false. Auto-registered through easycom (`components/sn-skeleton/sn-skeleton.vue` → `<sn-skeleton>`); geometry uses `rpx`.

## Basic usage

`theme` provides four presets: `text` / `avatar` / `paragraph` / `image`.

<Demo name="skeleton-mp-basic" description="The four preset layouts." />

## Custom rows and columns

Each `rowCol` entry is either a number (that many default text blocks in the row) or an array of column descriptors. A descriptor accepts `type` (`text` / `rect` / `circle` / `image`), `size` / `width` / `height` (bare number = rpx), `margin`, `borderRadius` and `backgroundColor`.

<Demo name="skeleton-mp-custom" description="A card layout and a mixed image + text layout." />

## Shimmer and switching

`animation` takes `gradient` (a sweeping highlight) or `flashed` (an opacity pulse); with `loading=false` the `default` slot renders instead.

<Demo name="skeleton-mp-animation" description="Both shimmer kinds, plus a loading toggle that reveals the real content." />

## Custom class and style

`customClass` accepts a string, a string array or a boolean map, and `customStyle` writes a root inline style.

<Demo name="skeleton-mp-custom-style" description="custom-class dashed frame / custom-style padding and radius / both together." />

All three shapes (string / string array / boolean map) act on the root node the same way; the object form fits toggling classes by state:

<Demo name="skeleton-mp-custom-class-forms" description="The three customClass shapes: string, string array, boolean map (with toggles adding and dropping classes live)." />

## Props

| Prop        | Type                                          | Default | Description                                         |
| ----------- | --------------------------------------------- | ------- | --------------------------------------------------- |
| theme       | 'text' \| 'avatar' \| 'paragraph' \| 'image'  | 'text'  | Preset layout (used when `rowCol` is empty)         |
| rowCol      | (number \| SnSkeletonCol[])[]                 | []      | Per-row layout                                      |
| loading     | boolean                                       | true    | Show the skeleton; `false` renders the default slot |
| animation   | '' \| 'gradient' \| 'flashed'                 | ''      | Shimmer kind                                        |
| customClass | string \| string[] \| Record<string, boolean> | ''      | Custom class for the root node                      |
| customStyle | string                                        | ''      | Custom inline style for the root node               |

`SnSkeletonCol` = `{ type?, size?, width?, height?, margin?, borderRadius?, backgroundColor? }`.

## Events

None — the component is presentational.

## Slots

| Slot    | Description                                    |
| ------- | ---------------------------------------------- |
| default | Real content, rendered once `loading` is false |

## Theme variables

| Variable                              | Purpose                          |
| ------------------------------------- | -------------------------------- |
| --sn-mp-color-background-subtle       | Placeholder fill / gradient base |
| --sn-mp-color-background-elevated     | Gradient highlight               |
| --sn-mp-color-border-default          | Doodle skin outline              |
| --sn-mp-radius-sm`/`-md`/`-lg`/`-full | Placeholder corners              |
| --sn-mp-spacing-3                     | Row and column gap               |

## Accessibility

- Root: `role="status"` + `aria-live="polite"` + `aria-busy="true"` + `aria-label="loading"`
- Each placeholder block: `aria-hidden="true"`

## Dark mode

The placeholder fill and highlight use `--sn-mp-color-background-subtle` / `--sn-mp-color-background-elevated`, both overridden in the dark block of `@snui/tokens-mp/styles`, so it adapts automatically. Verify with sn-config-provider 的 theme 设为 dark:

> A literal passed through a column `backgroundColor` does not flip with the theme — prefer `var(--sn-mp-*)` colors in dark mode.

## Related

- Indeterminate loading: [`sn-loading`](/en/components/uni/loading)
- Empty state: [`sn-empty`](/en/components/uni/empty)
