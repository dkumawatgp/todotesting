# Setting Up Pre-Commit Hooks

## Quick Setup

### Step 1: Install Dependencies

```bash
npm install
```

This will install:
- `husky` - Git hooks manager
- `lint-staged` - Run commands on staged files

### Step 2: Initialize Husky

```bash
npm run prepare
```

This creates the `.husky` directory and sets up git hooks.

### Step 3: Verify Setup

```bash
ls -la .husky
```

You should see:
- `pre-commit` file
- `pre-push` file
- `_/` directory (Husky internal)

### Step 4: Test It

```bash
# Make a small change
echo "// test" >> src/App.jsx

# Stage it
git add src/App.jsx

# Try to commit
git commit -m "Test pre-commit hook"

# The hook should run automatically!
```

---

## What Happens Now?

### On `git commit`:
1. ✅ Runs tests on staged files (lint-staged)
2. ✅ Runs all frontend tests
3. ✅ Blocks commit if tests fail

### On `git push`:
1. ✅ Runs all frontend tests
2. ✅ Runs all API tests
3. ✅ Blocks push if tests fail

---

## Troubleshooting

### "Husky not found" error

```bash
# Reinstall Husky
npm run prepare
```

### "Permission denied" error

```bash
# Make hooks executable
chmod +x .husky/pre-commit
chmod +x .husky/pre-push
```

### Hooks not running

```bash
# Check if git hooks are enabled
git config core.hooksPath

# Should output: .husky
# If not, run:
git config core.hooksPath .husky
```

---

## Done! 🎉

Your pre-commit hooks are now set up. Every time you commit, tests will run automatically!
