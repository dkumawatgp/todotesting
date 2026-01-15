# Pre-Commit Hooks Guide

## Overview

This project uses **Husky** and **lint-staged** to automatically run checks before commits. This ensures code quality and prevents broken code from being committed.

---

## What Are Pre-Commit Hooks?

**Pre-commit hooks** are scripts that run automatically before you commit code. If the checks fail, the commit is blocked.

**Benefits:**
- ✅ Prevents broken code from being committed
- ✅ Ensures tests pass before commit
- ✅ Maintains code quality standards
- ✅ Catches errors early

---

## Setup

### Initial Setup (One-time)

After installing dependencies, run:

```bash
npm install
npm run prepare
```

This sets up Husky and creates the `.husky` directory.

---

## What Runs on Pre-Commit?

When you run `git commit`, the following happens:

### 1. **Lint-Staged** (Runs on staged files only)
- Runs tests related to changed files
- Only tests files that were modified
- Faster than running all tests

### 2. **Full Test Suite**
- Runs all frontend tests
- Ensures nothing is broken
- Blocks commit if tests fail

---

## What Runs on Pre-Push?

When you run `git push`, the following happens:

### 1. **Frontend Tests**
- Runs all React component tests
- Runs integration tests

### 2. **API Tests**
- Runs all backend API tests
- Ensures API endpoints work correctly

**Note:** Pre-push is more comprehensive than pre-commit to catch issues before pushing to remote.

---

## Hooks Configuration

### Pre-Commit Hook (`.husky/pre-commit`)

```bash
# 1. Run lint-staged (tests on staged files)
npx lint-staged

# 2. Run all tests
npm run test -- --run
```

### Pre-Push Hook (`.husky/pre-push`)

```bash
# 1. Run all frontend tests
npm run test -- --run

# 2. Run all API tests
npm run test:api
```

### Lint-Staged Configuration (`package.json`)

```json
"lint-staged": {
  "*.{js,jsx}": [
    "vitest related --run",
    "git add"
  ],
  "server/**/*.js": [
    "vitest related --config vitest.config.js --run",
    "git add"
  ]
}
```

**What this does:**
- For frontend files (`.js`, `.jsx`): Runs tests related to changed files
- For backend files (`server/**/*.js`): Runs API tests related to changed files

---

## How It Works

### Example Workflow

1. **You make changes:**
   ```bash
   git add src/components/TodoItem.jsx
   git commit -m "Update TodoItem"
   ```

2. **Pre-commit hook runs:**
   - ✅ Checks if `TodoItem.jsx` has related tests
   - ✅ Runs those tests
   - ✅ Runs all tests to ensure nothing broke
   - ✅ If all pass → commit succeeds
   - ❌ If any fail → commit is blocked

3. **You push:**
   ```bash
   git push
   ```

4. **Pre-push hook runs:**
   - ✅ Runs all frontend tests
   - ✅ Runs all API tests
   - ✅ If all pass → push succeeds
   - ❌ If any fail → push is blocked

---

## Bypassing Hooks (Not Recommended)

### Skip Pre-Commit Hook

```bash
# Skip pre-commit (NOT recommended)
git commit --no-verify -m "Your message"
```

### Skip Pre-Push Hook

```bash
# Skip pre-push (NOT recommended)
git push --no-verify
```

**⚠️ Warning:** Only bypass hooks in emergencies. It defeats the purpose of quality checks.

---

## Customizing Hooks

### Add More Checks

Edit `.husky/pre-commit`:

```bash
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

# Your custom checks
echo "🔍 Running custom checks..."

# Example: Check for console.logs
if git diff --cached --name-only | xargs grep -l "console.log"; then
  echo "❌ Found console.log statements. Please remove them."
  exit 1
fi

# Run tests
npm run test -- --run
```

### Modify Lint-Staged

Edit `package.json`:

```json
"lint-staged": {
  "*.{js,jsx}": [
    "vitest related --run",
    "eslint --fix",  // Add ESLint
    "prettier --write",  // Add Prettier
    "git add"
  ]
}
```

---

## Troubleshooting

### Hook Not Running

1. **Check if Husky is installed:**
   ```bash
   ls -la .husky
   ```

2. **Reinstall Husky:**
   ```bash
   npm run prepare
   ```

3. **Check file permissions:**
   ```bash
   chmod +x .husky/pre-commit
   chmod +x .husky/pre-push
   ```

### Tests Failing in Hook

1. **Run tests manually:**
   ```bash
   npm run test -- --run
   ```

2. **Fix failing tests**

3. **Try committing again**

### Hook Too Slow

1. **Use lint-staged** (already configured) - only tests changed files
2. **Reduce test scope** - modify `lint-staged` config
3. **Skip hook temporarily** (not recommended):
   ```bash
   git commit --no-verify
   ```

---

## Best Practices

1. ✅ **Always run tests before committing** (hooks do this automatically)
2. ✅ **Fix failing tests immediately** - don't bypass hooks
3. ✅ **Keep hooks fast** - use lint-staged for staged files only
4. ✅ **Don't commit broken code** - hooks prevent this
5. ✅ **Review hook output** - understand what's being checked

---

## Common Scenarios

### Scenario 1: Quick Fix

```bash
# You fix a typo
git add src/components/TodoItem.jsx
git commit -m "Fix typo"
# ✅ Hook runs quickly (only tests TodoItem)
# ✅ Commit succeeds
```

### Scenario 2: Breaking Change

```bash
# You break a test
git add src/App.jsx
git commit -m "Update App"
# ❌ Hook runs tests
# ❌ Tests fail
# ❌ Commit blocked
# Fix tests, then commit again
```

### Scenario 3: Large Refactor

```bash
# You refactor multiple files
git add src/
git commit -m "Large refactor"
# ⏱️ Hook runs all tests (takes longer)
# ✅ All tests pass
# ✅ Commit succeeds
```

---

## Files Structure

```
.husky/
├── pre-commit      # Runs before commit
├── pre-push        # Runs before push
└── _/              # Husky internal files

package.json
└── lint-staged     # Configuration for staged files
```

---

## Summary

- **Pre-commit**: Quick checks on staged files + all tests
- **Pre-push**: Comprehensive checks (frontend + API tests)
- **Lint-staged**: Only tests changed files (faster)
- **Husky**: Manages git hooks
- **Purpose**: Prevent broken code from being committed

---

## Quick Reference

```bash
# Setup (one-time)
npm run prepare

# Normal workflow
git add .
git commit -m "Your message"  # Pre-commit runs
git push                       # Pre-push runs

# Skip hooks (not recommended)
git commit --no-verify
git push --no-verify
```
