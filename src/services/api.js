import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api'

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

apiClient.interceptors.request.use(
  (config) => {
    // You can add auth tokens or other headers here
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => {
    return response.data
  },
  (error) => {
    const errorMessage = error.response?.data?.error || error.message || 'API request failed'
    console.error('API Error:', errorMessage)
    return Promise.reject(new Error(errorMessage))
  }
)

class TodoAPI {
  async getAllTodos() {
    const response = await apiClient.get('/todos')
    return response.data || []
  }

  async getTodoById(id) {
    const response = await apiClient.get(`/todos/${id}`)
    return response.data
  }

  async createTodo(text) {
    const response = await apiClient.post('/todos', { text })
    return response.data
  }

  async updateTodo(id, updates) {
    const response = await apiClient.put(`/todos/${id}`, updates)
    return response.data
  }

  async editTodo(id, text) {
    const response = await apiClient.put(`/todos/${id}`, { text })
    return response.data
  }

  async toggleTodo(id) {
    const response = await apiClient.patch(`/todos/${id}/toggle`)
    return response.data
  }

  async deleteTodo(id) {
    await apiClient.delete(`/todos/${id}`)
  }

  async clearCompleted() {
    const response = await apiClient.delete('/todos')
    return response.data
  }
}

export default new TodoAPI()
