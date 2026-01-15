# Test Coverage Guide

## What is Test Coverage?

**Test Coverage** measures how much of your code is executed when tests run. It helps identify:
- Which parts of your code are tested
- Which parts need more tests
- Overall code quality and test completeness

---

## Types of Coverage

### 1. 📊 **Line Coverage** (Statement Coverage)

**Definition:** Percentage of executable lines of code that were executed during tests.

**What it measures:**
- Whether each line of code was run at least once
- Helps find completely untested code

**Example:**
```javascript
function calculateTotal(items) {
  let total = 0;           // ✅ Line 1: Covered
  for (let item of items) { // ✅ Line 2: Covered
    total += item.price;    // ✅ Line 3: Covered (if items.length > 0)
  }                         // ✅ Line 4: Covered
  return total;             // ✅ Line 5: Covered
}

// If you test with empty array: Line 3 is NOT covered
// Line Coverage: 4/5 = 80%
```

**In Your Todo App:**
- If you test `addTodo()` but never test the error handling, those error lines aren't covered
- Line coverage shows which lines need tests

---

### 2. 🔧 **Function Coverage** (Function/Method Coverage)

**Definition:** Percentage of functions/methods that were called at least once during tests.

**What it measures:**
- Whether each function was invoked
- Helps find completely unused functions

**Example:**
```javascript
// You have 5 functions:
function addTodo() { ... }      // ✅ Tested
function deleteTodo() { ... }   // ✅ Tested
function editTodo() { ... }     // ✅ Tested
function toggleTodo() { ... }   // ✅ Tested
function clearCompleted() { ... } // ❌ Never tested

// Function Coverage: 4/5 = 80%
```

**In Your Todo App:**
- If you test all CRUD operations but never test `clearCompleted()`, function coverage will be less than 100%
- Function coverage helps ensure all features are tested

---

### 3. 🌳 **Branch Coverage** (Decision Coverage)

**Definition:** Percentage of conditional branches (if/else, switch cases, ternary operators) that were executed.

**What it measures:**
- Whether both `true` and `false` paths of conditions were tested
- Helps find untested error paths and edge cases

**Example:**
```javascript
function processTodo(todo) {
  if (todo.completed) {        // Branch 1: true path
    return 'Done';             // ✅ Covered if you test with completed: true
  } else {                     // Branch 1: false path
    if (todo.text.length > 0) { // Branch 2: true path
      return 'Active';         // ✅ Covered if you test with text
    } else {                   // Branch 2: false path
      return 'Empty';          // ❌ NOT covered if you never test empty text
    }
  }
}

// Branch Coverage: 3/4 = 75%
// Missing: else path of inner if
```

**In Your Todo App:**
- If you test successful API calls but never test error cases (404, 400), branch coverage will be low
- Branch coverage ensures both success and error paths are tested

---

### 4. 📝 **Statement Coverage** (Similar to Line Coverage)

**Definition:** Percentage of statements executed during tests.

**Note:** Very similar to line coverage, but counts statements rather than lines.

---

## Coverage Metrics Explained

### Coverage Percentage

```
Lines:       85.5% (342/400 lines)
Functions:   90.0% (45/50 functions)
Branches:    75.0% (60/80 branches)
Statements:  85.5% (342/400 statements)
```

**What this means:**
- **85.5% Line Coverage**: 342 out of 400 lines were executed
- **90% Function Coverage**: 45 out of 50 functions were called
- **75% Branch Coverage**: 60 out of 80 decision branches were tested
- **85.5% Statement Coverage**: 342 out of 400 statements executed

---

## Coverage Reports in Your Project

### Generating Coverage Reports

```bash
# Frontend coverage only
npm run test:coverage:frontend

# Backend coverage only
npm run test:coverage:backend

# Both frontend and backend
npm run test:coverage:all

# Generate and view reports
npm run test:coverage:report
```

### Report Locations

- **Frontend Coverage**: `coverage/frontend/`
- **Backend Coverage**: `coverage/backend/`
- **HTML Reports**: Open `coverage/*/index.html` in browser

### Report Types Generated

1. **Text Report** (`text`): Console output showing percentages
2. **JSON Report** (`json`): Machine-readable data
3. **HTML Report** (`html`): Interactive web page with line-by-line coverage
4. **LCOV Report** (`lcov`): Standard format for CI/CD tools
5. **JSON Summary** (`json-summary`): Summary statistics

---

## Understanding Coverage Reports

### HTML Report Features

When you open `coverage/*/index.html`:

1. **Summary Page**: Shows overall coverage percentages
2. **File List**: Click any file to see detailed coverage
3. **Line-by-Line View**:
   - 🟢 **Green**: Line is covered (executed)
   - 🔴 **Red**: Line is not covered (never executed)
   - 🟡 **Yellow**: Line is partially covered (branch not fully tested)

### Example HTML Report View

