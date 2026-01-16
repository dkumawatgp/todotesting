import { useState } from 'react'
import './TodoItem.css'

function TodoItem({ todo, onToggle, onDelete, onEdit }) {
  const [isEditing, setIsEditing] = useState(false)
  const [editText, setEditText] = useState(todo.text)
  const [editDeadline, setEditDeadline] = useState(
    todo.deadline ? new Date(todo.deadline).toISOString().split('T')[0] : ''
  )

  const formatDeadline = (deadline) => {
    if (!deadline) return null
    const date = new Date(deadline)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const deadlineDate = new Date(date)
    deadlineDate.setHours(0, 0, 0, 0)
    
    const diffTime = deadlineDate - today
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays < 0) {
      return { text: `Overdue by ${Math.abs(diffDays)} day${Math.abs(diffDays) !== 1 ? 's' : ''}`, isOverdue: true }
    } else if (diffDays === 0) {
      return { text: 'Due today', isDueToday: true }
    } else if (diffDays === 1) {
      return { text: 'Due tomorrow', isDueSoon: true }
    } else if (diffDays <= 7) {
      return { text: `Due in ${diffDays} days`, isDueSoon: true }
    } else {
      return { text: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) }
    }
  }

  const deadlineInfo = formatDeadline(todo.deadline)
  const today = new Date().toISOString().split('T')[0]

  const handleEdit = () => {
    if (isEditing) {
      // Save the edit
      if (editText.trim() && (editText !== todo.text || editDeadline !== (todo.deadline ? new Date(todo.deadline).toISOString().split('T')[0] : ''))) {
        onEdit(todo.id, editText.trim(), editDeadline || null)
      } else if (!editText.trim()) {
        // If empty, revert to original
        setEditText(todo.text)
        setEditDeadline(todo.deadline ? new Date(todo.deadline).toISOString().split('T')[0] : '')
      }
      setIsEditing(false)
    } else {
      // Start editing
      setIsEditing(true)
      setEditText(todo.text)
      setEditDeadline(todo.deadline ? new Date(todo.deadline).toISOString().split('T')[0] : '')
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleEdit()
    } else if (e.key === 'Escape') {
      setEditText(todo.text)
      setEditDeadline(todo.deadline ? new Date(todo.deadline).toISOString().split('T')[0] : '')
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
      <div className="todo-content">
        {isEditing ? (
          <div className="todo-edit-fields">
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
            <input
              type="date"
              value={editDeadline}
              onChange={(e) => setEditDeadline(e.target.value)}
              min={today}
              className="todo-edit-deadline"
              data-testid={`todo-edit-deadline-${todo.id}`}
              onKeyDown={handleKeyDown}
              onBlur={handleEdit}
            />
          </div>
        ) : (
          <>
            <span
              className="todo-text"
              data-testid={`todo-text-${todo.id}`}
              onDoubleClick={handleEdit}
              title="Double-click to edit"
            >
              {todo.text}
            </span>
            {deadlineInfo && (
              <span
                className={`todo-deadline ${
                  deadlineInfo.isOverdue
                    ? 'deadline-overdue'
                    : deadlineInfo.isDueToday
                    ? 'deadline-today'
                    : deadlineInfo.isDueSoon
                    ? 'deadline-soon'
                    : ''
                }`}
                data-testid={`todo-deadline-${todo.id}`}
              >
                📅 {deadlineInfo.text}
              </span>
            )}
          </>
        )}
      </div>
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
