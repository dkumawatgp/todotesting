import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import AddTodo from '../AddTodo'

describe('AddTodo - Unit Tests', () => {
  it('render input and button', () => {
    render(<AddTodo onAdd={vi.fn()} />)
    expect(screen.getByPlaceholderText('Add a new todo...')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /add/i })).toBeInTheDocument()
  })

  it('update input value when user type', async () => {
    const user = userEvent.setup()
    render(<AddTodo onAdd={vi.fn()} />)   
    const input = screen.getByPlaceholderText('Add a new todo...')
    await user.type(input, 'New todo')
    
    expect(input).toHaveValue('New todo')
  })

  it('call onAdd with input value when form submitted', async () => {
    const user = userEvent.setup()
    const mockOnAdd = vi.fn()
    render(<AddTodo onAdd={mockOnAdd} />)
    const input = screen.getByPlaceholderText('Add a new todo...')
    const button = screen.getByRole('button', { name: /add/i })
    await user.type(input, 'New todo')
    await user.click(button)
    
    expect(mockOnAdd).toHaveBeenCalledTimes(1)
    expect(mockOnAdd).toHaveBeenCalledWith('New todo')
  })

  it('calls onAdd when Enter key is pressed', async () => {
    const user = userEvent.setup()
    const mockOnAdd = vi.fn()
    render(<AddTodo onAdd={mockOnAdd} />)
    
    const input = screen.getByPlaceholderText('Add a new todo...')
    await user.type(input, 'New todo{Enter}')
    
    expect(mockOnAdd).toHaveBeenCalledTimes(1)
    expect(mockOnAdd).toHaveBeenCalledWith('New todo')
  })

  it('clear input after submitting', async () => {
    const user = userEvent.setup()
    const mockOnAdd = vi.fn()
    render(<AddTodo onAdd={mockOnAdd} />)   
    const input = screen.getByPlaceholderText('Add a new todo...')
    await user.type(input, 'New todo')
    await user.click(screen.getByRole('button', { name: /add/i }))
    
    expect(input).toHaveValue('')
  })

  it('do not call onAdd when input is empty', async () => {
    const user = userEvent.setup()
    const mockOnAdd = vi.fn()
    render(<AddTodo onAdd={mockOnAdd} />)  
    const button = screen.getByRole('button', { name: /add/i })
    await user.click(button)  
    expect(mockOnAdd).not.toHaveBeenCalled()
  })

  it('do not call onAdd when input only contains whitespace', async () => {
    const user = userEvent.setup()
    const mockOnAdd = vi.fn()
    render(<AddTodo onAdd={mockOnAdd} />)    
    const input = screen.getByPlaceholderText('Add a new todo...')
    await user.type(input, '   ')
    await user.click(screen.getByRole('button', { name: /add/i }))  
    expect(mockOnAdd).not.toHaveBeenCalled()
  })

  it('trim whitespace from input before calling onAdd', async () => {
    const user = userEvent.setup()
    const mockOnAdd = vi.fn()
    render(<AddTodo onAdd={mockOnAdd} />) 
    const input = screen.getByPlaceholderText('Add a new todo...')
    await user.type(input, '  Trimmed todo  ')
    await user.click(screen.getByRole('button', { name: /add/i }))   
    expect(mockOnAdd).toHaveBeenCalledWith('Trimmed todo')
  })
})
