/**
 * PRACTICAL EXAMPLES: Stubs and Drivers in Todo App
 * 
 * This file demonstrates stubs and drivers with real examples
 * from your todo application.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../../src/App.jsx'
import todoAPI from '../../src/services/api.js'

// ============================================
// EXAMPLE 1: STUB - Mocking API Responses
// ============================================

describe('STUB Examples', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('Example 1: Stub API to return fake todos', async () => {
    // STUB: Replace real API call with fake data
    const stubTodos = [
      { _id: '1', text: 'Stub Todo 1', completed: false, createdAt: new Date() },
      { _id: '2', text: 'Stub Todo 2', completed: true, createdAt: new Date() }
    ]

    // Create stub that returns fake data
    vi.spyOn(todoAPI, 'getAllTodos').mockResolvedValue(stubTodos)

    render(<App />)

    // App calls getAllTodos() - stub provides fake data
    await waitFor(() => {
      expect(screen.getByText('Stub Todo 1')).toBeInTheDocument()
      expect(screen.getByText('Stub Todo 2')).toBeInTheDocument()
    })
  })

  it('Example 2: Stub API to simulate error', async () => {
    // STUB: Make API return an error
    vi.spyOn(todoAPI, 'getAllTodos').mockRejectedValue(
      new Error('Network error')
    )

    render(<App />)

    // App handles the error from stub
    await waitFor(() => {
      expect(screen.getByText(/failed to load/i)).toBeInTheDocument()
    })
  })

  it('Example 3: Stub createTodo to return specific response', async () => {
    const user = userEvent.setup()
    
    // STUB: Control what createTodo returns
    const newTodo = { 
      _id: '999', 
      text: 'Stub Created Todo', 
      completed: false,
      createdAt: new Date()
    }
    
    vi.spyOn(todoAPI, 'getAllTodos').mockResolvedValue([])
    vi.spyOn(todoAPI, 'createTodo').mockResolvedValue(newTodo)

    render(<App />)

    // User adds todo - stub provides fake response
    const input = screen.getByPlaceholderText('Add a new todo...')
    await user.type(input, 'New Todo')
    await user.click(screen.getByRole('button', { name: /add/i }))

    // Verify stub data appears
    await waitFor(() => {
      expect(screen.getByText('Stub Created Todo')).toBeInTheDocument()
    })
  })
})

// ============================================
// EXAMPLE 2: DRIVER - Testing Utility Functions
// ============================================

// Utility function to test (no UI)
function calculateTodoStats(todos) {
  return {
    total: todos.length,
    completed: todos.filter(t => t.completed).length,
    active: todos.filter(t => !t.completed).length
  }
}

describe('DRIVER Examples', () => {
  it('Example 1: Driver tests utility function', () => {
    const todos = [
      { text: 'Todo 1', completed: true },
      { text: 'Todo 2', completed: false },
      { text: 'Todo 3', completed: true }
    ]

    // DRIVER: Calls the function and verifies results
    const stats = calculateTodoStats(todos)

    // Driver verifies the output
    expect(stats.total).toBe(3)
    expect(stats.completed).toBe(2)
    expect(stats.active).toBe(1)
  })

  it('Example 2: Driver orchestrates complex workflow', async () => {
    // DRIVER: Simulates complete user workflow
    const user = userEvent.setup()
    
    // Stub API first
    vi.spyOn(todoAPI, 'getAllTodos').mockResolvedValue([])
    vi.spyOn(todoAPI, 'createTodo').mockImplementation(async (text) => ({
      _id: Date.now().toString(),
      text,
      completed: false,
      createdAt: new Date()
    }))

    render(<App />)

    // DRIVER: Orchestrates multiple interactions
    // Step 1: Add first todo
    const input = screen.getByPlaceholderText('Add a new todo...')
    await user.type(input, 'First Todo')
    await user.click(screen.getByRole('button', { name: /add/i }))

    // Step 2: Add second todo
    await user.type(input, 'Second Todo')
    await user.click(screen.getByRole('button', { name: /add/i }))

    // Step 3: Toggle first todo
    const checkbox = screen.getByLabelText(/toggle todo: first todo/i)
    await user.click(checkbox)

    // DRIVER: Verifies final state
    expect(screen.getByText('First Todo')).toBeInTheDocument()
    expect(screen.getByText('Second Todo')).toBeInTheDocument()
    expect(screen.getByText('Total: 2')).toBeInTheDocument()
    expect(screen.getByText('Completed: 1')).toBeInTheDocument()
  })
})

// ============================================
// EXAMPLE 3: STUB + DRIVER Together
// ============================================

describe('Stub + Driver Combined', () => {
  it('Example: Stub provides data, Driver tests workflow', async () => {
    const user = userEvent.setup()

    // STUB: Provide initial fake data
    const initialTodos = [
      { _id: '1', text: 'Existing Todo', completed: false, createdAt: new Date() }
    ]
    vi.spyOn(todoAPI, 'getAllTodos').mockResolvedValue(initialTodos)
    vi.spyOn(todoAPI, 'createTodo').mockImplementation(async (text) => ({
      _id: '2',
      text,
      completed: false,
      createdAt: new Date()
    }))

    render(<App />)

    // Wait for stub data to load
    await waitFor(() => {
      expect(screen.getByText('Existing Todo')).toBeInTheDocument()
    })

    // DRIVER: Add new todo through UI
    const input = screen.getByPlaceholderText('Add a new todo...')
    await user.type(input, 'New Todo from Driver')
    await user.click(screen.getByRole('button', { name: /add/i }))

    // DRIVER: Verify both stub data and new data
    expect(screen.getByText('Existing Todo')).toBeInTheDocument() // From stub
    expect(screen.getByText('New Todo from Driver')).toBeInTheDocument() // From driver
    expect(screen.getByText('Total: 2')).toBeInTheDocument()
  })
})

// ============================================
// REAL-WORLD COMPARISON
// ============================================

/**
 * STUB ANALOGY:
 * 
 * Imagine you're testing a cashier at a store.
 * The cashier needs to process payments.
 * 
 * STUB = Fake credit card reader
 * - Always returns "approved" or "declined" (you control it)
 * - Cashier doesn't know it's fake
 * - You test if cashier handles the response correctly
 * 
 * Real: Cashier swipes card → Real bank → Real response
 * Stub: Cashier swipes card → Fake reader → Fake response (you control)
 */

/**
 * DRIVER ANALOGY:
 * 
 * Imagine you're testing a new car.
 * The car has various features.
 * 
 * DRIVER = Test pilot
 * - Test pilot operates the car (calls functions)
 * - Test pilot checks if brakes work (verifies results)
 * - Test pilot tests steering, acceleration, etc.
 * 
 * Real: User drives car → Car responds → User sees results
 * Driver: Test pilot drives car → Car responds → Test pilot verifies
 */
