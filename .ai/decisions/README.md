# `.ai/decisions/`

Architecture Decision Records (ADRs). Per AGENTS.md §73, every architecture-impacting change MUST land a record here.

## Naming

```
NNNN-short-title.md
```

`NNNN` is monotonically increasing 4-digit zero-padded number.

## Template

```md
# NNNN — <Title>

## Status
Proposed | Accepted | Superseded by NNNN | Deprecated

## Context
<why this decision is needed>

## Options
<alternatives considered>

## Decision
<chosen>

## Reason
<why this option>

## Trade-offs
<what we accept>

## Consequences
<follow-ups>
```

## Rules

- ADRs are append-only. Once accepted, never edit in place — write a superseding ADR.
- AI agents MUST read this directory before proposing any architectural change (AGENTS.md §75).