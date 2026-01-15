import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../App'

describe('App - Integration Tests', () => {
  it('allow user to add a todo', async () => {
    const user = userEvent.setup()
    render(<App />)
    
    const input = screen.getByPlaceholderText('Add a new todo...')
    const addButton = screen.getByRole('button', { name: /add/i })   
    await user.type(input, 'Integration test todo')
    await user.click(addButton)    
    expect(screen.getByText('Integration test todo')).toBeInTheDocument()
  })

  it('allow user to toggle todo', async () => {
    const user = userEvent.setup()
    render(<App />)
    const input = screen.getByPlaceholderText('Add a new todo...')
    await user.type(input, 'Todo to toggle')
    await user.click(screen.getByRole('button', { name: /add/i }))
    const checkbox = screen.getByRole('checkbox', { name: /toggle todo: todo to toggle/i })
    expect(checkbox).not.toBeChecked()
    
    await user.click(checkbox)
    expect(checkbox).toBeChecked()
 
    await user.click(checkbox)
    expect(checkbox).not.toBeChecked()
  })

  it('allow user to delete a todo', async () => {
    const user = userEvent.setup()
    render(<App />)
  
    const input = screen.getByPlaceholderText('Add a new todo...')
    await user.type(input, 'Todo to delete')
    await user.click(screen.getByRole('button', { name: /add/i }))
    
    expect(screen.getByText('Todo to delete')).toBeInTheDocument()
    
    const deleteButton = screen.getByRole('button', { name: /delete todo: todo to delete/i })
    await user.click(deleteButton)
    
    expect(screen.queryByText('Todo to delete')).not.toBeInTheDocument()
  })

  it('updat stats when todos are added, completed, and deleted', async () => {
    const user = userEvent.setup()
    render(<App />)
    
    expect(screen.getByText(/no todos yet/i)).toBeInTheDocument()
    await user.type(screen.getByPlaceholderText('Add a new todo...'), 'Todo 1')
    await user.click(screen.getByRole('button', { name: /add/i }))
    
    expect(screen.getByText('Total: 1')).toBeInTheDocument()
    expect(screen.getByText('Active: 1')).toBeInTheDocument()
    expect(screen.getByText('Completed: 0')).toBeInTheDocument()
   
    await user.type(screen.getByPlaceholderText('Add a new todo...'), 'Todo 2')
    await user.click(screen.getByRole('button', { name: /add/i }))
    
    expect(screen.getByText('Total: 2')).toBeInTheDocument()
    expect(screen.getByText('Active: 2')).toBeInTheDocument()
    
    const checkbox1 = screen.getByRole('checkbox', { name: /toggle todo: todo 1/i })
    await user.click(checkbox1)
    
    expect(screen.getByText('Total: 2')).toBeInTheDocument()
    expect(screen.getByText('Active: 1')).toBeInTheDocument()
    expect(screen.getByText('Completed: 1')).toBeInTheDocument()
  })

  it('allowsuser to clear all todos', async () => {
    const user = userEvent.setup()
    render(<App />)
    
    await user.type(screen.getByPlaceholderText('Add a new todo...'), 'Active todo')
    await user.click(screen.getByRole('button', { name: /add/i }))   
    await user.type(screen.getByPlaceholderText('Add a new todo...'), 'Completed todo 1')
    await user.click(screen.getByRole('button', { name: /add/i }))   
    await user.type(screen.getByPlaceholderText('Add a new todo...'), 'Completed todo 2')
    await user.click(screen.getByRole('button', { name: /add/i }))   
    await user.click(screen.getByRole('checkbox', { name: /toggle todo: completed todo 1/i }))
    await user.click(screen.getByRole('checkbox', { name: /toggle todo: completed todo 2/i }))
    
    const clearButton = screen.getByText(/clear completed/i)
    await user.click(clearButton)
    
    expect(screen.getByText('Active todo')).toBeInTheDocument()
    expect(screen.queryByText('Completed todo 1')).not.toBeInTheDocument()
    expect(screen.queryByText('Completed todo 2')).not.toBeInTheDocument()
    expect(screen.getByText('Total: 1')).toBeInTheDocument()
    expect(screen.getByText('Active: 1')).toBeInTheDocument()
  })

  it('handle multiple operations', async () => {
    const user = userEvent.setup()
    render(<App />)
    
    
    await user.type(screen.getByPlaceholderText('Add a new todo...'), 'First')
    await user.click(screen.getByRole('button', { name: /add/i }))
    
    await user.type(screen.getByPlaceholderText('Add a new todo...'), 'Second')
    await user.click(screen.getByRole('button', { name: /add/i }))
    
    await user.type(screen.getByPlaceholderText('Add a new todo...'), 'Third')
    await user.click(screen.getByRole('button', { name: /add/i }))
    
  
    await user.click(screen.getByRole('checkbox', { name: /toggle todo: first/i }))
    
    await user.click(screen.getByRole('button', { name: /delete todo: second/i }))
    
    expect(screen.getByText('First')).toBeInTheDocument()
    expect(screen.queryByText('Second')).not.toBeInTheDocument()
    expect(screen.getByText('Third')).toBeInTheDocument()
    expect(screen.getByText('Total: 2')).toBeInTheDocument()
  })
})
