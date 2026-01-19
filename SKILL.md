---
name: git-release
description: Create consistent releases, changelogs, and GitHub releases. Use when preparing a tagged release, generating release notes, or bumping versions semantically.
license: MIT
compatibility: opencode
metadata:
  audience: maintainers
  workflow: github
permissions:
  read: allow
  write: ask
  shell: allow
---

# GitHub Release Expert

## When to Use Me
- User mentions "release", "tag", "changelog", "version bump", "prepare release", or "create new version"
- Current branch is main/master and has new commits since last tag

## Core Process (Follow Strictly in Order)
1. **Analyze Changes** 
   Run `git log --oneline $(git describe --tags --abbrev=0 HEAD^)..HEAD` to see commits since last tag. 
   Summarize in Conventional Commits style.

2. **Propose Version Bump** 
   Analyze commit types: 
   - Major (breaking): BREAKING CHANGE or feat with ! 
   - Minor: feat 
   - Patch: fix, refactor, docs, test, chore 
   Ask user to confirm proposed bump (e.g., 1.2.3 → 1.3.0).

3. **Generate Changelog** 
   Group commits by type. Use clean, professional language. 
   Output in markdown format suitable for GitHub Releases.

4. **Prepare Release Command** 
   Provide ready-to-run command: 
   ```bash
   gh release create vX.Y.Z --title "vX.Y.Z" --notes-file changelog.md