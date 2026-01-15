import { useState } from 'react'
import './TodoItem.css'

function TodoItem({ todo, onToggle, onDelete, onEdit }) {
  const [isEditing, setIsEditing] = useState(false)
  const [editText, setEditText] = useState(todo.text)

  const handleEdit = () => {
    if (isEditing) {
      // Save the edit
      if (editText.trim() && editText !== todo.text) {
        onEdit(todo.id, editText.trim())
      } else if (!editText.trim()) {
        // If empty, revert to original
        setEditText(todo.text)
      }
      setIsEditing(false)
    } else {
      // Start editing
      setIsEditing(true)
      setEditText(todo.text)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleEdit()
    } else if (e.key === 'Escape') {
      setEditText(todo.text)
      setIsEditing(false)
    }
  }

  return (
    <li
      className={`todo-item ${todo.completed ? 'completed' : ''} ${isEditing ? 'editing' : ''}`}
      data-testid={`todo-item-${todo.id}`}
    >
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={() => onToggle(todo.id)}
        className="todo-checkbox"
        data-testid={`todo-checkbox-${todo.id}`}
        aria-label={`Toggle todo: ${todo.text}`}
        disabled={isEditing}
      />
      {isEditing ? (
        <input
          type="text"
          value={editText}
          onChange={(e) => setEditText(e.target.value)}
          onBlur={handleEdit}
          onKeyDown={handleKeyDown}
          className="todo-edit-input"
          data-testid={`todo-edit-input-${todo.id}`}
          autoFocus
        />
      ) : (
        <span
          className="todo-text"
          data-testid={`todo-text-${todo.id}`}
          onDoubleClick={handleEdit}
          title="Double-click to edit"
        >
          {todo.text}
        </span>
      )}
      <div className="todo-actions">
        <button
          onClick={handleEdit}
          className="todo-edit-button"
          data-testid={`todo-edit-${todo.id}`}
          aria-label={isEditing ? 'Save todo' : `Edit todo: ${todo.text}`}
          title={isEditing ? 'Save' : 'Edit'}
        >
          {isEditing ? '✓' : '✎'}
        </button>
        <button
          onClick={() => onDelete(todo.id)}
          className="todo-delete-button"
          data-testid={`todo-delete-${todo.id}`}
          aria-label={`Delete todo: ${todo.text}`}
          title="Delete"
        >
          ×
        </button>
      </div>
    </li>
  )
}

export default TodoItem
