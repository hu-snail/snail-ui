# ConfigProvider · uni-app (Mobile)

`sn-config-provider` gives a **subtree** of the page its own global configuration: theme mode, token overrides and Style Pack. Auto-registered via easycom; nothing outside the subtree is affected.

> Reference: wot-ui `wd-config-provider` (`theme` / `theme-vars` / `custom-class` / `custom-style` mirror it 1:1). `skin` is an additive AUI capability and does not replace `theme`.

## Basic

<Demo name="config-provider-mp-basic" description="Wrap a subtree to inherit the configuration; the rest of the page is untouched." />

## Dark mode

uni-app runs on mini programs and native App targets that have no `document` and no `:root`, so the web approach of putting `.dark` on `<html>` is unavailable. This component expresses the theme as a **class on its own root** (`.sn-theme-dark`); descendants resolve their `--sn-mp-color-*` aliases against that class, so containment is automatic.

<Demo name="config-provider-mp-dark" description="theme set to dark switches only this subtree; siblings stay light." />

## Theme variable overrides

`themeVars` writes inline CSS variables onto the root, so changing a single colour slot needs no stylesheet. Keys accept two spellings:

| Form | Resulting variable |
| --- | --- |
| `'--sn-mp-color-action-primary'` | used verbatim |
| `'buttonPrimaryBgColor'` | `--sn-mp-button-primary-bg-color` (prefixed and kebab-cased) |

The second form exists so snippets copied from the wot-ui docs work unchanged.

<Demo name="config-provider-mp-vars" description="themeVars overrides the primary colour and surface; both key spellings are equivalent." />

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `skin` | `string` | `''` | Style Pack id (kebab-case). `'default'` or empty adds no skin class |
| `theme` | `'light' \| 'dark'` | `'light'` | Theme mode for this subtree |
| `themeVars` | `Record<string, string>` | `{}` | Subtree-level CSS variable overrides |
| `customClass` | `string` | `''` | Custom class on the root node |
| `customStyle` | `string` | `''` | Custom inline style on the root node |

## Events

None.

## Slots

| Slot | Description |
| --- | --- |
| `default` | Content that inherits the configuration |

## Theme variables

This component does not consume colour tokens — it **sets** them:

| Mechanism | Variables affected |
| --- | --- |
| `theme="dark"` | every `--sn-mp-color-*` alias declared in the `page.sn-theme-dark, .sn-theme-dark` block of `@snui/tokens-mp/styles` |
| `themeVars` | whatever keys the caller passes |

## Accessibility

The root is a plain container carrying `data-snui-theme` for inspection. It adds no role and does not change focus behaviour — it is a configuration boundary, not a widget.

## Dark mode

This component *is* the dark-mode entry point: `theme="dark"` enables the full dark alias set inside the subtree. Verify with:

<Demo name="config-provider-mp-dark" description="Light and dark subtrees coexist on one page without affecting each other." />

> For page-level (rather than subtree-level) dark mode, add the `sn-theme-dark` class to `page` — see `@snui/tokens-mp/styles`.
