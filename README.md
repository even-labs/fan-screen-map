# EVEN Fan App — Screen Map & E2E Flow Proposal

DRAFT v0.1.0 — Pending leadership review

## What is this?

A visual document that maps every fan-facing screen in **even-web** (legacy fan app) and proposes E2E test flows for the **E2E Validation Gate** initiative.

Built from a local stack investigation (even-web + even-back Docker with staging DB). All findings are proven, not assumed.

## Why?

Before writing E2E tests, the team needs to agree on:
1. **Screen names** — consistent terminology across tickets, PRs, tests, and docs
2. **Test scope** — which flows matter most (P0 revenue, P1 auth, P2 features)
3. **Blockers** — what external dependencies need mocking or test mode
4. **Priority** — what to test first vs what can wait

Same approach used for [Backstage Screen Map](https://even-labs.github.io/backstage-screen-map/).

## Stats

- ~52 screens across 8 domains
- 31 E2E flow storyboards (P0: 4, P1: 6, P2: 12, P3: 9)
- 7 blockers documented with mitigations
- 10 local investigation findings (proven)
- 3-phase rollout plan

## Local development

```bash
# Just open in browser — no build step
open index.html

# Or serve locally
npx serve .
```

## Screenshot capture

```bash
# Requires even-web + even-back running locally
E2E_AUTH_BYPASS_SECRET=<secret> npx playwright test scripts/screen-map-capture.spec.ts
```

## Related documents

- PRD: [E2E Validation Gate — even-web](../notes/projects/even-web/prd-e2e-validation-gate.md)
- PRD: [even-web Migration to App Router](../notes/projects/even-web/prd-migration-readiness.md)
- Proposal: [Staging-First Gitflow](../notes/projects/even-web/proposal-staging-first-gitflow.md)
- Reference: [Backstage Screen Map](https://even-labs.github.io/backstage-screen-map/)

## Changelog

- v0.1.0 (2026-04-08): Initial draft — taxonomy, 31 flows, investigation findings, phased rollout
