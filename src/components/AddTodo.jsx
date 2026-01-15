import { useState } from 'react'
import './AddTodo.css'

function AddTodo({ onAdd }) {
  const [input, setInput] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (input.trim()) {
      onAdd(input)                      //test case failure happend trim was not there
     // onAdd(input.trim())
      setInput('')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="add-todo" data-testid="add-todo-form">
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Add a new todo..."
        className="add-todo-input"
        data-testid="add-todo-input"
      />
      <button type="submit" className="add-todo-button" data-testid="add-todo-button">
        Add
      </button>
    </form>
  )
}

export default AddTodo
