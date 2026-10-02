# `.ai/tests/`

Cross-cutting AI behavior tests. Per WBS-TEST-001..008 and AGENTS.md §79-92.

## Layout

```
tests/
├── ai-eval/                  # LLM-quality regression on golden prompts
│   ├── dataset.json
│   └── cases/
└── e2e-scenarios/            # textual descriptions of expected end-user flows
    ├── create-page.md
    ├── bind-input.md
    ├── submit-form.md
    └── patch-error.md
```

## Rules

- Each `e2e-scenarios/*.md` describes intent + steps + expected outcome, NOT code.
- Real E2E code lives in `tests/e2e/` once Phase 2 components exist.
- `dataset.json` for `ai-eval/` MUST include render-success rate, patch-success rate, repair-success rate (WBS-AI-012).