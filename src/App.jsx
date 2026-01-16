import { useState, useEffect } from 'react'
import TodoList from './components/TodoList'
import AddTodo from './components/AddTodo'
import todoAPI from './services/api'
import './App.css'

function App() {
  const [todos, setTodos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Load todos from API on mount
  useEffect(() => {
    loadTodos()
  }, [])

  const loadTodos = async () => {
    try {
      setLoading(true)
      setError(null)
      const todosData = await todoAPI.getAllTodos()
      // Map MongoDB _id to id for compatibility
      setTodos(todosData.map(todo => ({
        id: todo._id,
        text: todo.text,
        completed: todo.completed,
        createdAt: todo.createdAt,
        deadline: todo.deadline,
      })))
    } catch (err) {
      setError('Failed to load todos. Make sure the server is running.')
      console.error('Error loading todos:', err)
    } finally {
      setLoading(false)
    }
  }

  const addTodo = async (text, deadline) => {
    try {
      const newTodo = await todoAPI.createTodo(text, deadline)
      setTodos([...todos, {
        id: newTodo._id,
        text: newTodo.text,
        completed: newTodo.completed,
        createdAt: newTodo.createdAt,
        deadline: newTodo.deadline,
      }])
    } catch (err) {
      setError('Failed to add todo')
      console.error('Error adding todo:', err)
    }
  }

  const toggleTodo = async (id) => {
    try {
      const updatedTodo = await todoAPI.toggleTodo(id)
      setTodos(
        todos.map((todo) =>
          todo.id === id
            ? { ...todo, completed: updatedTodo.completed }
            : todo
        )
      )
    } catch (err) {
      setError('Failed to update todo')
      console.error('Error toggling todo:', err)
    }
  }

  const editTodo = async (id, newText, deadline = null) => {
    try {
      const updatedTodo = await todoAPI.editTodo(id, newText, deadline)
      setTodos(
        todos.map((todo) =>
          todo.id === id
            ? { ...todo, text: updatedTodo.text, deadline: updatedTodo.deadline }
            : todo
        )
      )
    } catch (err) {
      setError('Failed to edit todo')
      console.error('Error editing todo:', err)
    }
  }

  const deleteTodo = async (id) => {
    try {
      await todoAPI.deleteTodo(id)
      setTodos(todos.filter((todo) => todo.id !== id))
    } catch (err) {
      setError('Failed to delete todo')
      console.error('Error deleting todo:', err)
    }
  }

  const clearCompleted = async () => {
    try {
      await todoAPI.clearCompleted()
      setTodos(todos.filter((todo) => !todo.completed))
    } catch (err) {
      setError('Failed to clear completed todos')
      console.error('Error clearing completed:', err)
    }
  }

  if (loading) {
    return (
      <div className="app">
        <header className="app-header">
          <h1>MY GP DIARY</h1>
         
        </header>
        <main className="app-main">
          <p>Loading todos...</p>
        </main>
      </div>
    )
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>MY GP DIARY</h1>
        
      </header>
      <main className="app-main">
        {error && (
          <div style={{ 
            padding: '10px', 
            marginBottom: '10px', 
            background: '#ffebee', 
            color: '#c62828', 
            borderRadius: '4px' 
          }}>
            {error}
          </div>
        )}
        <AddTodo onAdd={addTodo} />
        <TodoList
          todos={todos}
          onToggle={toggleTodo}
          onEdit={editTodo}
          onDelete={deleteTodo}
          onClearCompleted={clearCompleted}
        />
      </main>
    </div>
  )
}

export default App
