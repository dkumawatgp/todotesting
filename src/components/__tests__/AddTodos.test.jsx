import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import AddTodo from '../AddTodo'


describe('AddTodo - Unit Testing by Deepak', () => {
  

    it('render screen' , ()=>{

        render(<AddTodo onAdd={vi.fn()} />)
        expect(screen.getByPlaceholderText('Add a new todo...')).toBeInTheDocument()

        // expect(screen.findAllByPlaceholderText('Add a new todo...'))
        expect(screen.getByRole('button', { name: /add/i })).toBeInTheDocument()
    })

    it('update innput field as user type ', async ()=>{

        const user = userEvent.setup()
        render(<AddTodo onAdd={vi.fn()} />)
        const input = screen.getByPlaceholderText('Add a new todo...')

        await user.type(input, 'New todo')

        expect(input).toHaveValue('New todo')

    })

    it('call add task fuction when user click add button', async ()=>{


        const user = userEvent.setup()
        const mockOnAdd = vi.fn()
        render(<AddTodo onAdd={mockOnAdd} />)
        const input = screen.getByPlaceholderText('Add a new todo...')
        const addButton = screen.getByRole('button', { name: /add/i })
        await user.type(input, 'New todo')
        await user.click(addButton)
        expect(mockOnAdd).toHaveBeenCalledTimes(1)
        expect(mockOnAdd).toHaveBeenCalledWith('New todo')


    })

    it('trim whitespace before onAdd fuction is called', async () => {
        const user = userEvent.setup()
        const mockOnAdd = vi.fn()
        render(<AddTodo onAdd={mockOnAdd} />)
        
        const input = screen.getByPlaceholderText('Add a new todo...')
        await user.type(input, '  Trimmed   ')
        await user.click(screen.getByRole('button', { name: /add/i }))
        
        expect(mockOnAdd).toHaveBeenCalledWith('Trimmed')
      })

})