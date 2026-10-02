# `.ai/prompts/`

LLM prompts used by AUI AI Engine. One file per role; versioned.

## Layout

```
prompts/
├── schema-generator.md       # natural-language → UISchema
├── validator.md              # "explain this error in human terms"
├── patch-author.md           # error + inspection → JSON Patch
├── repair.md                 # AI Repair loop prompt
├── inspector-explain.md      # `runtime.inspect()` → human summary
└── studio-copilot.md         # Studio conversational AI
```

## Rules

- Prompts MUST NOT leak secrets (password / token / cookie / private key) per AGENTS.md §66.
- Every prompt change that lands MUST be paired with at least one `.ai/golden/` regression case.
- Treat these as engineering artifacts: change them via PR, not ad-hoc.