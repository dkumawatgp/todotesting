# Testing Concepts: Stubs and Drivers

## Overview

**Stubs** and **Drivers** are types of **Test Doubles** - objects that replace real dependencies during testing to isolate the code being tested.

---

## 🔌 STUBS

### Definition
A **Stub** is a test double that provides **predefined responses** to method calls. It's used to **replace a dependency that is called BY the code being tested**.

### Characteristics:
- ✅ Returns **hardcoded/fake data**
- ✅ **Doesn't verify** how it's called
- ✅ Used to **isolate** the component under test
- ✅ **Simpler** than the real dependency

### When to Use:
- When you want to **control the input** from a dependency
- When the real dependency is **slow, unreliable, or unavailable**
- When you want to **test specific scenarios** (success, error, etc.)

### Example in Your Todo App:

```javascript
// Real API call (what we want to replace)
import todoAPI from './services/api'

// STUB: Replace the API with a stub that returns fake data
const todoAPIStub = {
  getAllTodos: vi.fn().mockResolvedValue([
    { _id: '1', text: 'Fake Todo 1', completed: false },
    { _id: '2', text: 'Fake Todo 2', completed: true }
  ]),
  createTodo: vi.fn().mockResolvedValue({ 
    _id: '3', 
    text: 'New Todo', 
    completed: false 
  }),
  deleteTodo: vi.fn().mockResolvedValue()
}

// Now test App component with stub
test('App loads todos from API', async () => {
  // Replace real API with stub
  vi.spyOn(todoAPI, 'getAllTodos').mockImplementation(
    todoAPIStub.getAllTodos
  )
  
  render(<App />)
  
  // App calls getAllTodos() - stub returns fake data
  await waitFor(() => {
    expect(screen.getByText('Fake Todo 1')).toBeInTheDocument()
  })
})
```

### Real-World Analogy:
Think of a **stub** like a **fake credit card reader** in a store:
- The cashier (your code) tries to charge the card
- The stub reader always says "approved" or "declined" (predefined response)
- You control what response the cashier gets
- You're testing if the cashier handles the response correctly

---

## 🚗 DRIVERS

### Definition
A **Driver** is a test double that **calls the code being tested** and **verifies the results**. It's used to **test components that don't have a user interface** or to **simulate user interactions**.

### Characteristics:
- ✅ **Calls** the code being tested
- ✅ **Verifies** the output/results
- ✅ Used to **test lower-level components** from higher-level
- ✅ **More complex** - it orchestrates the test

### When to Use:
- When testing **functions/utilities** that don't have UI
- When you need to **simulate complex user workflows**
- When testing **integration** between components

### Example in Your Todo App:

```javascript
// DRIVER: Simulates user interactions to test the App component
function testDriver() {
  const user = userEvent.setup()
  const { container } = render(<App />)
  
  return {
    // Driver methods that interact with the app
    async addTodo(text) {
      const input = screen.getByPlaceholderText('Add a new todo...')
      await user.type(input, text)
      await user.click(screen.getByRole('button', { name: /add/i }))
    },
    
    async toggleTodo(text) {
      const checkbox = screen.getByLabelText(`Toggle todo: ${text}`)
      await user.click(checkbox)
    },
    
    async deleteTodo(text) {
      const deleteBtn = screen.getByLabelText(`Delete todo: ${text}`)
      await user.click(deleteBtn)
    },
    
    // Driver methods that verify results
    verifyTodoExists(text) {
      expect(screen.getByText(text)).toBeInTheDocument()
    },
    
    verifyTodoCount(count) {
      expect(screen.getByText(`Total: ${count}`)).toBeInTheDocument()
    }
  }
}

// Use the driver to test complex workflows
test('Complete user workflow with driver', async () => {
  const driver = testDriver()
  
  // Driver orchestrates the entire test
  await driver.addTodo('Buy milk')
  await driver.addTodo('Buy bread')
  driver.verifyTodoCount(2)
  
  await driver.toggleTodo('Buy milk')
  driver.verifyTodoExists('Buy milk')
  
  await driver.deleteTodo('Buy bread')
  driver.verifyTodoCount(1)
})
```

