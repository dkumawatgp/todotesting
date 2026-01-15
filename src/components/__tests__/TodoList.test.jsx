import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import TodoList from '../TodoList'

describe('TodoList - Unit Tests', () => {
  const mockTodos = [
    { id: 1, text: 'Todo 1', completed: false, createdAt: '2024-01-01T00:00:00.000Z' },
    { id: 2, text: 'Todo 2', completed: true, createdAt: '2024-01-01T00:00:00.000Z' },
    { id: 3, text: 'Todo 3', completed: false, createdAt: '2024-01-01T00:00:00.000Z' },
  ]

  it('render empty message when no todos', () => {
    render(
      <TodoList
        todos={[]}
        onToggle={vi.fn()}
        onDelete={vi.fn()}
        onClearCompleted={vi.fn()}
      />
    )
    expect(screen.getByText(/no todos yet/i)).toBeInTheDocument()
  })

  it('render all todos', () => {
    render(
      <TodoList
        todos={mockTodos}
        onToggle={vi.fn()}
        onDelete={vi.fn()}
        onClearCompleted={vi.fn()}
      />
    )
    expect(screen.getByText('Todo 1')).toBeInTheDocument()
    expect(screen.getByText('Todo 2')).toBeInTheDocument()
    expect(screen.getByText('Todo 3')).toBeInTheDocument()
  })

  it('display correct stats', () => {
    render(
      <TodoList
        todos={mockTodos}
        onToggle={vi.fn()}
        onDelete={vi.fn()}
        onClearCompleted={vi.fn()}
      />
    )
    expect(screen.getByText('Total: 3')).toBeInTheDocument()
    expect(screen.getByText('Active: 2')).toBeInTheDocument()
    expect(screen.getByText('Completed: 1')).toBeInTheDocument()
  })

  it('show clear completed button when there are completed todos', () => {
    render(
      <TodoList
        todos={mockTodos}
        onToggle={vi.fn()}
        onDelete={vi.fn()}
        onClearCompleted={vi.fn()}
      />
    )
    expect(screen.getByText(/clear completed \(1\)/i)).toBeInTheDocument()
  })

  it('do not show clear completed button when no completed todos', () => {
    const activeTodos = mockTodos.filter(todo => !todo.completed)
    render(
      <TodoList
        todos={activeTodos}
        onToggle={vi.fn()}
        onDelete={vi.fn()}
        onClearCompleted={vi.fn()}
      />
    )
    expect(screen.queryByText(/clear completed/i)).not.toBeInTheDocument()
  })

  it('calls onClearCompleted when clear button is clicked', async () => {
    const user = userEvent.setup()
    const mockClearCompleted = vi.fn()
    render(
      <TodoList
        todos={mockTodos}
        onToggle={vi.fn()}
        onDelete={vi.fn()}
        onClearCompleted={mockClearCompleted}
      />
    )
    
    const clearButton = screen.getByText(/clear completed/i)
    await user.click(clearButton)
    
    expect(mockClearCompleted).toHaveBeenCalledTimes(1)
  })
})
