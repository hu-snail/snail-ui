# wot-ui API reference (machine-readable)

`wot-ui-api-spec.json` is the scraped API surface of **wot-ui v2.3.2**
(<https://wot-ui.cn/>), the reference library for `@snui/uni` per
`AGENTS.md` §112.

## Why this file exists

`AGENTS.md` §112 requires every `sn-*` component to mirror its `wd-*`
counterpart 1:1 (prop names, defaults, allowed value sets, controlled
semantics). Before this file, that requirement could only be checked by
opening the upstream docs page for every component — slow, and impossible to
diff in review.

With the spec checked in:

- a component author reads the exact prop list from JSON instead of a webpage
- a reviewer diffs `sn-*.vue` props against the spec mechanically
- the docs pages (`apps/docs/components/uni/*.md`) can be generated/verified
  against the same source

## Shape

```jsonc
{
  "button": {
    "component": "button",          // upstream page slug
    "title": "Button 按钮",          // upstream h1
    "attributes": [                 // the "Attributes / 参数" table
      { "name": "type", "desc": "…", "type": "string", "default": "primary" }
    ],
    "events":   [{ "name": "click", "desc": "…", "params": "MouseEvent" }],
    "slots":    [{ "name": "default", "desc": "…" }],
    "cssVars":  [{ "name": "--wot-button-color", "default": "…", "desc": "…" }],
    "enums":    [{ "heads": ["属性", "说明"], "rows": [["share", "触发用户转发"]] }]
  }
}
```

- `attributes` is the component's own prop table. Pages that document a
  parent + children pair (e.g. `cell` / `cell-group`, `avatar` /
  `avatar-group`) concatenate both tables, so the array is longer than one
  component's surface — the `desc` column is the disambiguator.
- `cssVars` keeps the upstream `--wot-*` names. The mapping to our
  `--sn-mp-*` namespace is intentional and 1:1 by role, not by name.
- `enums` holds the auxiliary tables (open-type values, slot lists, external
  class names) that upstream documents outside the Attributes table.

## Coverage

82 components, 1480 documented props. Regenerate with the scraper described
in `.ai/reference/README.md` history when upstream bumps a minor version.

## Ground rules

1. **Never invent a prop.** If it is not in this file, it does not ship on the
   uni end. Web-only props (`attrType`, `tag`, `focusable`, `iconPlacement`,
   …) are forbidden here by §112.1.
2. **Defaults are contractual.** `default` in the spec is the default in
   `withDefaults`.
3. **Additive AUI hooks are allowed** but must be documented as additive in the
   component header (`skin`, `theme`, `themeVars` on the config provider are
   the current examples).
4. **Deprecated aliases stay.** When we rename a prop for clarity, keep the
   old name as a `@deprecated` alias (§112.2c) — the spec only knows the
   upstream name, so a rename without an alias is a breaking change.
