# AI-RULES.md

Project-specific AI agent rules. Read both this file and `/AGENTS.md` before any task.

## Quick links

- Root Agent Standard: [`AGENTS.md`](./AGENTS.md)
- PRD (Active): [`dev-docs/SNUI-PRD-v3.0.md`](./dev-docs/SNUI-PRD-v3.0.md)
- Architecture (Active): [`dev-docs/SNUI-Architecture-v3.0.md`](./dev-docs/SNUI-Architecture-v3.0.md)
- Master Plan (Active): [`dev-docs/SNUI-Master-Plan-v5.0.md`](./dev-docs/SNUI-Master-Plan-v5.0.md)
- WBS Task Index (Active): [`dev-docs/SNUI-WBS-v3.0.md`](./dev-docs/SNUI-WBS-v3.0.md)
- Dev Guide: [`dev-docs/SNUI-Dev-Guide-v3.0.md`](./dev-docs/SNUI-Dev-Guide-v3.0.md)
- Spec-01 Token & Style Pack: [`dev-docs/Spec-01-Token-StylePack.md`](./dev-docs/Spec-01-Token-StylePack.md)
- Spec-02 Component: [`dev-docs/Spec-02-Component.md`](./dev-docs/Spec-02-Component.md)
- Spec-03 AI Layer: [`dev-docs/Spec-03-AI-Layer.md`](./dev-docs/Spec-03-AI-Layer.md)
- Spec-04 Prototype & App: [`dev-docs/Spec-04-Prototype-App.md`](./dev-docs/Spec-04-Prototype-App.md)
- Spec-05 Docs & StyleSwitcher: [`dev-docs/Spec-05-Docs-StyleSwitcher.md`](./dev-docs/Spec-05-Docs-StyleSwitcher.md)
- ADR-0001: [`.ai/decisions/0001-framework-pivot.md`](./.ai/decisions/0001-framework-pivot.md)
- ADR-0002: [`.ai/decisions/0002-ai-native-style-platform.md`](./.ai/decisions/0002-ai-native-style-platform.md)
- AI scratchpad: [`./.ai/`](./.ai)

## Superseded (do not use)

| 文件 | 状态 |
|---|---|
| `dev-docs/AUI-PRD-v1.2.md` | Superseded by PRD v3.0 |
| `dev-docs/AUI-PRD-v2.0.md` | Superseded by PRD v3.0 |
| `dev-docs/AUI-Master-Plan-v3.0.md` | Superseded by Master Plan v5.0 |
| `dev-docs/AUI-Master-Plan-v4.0.md` | Superseded by Master Plan v5.0 |
| `dev-docs/AUI-WBS-v1.0.md` | Superseded by WBS v3.0 |
| `dev-docs/AUI-WBS-v2.0.md` | Superseded by WBS v3.0 |

## Foundation phase quick reference

| Tool | Version | Notes |
| --- | --- | --- |
| pnpm | 10.x | workspace with `pnpm-workspace.yaml`. Use `pnpm -w <cmd>` for root scripts. |
| Node | ≥ 20 | Engines field in root `package.json` enforces this. |
| TypeScript | 5.x strict | `tsconfig.base.json` is the shared compiler config. |
| Turbo | 2.x | Uses `tasks` (not `pipeline`). Pipeline under `turbo.json`. |
| ESLint | 9.x | Uses **flat config** at root `eslint.config.js`. Not `.eslintrc`. |
| Prettier | 3.x | Config at `.prettierrc`. |
| Vitest | 2.x | Root `vitest.config.ts` auto-discovers `packages/*/src/**/*.{test,spec}.ts`. |

## Before you write code

1. Read `/AGENTS.md` once per session.
2. Read the relevant `dev-docs/AUI-*.md` sections (PRD for freeze, Master Plan for phase, WBS for task scope).
3. Read the relevant `.ai/rules/<module>.md` if it exists.
4. Confirm Task ID + Files + Acceptance + Forbidden from `dev-docs/AUI-WBS-v1.0.md`.

## When in doubt

- Rule conflict? Follow `/AGENTS.md` §100 priority: Security > Architecture > Protocol > Task Scope > Testing > Code Style > Optimization > Convenience.
- Scope unclear? Stop. Do NOT guess. Create a follow-up task in `.ai/tasks/follow-up/` and continue with the well-defined subset.
- Architecture change required? Stop. Write an ADR to `.ai/decisions/` and request Human Gate.

## Foundation-phase checks

- Never run `pnpm install` without `--frozen-lockfile` in CI.
- Never delete or skip a failing test (AGENTS.md §48).
- Never add a new top-level dependency without justification (AGENTS.md §56).
- Never use `any`, `eval`, or `new Function` (AGENTS.md §12, §23).
- Never import across layers: `packages/protocol` → no Vue / no DOM. (AGENTS.md §17).