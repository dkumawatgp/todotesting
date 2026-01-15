import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import TodoItem from '../TodoItem'

describe('TodoItem - Unit Tests', () => {
  const mockTodo = {
    id: 1,
    text: 'Test todo item',
    completed: false,
    createdAt: '2024-01-01T00:00:00.000Z',
  }

  it('renders todo text', () => {
    render(<TodoItem todo={mockTodo} onToggle={vi.fn()} onDelete={vi.fn()} />)
    expect(screen.getByText('Test todo item')).toBeInTheDocument()
  })

  it('render unchecked when todo is not completed', () => {
    render(<TodoItem todo={mockTodo} onToggle={vi.fn()} onDelete={vi.fn()} />)
    const checkbox = screen.getByRole('checkbox')
    expect(checkbox).not.toBeChecked()
  })

  it('render checked checkbox when todo is completed', () => {
    const completedTodo = { ...mockTodo, completed: true }
    render(<TodoItem todo={completedTodo} onToggle={vi.fn()} onDelete={vi.fn()} />)
    const checkbox = screen.getByRole('checkbox')
    expect(checkbox).toBeChecked()
  })

  it('apply completed class when todo is completed', () => {
    const completedTodo = { ...mockTodo, completed: true }
    const { container } = render(
      <TodoItem todo={completedTodo} onToggle={vi.fn()} onDelete={vi.fn()} />
    )
    const todoItem = container.querySelector('.todo-item')
    expect(todoItem).toHaveClass('completed')
  })

  it('call Toggle when checkbox is clicked', async () => {
    const user = userEvent.setup()
    const mockToggle = vi.fn()
    render(<TodoItem todo={mockTodo} onToggle={mockToggle} onDelete={vi.fn()} />)
    
    const checkbox = screen.getByRole('checkbox')
    await user.click(checkbox)
    
    expect(mockToggle).toHaveBeenCalledTimes(1)
    expect(mockToggle).toHaveBeenCalledWith(mockTodo.id)
  })

  it('call Delete when delete button is clicked', async () => {
    const user = userEvent.setup()
    const mockDelete = vi.fn()
    render(<TodoItem todo={mockTodo} onToggle={vi.fn()} onDelete={mockDelete} />)
    
    const deleteButton = screen.getByRole('button', { name: /delete todo/i })
    await user.click(deleteButton)
    
    expect(mockDelete).toHaveBeenCalledTimes(1)
    expect(mockDelete).toHaveBeenCalledWith(mockTodo.id)
  })

  it('has correct data-testid attributes', () => {
    render(<TodoItem todo={mockTodo} onToggle={vi.fn()} onDelete={vi.fn()} />)
    expect(screen.getByTestId(`todo-item-${mockTodo.id}`)).toBeInTheDocument()
    expect(screen.getByTestId(`todo-checkbox-${mockTodo.id}`)).toBeInTheDocument()
    expect(screen.getByTestId(`todo-text-${mockTodo.id}`)).toBeInTheDocument()
    expect(screen.getByTestId(`todo-delete-${mockTodo.id}`)).toBeInTheDocument()
  })
})
