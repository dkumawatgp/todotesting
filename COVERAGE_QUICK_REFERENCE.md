# Coverage Quick Reference

## 🚀 Quick Start

```bash
# Generate all coverage reports
npm run test:coverage:all

# View HTML reports
open coverage/frontend/index.html
open coverage/backend/index.html
```

---

## 📊 Coverage Types Explained Simply

### 1. **Line Coverage** 📝
**What:** How many lines of code were executed?

**Example:**
```javascript
function add(a, b) {
  return a + b;  // ✅ This line was executed
}
// If tested: 100% line coverage
// If not tested: 0% line coverage
```

**In your app:** Shows which lines need tests (red = not tested)

---

### 2. **Function Coverage** 🔧
**What:** How many functions were called?

**Example:**
```javascript
function add() { ... }      // ✅ Called in tests
function subtract() { ... }  // ✅ Called in tests
function multiply() { ... } // ❌ Never called
// Function Coverage: 2/3 = 66.7%
```

**In your app:** Shows which functions need tests

---

### 3. **Branch Coverage** 🌳
**What:** How many if/else paths were tested?

**Example:**
```javascript
if (user.isAdmin) {
  return 'Admin';     // ✅ Tested with admin user
} else {
  return 'User';      // ✅ Tested with regular user
}
// Branch Coverage: 2/2 = 100%

// But if you only test admin:
// Branch Coverage: 1/2 = 50% ❌
```

**In your app:** Shows if you tested both success AND error cases

---

## 📈 What Good Coverage Looks Like

| Coverage Type | Excellent | Good | Needs Work |
|--------------|-----------|------|------------|
| **Lines** | 90%+ | 80-90% | <80% |
| **Functions** | 95%+ | 85-95% | <85% |
| **Branches** | 85%+ | 75-85% | <75% |

---

## 🎯 Your Project Targets

**Frontend:**
- Lines: 70% minimum
- Functions: 70% minimum
- Branches: 60% minimum

**Backend:**
- Lines: 80% minimum
- Functions: 80% minimum
- Branches: 70% minimum

---

## 📋 Commands

```bash
# Frontend coverage
npm run test:coverage:frontend

# Backend coverage
npm run test:coverage:backend

# Both
npm run test:coverage:all

# With UI
npm run test:coverage:ui
```

---

## 🔍 Reading HTML Reports

1. **Open** `coverage/*/index.html` in browser
2. **See summary** at top with percentages
3. **Click files** to see line-by-line coverage
4. **Green** = covered ✅
5. **Red** = not covered ❌
6. **Yellow** = partially covered ⚠️

---

## 💡 Pro Tips

1. **Focus on branches** - hardest to achieve, most important
2. **Test error cases** - they're often uncovered
3. **Don't chase 100%** - some code is hard to test
4. **Use coverage to find gaps**, not as only metric

---

## 📚 Full Guide

See `COVERAGE_GUIDE.md` for detailed explanations and examples.
