# Introduction

snail-aui v3.1 is an AI-Native UI framework ecosystem for **Vue 3 (Web, PC desktop)** + **uni-app (mobile, touch)**.

**The key design principle is: end-aware**.

> Web (PC) and uni (mobile) are **fully independent** from source to publish.  
> Each end has independent source, independent build, independent npm package, independent Token alias.  
> **Zero source reuse across ends**.

Future ends (React, Flutter, ...) follow the same pattern: `@snui/tokens-{end}` alias package + `@snui/{end}` independent component package.

## Two ends differ

| Dimension | Web (PC desktop) | uni (mobile touch) |
|---|---|---|
| Typical apps | Admin dashboards, CRM, ERP, IDE-like tools, low-code platforms | E-commerce, content, O2O, enterprise apps |
| Input | Mouse + keyboard | Touch + gestures |
| Resolution | 1280×720+, scales to 4K | 320-414 width-first |
| Components | Information density (Table / Tree / Pagination / Cascader / DatePicker ...) | Flow layout (List / PullRefresh / swiper / sticky-tabs / lazy-image ...) |
| Namespace | SnButton / SnForm / SnTable ... | sn-button / sn-list / sn-grid ... |
| Token alias | `var(--sn-web-*)` | `var(--sn-mp-*)` |
| Size unit | px | rpx (auto-converted) |
| API style | naive-ui style (config-driven) | wot-ui style (event-driven) |

**Small overlap**: Button / ConfigProvider / Icon are the lowest-common-denominator components shared across ends.

## Cross-end shared layers

| Shared | How ends are separated |
|---|---|
| `@snui/tokens` unified base | Outputs `--aui-*` raw layer (end-agnostic) |
| `@snui/style-packs` | Each Pack declares `end: web / mp / both` |
| `@snui/ai` Skill + MCP | Tool output filtered by `end` |
| `@snui/ai` ai-meta.json | components array grouped by end |
| `@snui/cli` | resolver per-end, token-check per-end |
| `@snui/docs` | nav split into Web / uni groups |

## 30-second overview

```text
@snui/tokens         --aui-* raw layer (end-agnostic)
        ↑              ↑
   ┌────┴─────┐    ┌────┴──────┐
   │         │    │          │
@snui/tokens-web  @snui/tokens-mp
--sn-web-* alias   --sn-mp-* alias (with rpx conversion)
   ↑                     ↑
@snui/vue-web         @snui/uni
SnButton / SnTable    sn-button / sn-list / sn-pull-refresh
(independent PC)       (independent mobile)

Shared cross-end (end-agnostic):
   @snui/style-packs   @snui/ai   @snui/cli   @snui/docs
```

## Style Pack / AI vs end

- Style Packs are **shared cross-end**, but each Pack declares `end: web / mp / both`
- Apply a Style Pack with `snCssVars({ end: 'web' | 'mp', theme, style })` — `end` determines whether `--sn-web-*` or `--sn-mp-*` is emitted
- AI tools (Skill / ai-meta) classify components by end
- MCP `list_components({ end })` filters by end

## What's shipped

- **M0**: Framework pivot + Button demo ✅
- **M0.5**: ADR-0002 (Style Pack + AI Layer) ✅
- **M0.6**: ADR-0003 (end-aware split + dual Token aliases) ✅ — this batch: PRD v3.1 / Spec-01~02 / WBS v3.1 / Master Plan v5.1 / Dev Guide v3.1
- **M1 (next)**: `@snui/tokens-web` / `@snui/tokens-mp` alias packages + first batch of ~10 components per end
- **M2**: Style Packs (3 default + 2 mp) + AI Layer + StyleSwitcher / ThemeCopier
- **M3**: doodle / sticky-note / wechat Packs + render_preview sandbox
- **M4**: React end extension (same pattern) + VSCode plugin + visual regression

## Where to next

- [Web quick start](/en/guide/web/quick-start)
- [uni-app quick start](/en/guide/uni/quick-start)
- [Architecture](/en/guide/web/architecture)
- [Theme & Tokens](/en/theme/overview)
- [Style Packs](/en/style-packs/overview)
- [AI Ecosystem](/en/ai/overview)