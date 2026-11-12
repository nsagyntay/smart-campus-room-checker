# AI Evidence Appendix

## Assignment #04 — Smart Campus Room Availability Checker

---

## AI Tool

- **Tool name:** Bolt.new
- **Model:** Claude (Anthropic)
- **Platform:** Bolt.new (browser-based AI development environment)

---

## Dates

All work was performed on **2026-11-12** in a single session.

---

## Prompt Summaries

### Task #01 — Codebase Analysis

**Prompt summary:** "Analyze the existing Smart Campus Room Availability Checker. Identify three maintainability risks and create a prioritized improvement plan."

**AI output:** Identified three risks: (1) monolithic `App.tsx` with all logic inline, (2) duplicated time-input markup, (3) no filtering capability. Proposed a three-step plan: feature extension, refactoring, then testing. Suggested adding a Supabase database for booking persistence.

**Decision:** Accepted the three risks and the plan ordering. Rejected the Supabase suggestion because the assignment requires fictional data only with no databases.

**Verification:** Risks were confirmed by reading `App.tsx` (327 lines), `availability.ts`, and `sampleData.ts`. The duplicated time-input blocks were visible at three locations in `App.tsx`.

---

### Task #02 — Feature Extension

**Prompt summary:** "Add at least one more room (minimum four total). Each room must have an ID, name, capacity, equipment list, blocked status, and bookings. Add a capacity filter and an equipment filter. Show a clear message when no rooms match. Blocked rooms must never be available. Changing the selected room must refresh the result. Preserve all existing time validation and overlap rules. Use fictional data only."

**AI output:**
- Added `equipment: string[]` and `RoomFilter` to `types.ts`.
- Updated `sampleData.ts` with equipment on all rooms and added two new rooms (D410, E112), total five.
- Created `filterRooms.ts` with a pure filtering function.
- Rewrote `App.tsx` with filter controls, equipment badges, empty-state message, and room-change sync.

**Decision:** Accepted all changes. Verified that `availability.ts` and `availability.test.ts` were not modified.

**Verification:** Ran `npx vitest run` — 19/19 existing tests passed. Ran `npm run build` — succeeded. Manually verified F1–F5 by inspecting the UI logic in code.

---

### Task #03 — Refactoring

**Prompt summary:** "Refactor without changing behavior. Separate room data, availability rules, filtering logic, and UI presentation. Split App.tsx into RoomFilters, RoomSelector, RoomInfo, AvailabilityForm, and AvailabilityResult. Remove duplicated logic. Preserve all acceptance criteria and filtering requirements. Keep all five rooms unchanged. Provide BEFORE and AFTER Mermaid diagrams and two design decisions."

**AI output:**
- Created `src/lib/constants.ts` with `equipmentLabels` and time constants.
- Created 5 new components: `RoomFilters.tsx`, `RoomSelector.tsx`, `RoomInfo.tsx`, `AvailabilityForm.tsx` (with `TimeField` sub-component), `AvailabilityResult.tsx`.
- Reduced `App.tsx` from 460 to 168 lines.
- Provided Mermaid diagrams and two design decisions.

**Decision:** Accepted the component split. Noted that `TIME_MIN`, `TIME_MAX`, and `MAX_DURATION` in `constants.ts` are not imported by `availability.ts` — recorded as a remaining limitation.

**Verification:** Ran `npx vitest run` — 19/19 tests passed. Ran `npm run build` — 1,578 modules, succeeded. Confirmed `wc -l src/App.tsx` = 168 lines. Confirmed `availability.ts`, `sampleData.ts`, and all test files were unchanged.

---

### Task #04 — Automated Testing

**Prompt summary:** "Add automated regression tests. Preserve all 19 existing tests. Add tests for F1–F5 and boundary conditions (120 min, 121 min, touching, overlapping, exact capacity, insufficient capacity). Add at least one React integration test using Vitest and React Testing Library. Do not modify business rules. Run all tests and the build. Report actual results."

**AI output:**
- Installed `@testing-library/react`, `@testing-library/jest-dom`, `@testing-library/user-event`, and `jsdom`.
- Configured Vitest with `environment: 'jsdom'` and `setupFiles` in `vite.config.ts`.
- Created `src/test-setup.ts` with jest-dom matchers.
- Created `filterRooms.test.ts` (9 tests), `availability.extra.test.ts` (9 tests), `App.test.tsx` (6 tests).

**First test run:** 37 passed, 6 failed. Failures were caused by:
1. Duplicate DOM elements — the "no rooms match" message appears in both the form area and the right panel (fixed by using `getAllByText` instead of `getByText`).
2. Booking titles appearing in both the room info card and the timeline (fixed by using `getAllByText` for booking title assertions).
3. Missing `cleanup()` between tests causing duplicate DOM nodes (fixed by adding `afterEach(cleanup)`).