### Real-World Analogy:
Think of a **driver** like a **test pilot** for a new car:
- The pilot (driver) **operates** the car (your code)
- The pilot **verifies** if brakes work, steering responds, etc.
- The pilot **tests** the car's functionality
- You're testing if the car works correctly when operated

---

## 📊 Comparison Table

| Aspect | Stub | Driver |
|--------|------|--------|
| **Purpose** | Replace dependency that is CALLED BY code | Call and test code that doesn't have UI |
| **Direction** | Incoming (provides input) | Outgoing (calls code) |
| **Complexity** | Simple (returns data) | Complex (orchestrates test) |
| **Verification** | Doesn't verify calls | Verifies results |
| **Use Case** | Mock API responses | Test utility functions, workflows |

---

## 🎯 Practical Examples in Your Todo App

### Example 1: Stub for API Testing

```javascript
// Testing App.jsx - we stub the API service
import { vi } from 'vitest'
import todoAPI from './services/api'

test('App handles API error with stub', async () => {
  // STUB: Make API return an error
  const errorStub = vi.spyOn(todoAPI, 'getAllTodos')
    .mockRejectedValue(new Error('Network error'))
  
  render(<App />)
  
  // App calls getAllTodos() - stub returns error
  await waitFor(() => {
    expect(screen.getByText(/failed to load/i)).toBeInTheDocument()
  })
  
  errorStub.mockRestore()
})
```

### Example 2: Driver for Utility Function Testing

```javascript
// Testing a utility function that formats todos
function formatTodosForExport(todos) {
  return todos.map(t => `${t.completed ? '✓' : '○'} ${t.text}`).join('\n')
}

// DRIVER: Tests the utility function
test('formatTodosForExport formats correctly', () => {
  const todos = [
    { text: 'Todo 1', completed: true },
    { text: 'Todo 2', completed: false }
  ]
  
  // Driver calls the function and verifies output
  const result = formatTodosForExport(todos)
  
  expect(result).toBe('✓ Todo 1\n○ Todo 2')
})
```

### Example 3: Stub + Driver Together

```javascript
// Testing App with both stub and driver
test('Complete workflow with stub and driver', async () => {
  // STUB: Replace API with fake data
  vi.spyOn(todoAPI, 'getAllTodos').mockResolvedValue([
    { _id: '1', text: 'Existing Todo', completed: false }
  ])
  
  // DRIVER: Interact with the app
  const driver = testDriver()
  await driver.addTodo('New Todo')
  
  // Verify both stub data and driver actions
  driver.verifyTodoExists('Existing Todo') // From stub
  driver.verifyTodoExists('New Todo')      // From driver
  driver.verifyTodoCount(2)
})
```

---

## 🔑 Key Takeaways

1. **Stub** = Fake dependency that **provides data** to your code
   - "Give me fake data so I can test my code"
   
2. **Driver** = Test code that **calls and verifies** your code
   - "Let me test your code and check if it works"

3. **Both are Test Doubles** - they replace real dependencies

4. **Use Stubs** when you need to control input from dependencies

5. **Use Drivers** when you need to test code without UI or complex workflows

---

## 📚 Related Concepts

- **Mocks**: Like stubs, but also **verify how they're called**
- **Spies**: **Track calls** to real functions without replacing them
- **Fakes**: **Simplified implementations** of real dependencies

---

## 💡 Memory Trick

- **STUB** = **S**upplies **T**est **U**tility **B**ackend (provides data)
- **DRIVER** = **D**rives **R**esults **I**n **V**erification **E**xecution (calls code)

Or simpler:
- **Stub** = **S**tands **T**here (passive, provides data)
- **Driver** = **D**oes **I**t (active, calls code)
