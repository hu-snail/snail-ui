# sn-config-provider — AI-Friendly Component Description (uni-end)

> Human-readable + AI-parseable description of the uni-end global config
> provider. Reference library: wot-ui `wd-config-provider`
> (<https://wot-ui.cn/component/config-provider.html>).

## Purpose

Scoped global configuration for `@snui/uni`. It gives a subtree of the page a
theme mode, per-subtree token overrides and a Style Pack, without touching the
rest of the app.

## Why the uni end needs its own mechanism

The web end flips dark mode by toggling `.dark` on `<html>`. That does not
exist here:

| Target | Why `:root` / `document` is unavailable |
|---|---|
| WeChat / Alipay mini program | WXSS / ACSS have no `:root` selector and no DOM API |
| Native App (nvue) | No document tree at all |
| H5 | Works, but must stay consistent with the two above |

So the theme is expressed as a **class on this component's own root**
(`.sn-theme-dark`), and every descendant resolves its `--sn-mp-color-*` aliases
against that scoped class. Containment is therefore automatic: siblings outside
the provider keep the page-level theme.

## Auto-registration

```text
packages/uni/src/components/sn-config-provider/sn-config-provider.vue
```

→ registered as `<sn-config-provider>` via uni-app easycom.

## Props

| Name | Type | Default | Description |
|---|---|---|---|
| `skin` | `string` | `''` | Active Style Pack id (kebab-case). `'default'` or empty adds no skin class. AUI-specific, additive. |
| `theme` | `'light' \| 'dark'` | `'light'` | Theme mode for this subtree. Mirrors `wd-config-provider` `theme`. |
| `themeVars` | `Record<string, string>` | `{}` | Per-subtree CSS variable overrides. Mirrors `theme-vars`. |
| `customClass` | `string` | `''` | Custom class on the root node. |
| `customStyle` | `string` | `''` | Custom inline style on the root node. |

### `themeVars` key dialects

Both spellings land on the same CSS variable:

| Key form | Resulting variable |
|---|---|
| `'--sn-mp-color-action-primary'` | `--sn-mp-color-action-primary` (passed through) |
| `'buttonPrimaryBgColor'` | `--sn-mp-button-primary-bg-color` (prefixed + kebab-cased) |

The camelCase dialect exists because wot-ui documents `themeVars` that way;
accepting both means a snippet copied from their docs works unchanged.

## Events

None.

## Slots

| Name | Description |
|---|---|
| `default` | Content that should inherit the configuration. |

## Tokens Consumed

None directly. The component *sets* variables:

| Mechanism | Variables affected |
|---|---|
| `theme="dark"` | every `--sn-mp-color-*` alias declared in the `page.sn-theme-dark, .sn-theme-dark` block of `@snui/tokens-mp/styles` |
| `themeVars` | whatever keys the consumer passes |

## Accessibility

The root is a plain container with `data-snui-theme` for inspection. It adds no
role and no focus behaviour — it is a configuration boundary, not a widget.

## Cross-end Notes

| Platform | Notes |
|---|---|
| H5 | Renders as `<view>`; the dark class works like any other CSS class. |
| WeChat / Alipay MP | Works — the class is plain WXSS/ACSS, no `:root` needed. |
| App (uni-app x) | Works; nvue supports class-scoped custom properties. |

## Versioning

`@snui/uni@0.1.0` — `theme` / `themeVars` / `customClass` / `customStyle` added
for wot-ui parity (AUI-MP-THEME-001). `skin` predates them.
