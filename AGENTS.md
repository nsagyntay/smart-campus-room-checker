Project
Smart Campus room availability checker with fictional room and booking data.

Constraints
Preserve AC1–AC6 and existing booking behavior.
No backend, login, database, or booking creation.

Engineering rules
Prefer pure functions and minimal changes.
Use at most two justified patterns.
Do not mutate booking fixtures.
Keep existing responsive UI and feedback.
Use a shared test utility module to remove duplicated cloneRoom helpers.

Verification
Run existing tests and add focused regression tests.
Report changed files, rationale, and test evidence.
