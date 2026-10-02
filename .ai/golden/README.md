# `.ai/golden/`

Canonical Schema / Render / Patch examples that the AI regression harness re-runs on every protocol/runtime/contract change (AGENTS.md §76).

## Layout

```
golden/
├── schemas/
│   ├── valid/                # canonical renderable schemas
│   ├── invalid/              # schemas that must fail validation with predictable errors
│   ├── cross-platform/       # same schema, web + uni render parity
│   └── edge-cases/           # nested binding, deep children, capability fallback
├── patches/
│   ├── add/
│   ├── replace/
│   ├── remove/
│   ├── move/
│   └── rollback/             # patches that must be rejected / rolled back
└── renders/
    ├── button/
    ├── input/
    ├── form/
    └── card/
```

## Rules

- Each `golden/*` asset must be reproducible: a clean `pnpm turbo run test --filter @aui/golden` must pass.
- After any change to `packages/{protocol,schema,runtime,renderer}`, this suite MUST run before declaring DONE (AGENTS.md §77).