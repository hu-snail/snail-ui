# `.ai/contracts/`

Component / Token / Action contract source-of-truth, mirror of `packages/{protocol,schema,tokens,runtime}` Zod definitions.

## Layout

```
contracts/
├── component/
│   ├── button.contract.json
│   ├── input.contract.json
│   ├── form.contract.json
│   └── card.contract.json
├── action/
│   └── action-registry.contract.json
└── token/
    └── token-cascade.contract.json
```

## Authoring rules

- Contract MUST be generated from Zod (one source of truth, per AGENTS.md §25).
- Each component contract includes `name` / `version` / `props` / `events` / `slots` / `tokens` / `accessibility` / `capabilities` / `ai` (AGENTS.md §31).
- These JSON snapshots are for AI consumption — DO NOT import them from TS code.