```
src/components/TodoItem.jsx
├─ Line 5:  ✅ Covered (executed 3 times)
├─ Line 10: ✅ Covered (executed 3 times)
├─ Line 15: ⚠️  Partially covered (if branch tested, else not)
├─ Line 20: ❌ Not covered (error handling never tested)
└─ Line 25: ✅ Covered (executed 5 times)
```

---

## Coverage Thresholds

Your project has minimum coverage thresholds:

### Frontend Thresholds
- **Lines**: 70%
- **Functions**: 70%
- **Branches**: 60%
- **Statements**: 70%

### Backend Thresholds
- **Lines**: 80%
- **Functions**: 80%
- **Branches**: 70%
- **Statements**: 80%

**What this means:**
- If coverage falls below these thresholds, tests will fail
- This ensures code quality standards
- You can adjust thresholds in `vite.config.js` and `vitest.config.js`

---

## Real Examples from Your Todo App

### Example 1: Line Coverage

```javascript
// server/routes/todoRoutes.js
router.get('/:id', async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id)  // ✅ Line covered
    
    if (!todo) {                                      // ✅ Line covered
      return res.status(404).json({                  // ⚠️ Line covered IF you test 404
        success: false,
        error: 'Todo not found'
      })
    }
    
    res.json({ success: true, data: todo })          // ✅ Line covered
  } catch (error) {
    if (error.name === 'CastError') {                // ❌ Line NOT covered if you never test invalid ID
      return res.status(400).json({ ... })
    }
    res.status(500).json({ ... })                    // ❌ Line NOT covered if you never test server errors
  }
})
```

**To improve line coverage:**
- Test 404 case (todo not found)
- Test 400 case (invalid ID)
- Test 500 case (server error)

### Example 2: Branch Coverage

```javascript
// src/components/TodoItem.jsx
function TodoItem({ todo, onToggle, onDelete }) {
  if (todo.completed) {                    // Branch 1: true/false
    return <CompletedView />               // ✅ Tested if you test completed todos
  } else {
    return <ActiveView />                  // ✅ Tested if you test active todos
  }
  
  // But what about this?
  if (todo.text.length === 0) {            // Branch 2: true/false
    return <EmptyTodo />                   // ❌ Never tested if you never create empty todos
  }
}
```

**To improve branch coverage:**
- Test both completed and active todos
- Test edge cases (empty text, null values, etc.)

### Example 3: Function Coverage

```javascript
// src/services/api.js
class TodoAPI {
  getAllTodos() { ... }        // ✅ Covered
  createTodo() { ... }         // ✅ Covered
  updateTodo() { ... }        // ✅ Covered
  deleteTodo() { ... }        // ✅ Covered
  toggleTodo() { ... }         // ✅ Covered
  clearCompleted() { ... }     // ✅ Covered
  editTodo() { ... }          // ❌ NOT covered if you never test editing
}
```

**To improve function coverage:**
- Write tests for all functions
- Test both success and error cases

---

## Interpreting Coverage Results

### Good Coverage (80%+)
- ✅ Most code is tested
- ✅ Few untested edge cases
- ✅ High confidence in code quality

### Moderate Coverage (60-80%)
- ⚠️ Some code paths untested
- ⚠️ May have untested error handling
- ⚠️ Should improve before production

### Poor Coverage (<60%)
- ❌ Many untested code paths
- ❌ High risk of bugs
- ❌ Should add more tests

---

## Best Practices

1. **Aim for 80%+ coverage** for critical code
2. **Focus on branch coverage** - it's often the hardest to achieve
3. **Don't obsess over 100%** - some code (like error handlers) is hard to test
4. **Use coverage to find gaps**, not as the only quality metric
5. **Review uncovered lines** regularly to identify missing tests

---

## Coverage vs Quality

⚠️ **Important:** High coverage doesn't mean good tests!

- **100% coverage** with bad tests = False confidence
- **70% coverage** with good tests = Better quality

**Focus on:**
- Testing important business logic
- Testing error cases
- Testing edge cases
- Writing meaningful assertions

---

## Quick Reference

| Coverage Type | What It Measures | Good Target |
|--------------|------------------|-------------|
| **Line** | Lines executed | 80%+ |
| **Function** | Functions called | 85%+ |
| **Branch** | Decision paths tested | 75%+ |
| **Statement** | Statements executed | 80%+ |

---

## Commands Cheat Sheet

```bash
# Run tests with coverage
npm run test:coverage

# Frontend only
npm run test:coverage:frontend

# Backend only
npm run test:coverage:backend

# Both with report
npm run test:coverage:report

# View HTML reports
open coverage/frontend/index.html
open coverage/backend/index.html
```

---

## Next Steps

1. Run `npm run test:coverage:all`
2. Open the HTML reports in your browser
3. Identify uncovered lines (red/yellow)
4. Write tests for those areas
5. Aim to improve coverage gradually
