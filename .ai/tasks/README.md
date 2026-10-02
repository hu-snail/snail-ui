# `.ai/tasks/`

WBS task execution scratchpad. Each L4 task card lives here while AI is the active executor.

## Layout

```
tasks/
├── active/
│   └── AUI-XXX-XXX-NNN.md     # currently in_progress
├── done/
│   └── AUI-XXX-XXX-NNN.md     # completed, archived for traceability
└── follow-up/
    └── AUI-XXX-XXX-NNN.md     # parked issues found during execution
```

## Card template

```md
# AUI-XXX-XXX-NNN — <Task Name>

## Task
<one-line objective>

## Context read
- [ ] AGENTS.md
- [ ] relevant /dev-docs/*.md
- [ ] relevant /packages/* contract

## Plan
<Minimal Changes>

## Files
- <list>

## Tests
- <plan>

## Acceptance
- [ ] <list>

## Forbidden
- <list>

## Status
TODO | IN_PROGRESS | REVIEW | DONE | BLOCKED
```

See `dev-docs/AUI-WBS-v1.0.md` for the L1/L2 task index.