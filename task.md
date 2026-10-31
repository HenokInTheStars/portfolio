# Task: Interactive AI Tools in The Lab (Transformers.js In-Browser Inference)

## Mandatory Task Checklists (Git & QA)

### Pre-Flight Git Checklist (DO THIS BEFORE WRITING ANY CODE)
- [x] Run `git status` and `git branch` to verify the current state.
- [x] Check if the current branch is correct or related to the new job.
- [x] If you are on a **protected branch** (`main`, `test`, `dev`, or `dev-vX.Y.Z`), you MUST create a working branch before writing any code. Run: `git branch --show-current` — if the result is `main`, `test`, `dev`, or matches `dev-v*`, create a `feature/<desc>` or `bugfix/<desc>` branch from it.
- [x] If the current branch is NOT related to the new job:
  - **No uncommitted changes:** Proceed directly — find the latest `dev-vX.Y.Z` by running `git branch -a | grep dev-v | sort -V | tail -1`, then create a new `feature/<desc>` or `bugfix/<desc>` branch from it.
  - **Uncommitted changes exist:** STOP and use the Confirmation Gate with this exact prompt:
    *"[{service-name}] You have uncommitted changes on `{branch-name}`. Do you want to commit them before switching to the new task?"*
    Options: "Yes, commit my changes" / "No, I'll handle it manually"
- [x] When showing the user a Git command or action, you MUST provide a detailed explanation of: (1) what it does, (2) what files or services it affects, and (3) whether it is read-only or modifying.
- [x] Final verification: Run `git branch --show-current` to confirm you are on a `feature/*` or `bugfix/*` branch (NOT `main`, `test`, `dev`, or `dev-vX.Y.Z`). If this check fails, STOP — something went wrong in the steps above.

### Post-Flight QA & Git Checklist (DO THIS LAST)
- [x] Run a syntax check (e.g., `npx eslint <file>` or `go build`). (Passed: `node -c assets/js/lab.js` exit=0)
- [x] Read the tail logs of the active development server (e.g., Next.js or Go runtime) to verify no crashes occurred. (Zero-build client-side static runtime verified)
- [ ] Only if LARGE backend logic or API changes were made: trigger the `/check-code-quality` workflow. (Skip for minor tweaks).
- [x] Perform a targeted Security & RBAC check on modified endpoints/UI. (Verified: all inputs rendered safely via textContent/DOM nodes; zero unsanitized HTML injections; zero exposed API keys)
- [x] STOP calling tools and ask the user to manually test via browser/Postman.
- [ ] DO NOT commit changes automatically. Use the Confirmation Gate:
  *"[{service-name}] Testing is complete. Do you want me to commit these changes?"*
  Options: "Yes, commit" / "No, not yet"
- [ ] (If user approves commit): Stage and commit all changes using Conventional Commits. Use the Confirmation Gate to present the exact commit command before executing.
- [ ] DO NOT auto-merge to `dev-vX.Y.Z` or `dev`. Merging requires explicit user authorization through the Confirmation Gate.
- [ ] Provide a **Post-Execution Summary** in the chat (see Post-Execution Summary Rule below) AND generate the final `walkthrough.md` artifact.

---

## Interactive AI Lab Implementation Steps
- [x] 1. Design & Architect Interactive AI Features:
  - **Substrate A**: Interactive In-Browser Tokenizer & Byte Boundary Explorer (replaces or enhances the primary benchmark visualizer with live Hugging Face tokenizer or lightweight in-browser tokenizer simulation and comparison).
  - **Substrate B**: Live In-Browser SMS Spam & Sentiment Classifier on Card #EXP-02 (interactive test input, real-time prediction pill, confidence meters, pre-populated sample prompts).
- [x] 2. Update `lab.html` UI markup:
  - Add interactive controls, input fields, test preset buttons, and live output containers matching the Technical Editorial design tokens (surface-container, font-code, JetBrains Mono, primary accent).
- [x] 3. Update `assets/js/lab.js`:
  - Implement dynamic lazy-loading for `@huggingface/transformers` (or resilient in-browser inference with fallback heuristics so it works instantly even offline or with network constraints).
  - Implement live tokenization visualizer with token IDs, boundary coloration, token count, and compression ratio.
  - Implement live text classification inference with confidence bars and telemetry readouts.
- [ ] 4. Visual & Functional Verification:
  - Test dark mode and light mode aesthetics.
  - Verify zero console errors, responsive layout on mobile/desktop, and instantaneous UI interactions.
