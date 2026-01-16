import { useState } from 'react'
import './AddTodo.css'

function AddTodo({ onAdd }) {
  const [input, setInput] = useState('')
  const [deadline, setDeadline] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (input.trim()) {
      onAdd(input.trim(), deadline || null)
      setInput('')
      setDeadline('')
    }
  }

  // Get minimum date (today) for deadline input
  const today = new Date().toISOString().split('T')[0]

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
      <div className="deadline-field-wrapper">
        <label htmlFor="deadline-input" className="deadline-label">
          Deadline
        </label>
        <input
          type="date"
          id="deadline-input"
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
          min={today}
          className="add-todo-deadline"
          data-testid="add-todo-deadline"
          title="Set deadline (optional)"
          placeholder="Select deadline"
        />
      </div>
      <button type="submit" className="add-todo-button" data-testid="add-todo-button">
        Add
      </button>
    </form>
  )
}

export default AddTodo
