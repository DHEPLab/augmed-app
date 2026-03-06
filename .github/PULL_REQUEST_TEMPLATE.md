## SUMMARY

## TEST PLAN

---

## Release tag (optional)

When this PR is merged to `main`, a semantic tag will be created automatically. To control the version:

- **Option A:** Add a label to this PR: `release:vX.Y.Z` (e.g. `release:v1.2.3`). Create the label in the repo if it doesn’t exist.
- **Option B:** Add a line in this PR’s description: `Release: vX.Y.Z` (e.g. `Release: v1.2.3`).

If you don’t specify a version, the workflow will bump the patch from the latest tag (e.g. `v1.2.3` → `v1.2.4`).

---

## Pre-merge author checklist

- [ ] I've clearly explained:
  - [ ] What problem this PR is solving.
  - [ ] How this problem was solved.
  - [ ] How reviewers can test my changes.
- [ ] I've included tests I've run to ensure my changes work.
- [ ] I've added unit tests for any new code, if applicable.
- [ ] I've documented any added code.
