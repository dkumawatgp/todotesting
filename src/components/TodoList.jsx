import TodoItem from './TodoItem'
import './TodoList.css'

function TodoList({ todos, onToggle, onEdit, onDelete, onClearCompleted }) {
  const completedCount = todos.filter((todo) => todo.completed).length
  const activeCount = todos.length - completedCount

  if (todos.length === 0) {
    return (
      <div className="todo-list-empty" data-testid="todo-list-empty">
        <p>No todos yet. Add one above!</p>
      </div>
    )
  }

  return (
    <div className="todo-list" data-testid="todo-list">
      <div className="todo-stats" data-testid="todo-stats">
        <span>Total: {todos.length}</span>
        <span>Active: {activeCount}</span>
        <span>Completed: {completedCount}</span>
      </div>
      <ul className="todo-items" data-testid="todo-items">
        {todos.map((todo) => (
          <TodoItem
            key={todo.id}
            todo={todo}
            onToggle={onToggle}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </ul>
      {completedCount > 0 && (
        <button
          onClick={onClearCompleted}
          className="clear-completed-button"
          data-testid="clear-completed-button"
        >
          Clear Completed ({completedCount})
        </button>
      )}
    </div>
  )
}

export default TodoList
