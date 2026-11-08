# Ecosystem Overview

Ecosystem plugins are **official plugin packages outside the core component
library**: installed on demand, not shipped with `@snui/vue-web`, each with its
own versioning and scope. Every plugin gets one page of **docs + live demos**
under its sidebar category.

How they differ from components: a component solves "one control"; an
ecosystem plugin solves "a whole capability area" — imported like components,
but usually shipping their own style layer, pure-function utilities or even
several sub-components.

---

## Plugin index

| Plugin                                             | Components                                                                                                                                                  | Platform | What it solves                                                                                                                                                                                     |
| -------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [Admin layout](/en/ecosystem/plugins/admin-layout) | `SnProLayout` (standard) / `SnProLayoutClassic` (classic) / `SnProLayoutAurora` (aurora) + shared `SnProLogo` / `SnProSearch` / `SnProNotice` / `SnProUser` | Web      | Several admin layout styles: standard's four switchable shapes + settings drawer + tab bar; classic's categorized sider + content header; aurora's full-bleed background + top bar + floating rail |

> Want your package listed here? See the `packages/` conventions and ADR-0006
> (layout-package scope boundary).
