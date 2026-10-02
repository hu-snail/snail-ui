# `.ai/rules/`

Task-specific AI agent rules. These complement `/AGENTS.md` (100 universal rules) and `/AI-RULES.md` (project quick-reference).

## Layout

```
rules/
├── foundation.md             # Phase 0 rules
├── protocol.md               # Phase 1 protocol rules (TBD in AUI-PROTOCOL-001)
├── schema.md                 # Phase 1 schema rules (TBD)
├── runtime.md                # Phase 1 runtime rules (TBD)
├── component.md              # component authoring rules (TBD)
├── renderer.md               # renderer rules
├── ai-engine.md              # AI engine rules
├── studio.md                 # Studio rules
└── ecosystem.md              # ecosystem rules
```

## Authoring rules

- These rule files MUST be the source of truth for module-specific AI behavior.
- If a rule conflicts with `/AGENTS.md`, follow the 8-level priority in AGENTS.md §100.
- AI agents MUST read the relevant `rules/<module>.md` before writing code in that module.