**Second test run:** 42 passed, 1 failed. The remaining failure was the `F5-BOOKINGS-UPDATE` test — "CS 201 — Algorithms" appeared in both the bookings list and the timeline. Fixed by switching to `getAllByText`.

**Third test run:** 43 passed, 0 failed.

**Decision:** No business logic was modified. All fixes were in the test files only.

**Verification:** Final `npx vitest run --reporter=verbose` output:
```
Test Files  4 passed (4)
     Tests  43 passed (43)
```

---

### Task #05 — Quality Evaluation

**Prompt summary:** "Compare the original and current versions. Create an evidence-based comparison table. Report only verified duplication reductions. Explain how each metric was obtained. Identify at least one real limitation."

**AI output:** Produced a comparison table with metrics obtained from `vitest` output, `wc -l`, and code inspection. Identified three limitations: unused constants, non-isolated integration tests, and no accessibility tests.

**Decision:** Accepted the report. Verified all line counts and test counts against actual command output.

**Verification:** Metrics confirmed by re-running `npx vitest run` (43/43) and `wc -l` on source files.

---

### Task #06 — Final Submission

**Prompt summary:** "Create README.md, ASSIGNMENT_REPORT.md, and AI_EVIDENCE.md. Include verified test results (43 passed, 0 failed, 4 test files). Record actual commands. Distinguish verified results from limitations. Run tests and build again. List all final submission files."

**AI output:** This document, plus `README.md` and `ASSIGNMENT_REPORT.md`.

**Verification:** Final test and build run executed after documentation creation — results recorded below.

---

## Verified Test Results

**Command:**
```bash
npm test
```

**Actual output (final run on 2026-11-12):**
```
Test Files  4 passed (4)
     Tests  43 passed (43)
```

**Breakdown by file:**

| Test file | Tests | Passed | Failed |
|-----------|-------|--------|--------|
| `src/lib/availability.test.ts` | 19 | 19 | 0 |
| `src/lib/availability.extra.test.ts` | 9 | 9 | 0 |
| `src/lib/filterRooms.test.ts` | 9 | 9 | 0 |
| `src/App.test.tsx` | 6 | 6 | 0 |
| **Total** | **43** | **43** | **0** |

---

## Verified Build Results

**Command:**
```bash
npm run build
```

**Actual output (final run on 2026-11-12):**
```
vite v5.4.8 building for production...
✓ 1578 modules transformed.
dist/index.html                   0.71 kB │ gzip:  0.39 kB
dist/assets/index-DWHYhRK8.css   15.15 kB │ gzip:  3.66 kB
dist/assets/index-CwN8prCH.js   164.31 kB │ gzip: 51.86 kB
✓ built in 9.15s
```

---

## Commands Used Throughout the Session

| Command | Purpose | Verified Result |
|---------|---------|-----------------|
| `npm install` | Install project dependencies | Success |
| `npm install -D @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom` | Install testing libraries | 51 packages added |
| `npm test` | Run all automated tests | 43 passed, 0 failed |
| `npm run build` | Create production build | 1,578 modules, no errors |
| `npx vitest run --reporter=verbose` | Run tests with per-test output | 43/43 passed, 4 test files |
| `wc -l src/App.tsx src/components/*.tsx src/lib/*.ts` | Count source lines | Confirmed App.tsx = 168 lines |

---

## Limitations Clearly Distinguished

The following are **verified limitations**, not speculation:

1. **Unused constants in `constants.ts`:** `TIME_MIN`, `TIME_MAX`, and `MAX_DURATION` are exported but not imported anywhere. `availability.ts` still uses hardcoded literals `0`, `1440`, and `120`. Confirmed by grep — no import statements reference these constants outside `constants.ts` itself.

2. **Integration tests are not component-isolated:** The six tests in `App.test.tsx` render the full `App` component. A failure in `RoomInfo.tsx` could cause a test targeting filter behavior to fail. Confirmed by reading `App.test.tsx` — all tests call `render(<App />)`.

3. **No accessibility or visual regression tests:** No tests check color contrast, keyboard navigation, or screen-reader behavior. Confirmed by inspecting all test files — none use accessibility testing utilities.

---

## Summary of Decisions

| Decision | Rationale |
|----------|-----------|
| Rejected Supabase database suggestion | Assignment requires fictional data only, no databases |
| Added 5 rooms (not just 4 minimum) | Provides richer filter testing scenarios |
| Used `getAllByText` in UI tests | The app intentionally renders some text in multiple locations (room card + timeline) |
| Did not wire constants into `availability.ts` | Would change business logic file — out of scope for refactoring task |
| Preserved all 19 original tests unchanged | Assignment required no modification of existing tests |
