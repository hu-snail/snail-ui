# `.ai/architecture/`

Architecture decision records and module-level architecture docs consumed by AI agents before any code change.

## Layout

| File | Purpose |
| --- | --- |
| `protocol.md` | AUI Protocol freeze — UISchema / UINode / Binding / Action / A11y / Capability |
| `runtime.md` | Runtime architecture — lifecycle, state, registry, error, inspection |
| `renderer.md` | Renderer contract — Vue Web (Phase 2), Uni (Phase 3), future React/Flutter |
| `state.md` | State / binding / action boundary, external state bridge |
| `tokens.md` | Token cascade — Primitive → Semantic → Component, Theme/Style/Density axes |
| `studio.md` | Studio MVP architecture — Canvas, Inspector, Patch, AI loop |

## Authoring rules

- One concern per file. Keep under 200 lines.
- Reference upstream: any rule MUST cite the source section in `/dev-docs/AUI-PRD-v1.2.md` or `/dev-docs/AUI-Master-Plan-v3.0.md`.
- Anything not yet written in here MUST NOT be invented by AI agents during implementation.