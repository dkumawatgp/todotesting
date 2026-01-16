import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest'
import request from 'supertest' // 🚗 DRIVER: This is the driver - it calls API endpoints
import mongoose from 'mongoose'
import app from '../index.js'
import Todo from '../models/Todo.js'

/**
 * STUBS AND DRIVERS IN THIS FILE:
 * 
 * DRIVER: `request(app)` from supertest
 *    - Calls the API endpoints (GET, POST, PUT, DELETE)
 *    - Verifies the responses
 *    - Acts as a test driver that orchestrates API calls
 * 
 * STUB: `new mongoose.Types.ObjectId()` 
 *    - Creates fake IDs for testing error cases
 *    - Provides predefined invalid IDs to test error handling
 */

describe('Todo API Tests', () => {
  let testTodoId

  beforeAll(async () => {
    // Connect to test database
    const MONGODB_URI = process.env.MONGODB_URI 
    await mongoose.connect(MONGODB_URI)
  })

  afterAll(async () => {
    // Clean up: delete all test data
    await Todo.deleteMany({})
    await mongoose.connection.close()
  })

  beforeEach(async () => {
    // Clear todos before each test
    await Todo.deleteMany({})
  })

  describe('GET /api/todos', () => {
    it('should return empty array when no todos exist', async () => {
      // 🚗 DRIVER: Calls the GET /api/todos endpoint
      //    - request(app) is the driver that makes the HTTP call
      //    - .get('/api/todos') calls the endpoint
      //    - .expect(200) verifies the response status
      const response = await request(app)
        .get('/api/todos')
        .expect(200)

      // 🚗 DRIVER: Verifies the response data
      expect(response.body.success).toBe(true)
      expect(response.body.count).toBe(0)
      expect(response.body.data).toEqual([])
    })

    it('should return all todos', async () => {
      // 🔌 STUB: Create fake test data
      //    - Todo.create() creates predefined test data (acts as stub)
      //    - This provides controlled input for testing
      const todo1 = await Todo.create({ text: 'Test Todo 1', completed: false })
      const todo2 = await Todo.create({ text: 'Test Todo 2', completed: true })

      // 🚗 DRIVER: Calls the API endpoint and verifies response
      const response = await request(app)
        .get('/api/todos')
        .expect(200)

      // 🚗 DRIVER: Verifies the API returned the stub data correctly
      expect(response.body.success).toBe(true)
      expect(response.body.count).toBe(2)
      expect(response.body.data).toHaveLength(2)
      expect(response.body.data[0].text).toBe('Test Todo 2') // Most recent first
    })
  })

  describe('POST /api/todos', () => {
    it('should create a new todo', async () => {
      // 🔌 STUB: Predefined test data to send to API
      const todoData = { text: 'New Todo Item' }

      // 🚗 DRIVER: Calls POST endpoint with stub data
      //    - .post('/api/todos') calls the create endpoint
      //    - .send(todoData) sends the stub data
      //    - .expect(201) verifies success status
      const response = await request(app)
        .post('/api/todos')
        .send(todoData)
        .expect(201)

      // 🚗 DRIVER: Verifies the API created the todo correctly
      expect(response.body.success).toBe(true)
      expect(response.body.data.text).toBe('New Todo Item')
      expect(response.body.data.completed).toBe(false)
      expect(response.body.data._id).toBeDefined()
    })

    it('should trim whitespace from todo text', async () => {
      const todoData = { text: '  Trimmed Todo  ' }

      const response = await request(app)
        .post('/api/todos')
        .send(todoData)
        .expect(201)

      expect(response.body.data.text).toBe('Trimmed Todo')
    })

    it('should return 400 if text is missing', async () => {
      const response = await request(app)
        .post('/api/todos')
        .send({})
        .expect(400)

      expect(response.body.success).toBe(false)
      expect(response.body.error).toContain('required')
    })

    it('should return 400 if text is empty', async () => {
      const response = await request(app)
        .post('/api/todos')
        .send({ text: '' })
        .expect(400)

      expect(response.body.success).toBe(false)
    })

    it('should return 400 if text is only whitespace', async () => {
      const response = await request(app)
        .post('/api/todos')
        .send({ text: '   ' })
        .expect(400)

      expect(response.body.success).toBe(false)
    })
  })

  describe('GET /api/todos/:id', () => {
    it('should return a single todo by ID', async () => {
      const todo = await Todo.create({ text: 'Single Todo', completed: false })

      const response = await request(app)
        .get(`/api/todos/${todo._id}`)
        .expect(200)

      expect(response.body.success).toBe(true)
      expect(response.body.data.text).toBe('Single Todo')
      expect(response.body.data._id.toString()).toBe(todo._id.toString())
    })

    it('should return 404 if todo not found', async () => {
      // STUB: Create a fake ID that doesn't exist
      //    - This provides a predefined invalid ID to test error handling
      const fakeId = new mongoose.Types.ObjectId()

      // DRIVER: Calls API with stub (fake) ID and verifies error response
      const response = await request(app)
        .get(`/api/todos/${fakeId}`)
        .expect(404)

      // DRIVER: Verifies error handling works correctly
      expect(response.body.success).toBe(false)
      expect(response.body.error).toBe('Todo not found')
    })

    it('should return 400 if ID is invalid', async () => {
      // 🔌 STUB: Invalid ID string (not a valid ObjectId)
      //    - 'invalid-id' is stub data to test validation
      
      // 🚗 DRIVER: Calls API with invalid stub ID
      const response = await request(app)
        .get('/api/todos/invalid-id')
        .expect(400)

      // 🚗 DRIVER: Verifies validation error handling
      expect(response.body.success).toBe(false)
      expect(response.body.error).toBe('Invalid todo ID')
    })
  })

  describe('PUT /api/todos/:id', () => {
    it('should update todo text', async () => {
      // 🔌 STUB: Create fake todo data for testing
      const todo = await Todo.create({ text: 'Original Todo', completed: false })

      // 🚗 DRIVER: Calls PUT endpoint to update the stub todo
      //    - .put() calls the update endpoint
      //    - .send() sends the update data
      const response = await request(app)
        .put(`/api/todos/${todo._id}`)
        .send({ text: 'Updated Todo' })
        .expect(200)

      // 🚗 DRIVER: Verifies the update was successful
      expect(response.body.success).toBe(true)
      expect(response.body.data.text).toBe('Updated Todo')
      expect(response.body.data.completed).toBe(false)
    })

    it('should update todo completion status', async () => {
      const todo = await Todo.create({ text: 'Todo to complete', completed: false })

      const response = await request(app)
        .put(`/api/todos/${todo._id}`)
        .send({ completed: true })
        .expect(200)

      expect(response.body.success).toBe(true)
      expect(response.body.data.completed).toBe(true)
    })

    it('should update both text and completed status', async () => {
      const todo = await Todo.create({ text: 'Original', completed: false })

      const response = await request(app)
        .put(`/api/todos/${todo._id}`)
        .send({ text: 'Updated', completed: true })
        .expect(200)

      expect(response.body.success).toBe(true)
      expect(response.body.data.text).toBe('Updated')
      expect(response.body.data.completed).toBe(true)
    })

    it('should return 404 if todo not found', async () => {
      const fakeId = new mongoose.Types.ObjectId()

      const response = await request(app)
        .put(`/api/todos/${fakeId}`)
        .send({ text: 'Updated' })
        .expect(404)

      expect(response.body.success).toBe(false)
    })

    it('should return 400 if text is empty', async () => {
      const todo = await Todo.create({ text: 'Original', completed: false })

      const response = await request(app)
        .put(`/api/todos/${todo._id}`)
        .send({ text: '' })
        .expect(400)

      expect(response.body.success).toBe(false)
    })
  })

  describe('PATCH /api/todos/:id/toggle', () => {
    it('should toggle todo from incomplete to complete', async () => {
      const todo = await Todo.create({ text: 'Todo to toggle', completed: false })

      const response = await request(app)
        .patch(`/api/todos/${todo._id}/toggle`)
        .expect(200)

      expect(response.body.success).toBe(true)
      expect(response.body.data.completed).toBe(true)
    })

    it('should toggle todo from complete to incomplete', async () => {
      const todo = await Todo.create({ text: 'Completed todo', completed: true })

      const response = await request(app)
        .patch(`/api/todos/${todo._id}/toggle`)
        .expect(200)

      expect(response.body.success).toBe(true)
      expect(response.body.data.completed).toBe(false)
    })

    it('should return 404 if todo not found', async () => {
      const fakeId = new mongoose.Types.ObjectId()

      const response = await request(app)
        .patch(`/api/todos/${fakeId}/toggle`)
        .expect(404)

      expect(response.body.success).toBe(false)
    })
  })

  describe('DELETE /api/todos/:id', () => {
    it('should delete a todo', async () => {
      //  STUB: Create fake todo for deletion test
      const todo = await Todo.create({ text: 'Todo to delete', completed: false })

      //  DRIVER: Calls DELETE endpoint
      const response = await request(app)
        .delete(`/api/todos/${todo._id}`)
        .expect(200)

      //  DRIVER: Verifies deletion response
      expect(response.body.success).toBe(true)
      expect(response.body.message).toBe('Todo deleted successfully')

      //  DRIVER: Verifies todo is actually deleted from database
      const deletedTodo = await Todo.findById(todo._id)
      expect(deletedTodo).toBeNull()
    })

    it('should return 404 if todo not found', async () => {
      const fakeId = new mongoose.Types.ObjectId()

      const response = await request(app)
        .delete(`/api/todos/${fakeId}`)
        .expect(404)

      expect(response.body.success).toBe(false)
    })
  })

  describe('DELETE /api/todos', () => {
    it('should delete all completed todos', async () => {
      // 🔌 STUB: Create multiple fake todos with different states
      //    - Provides controlled test data (mix of completed/active)
      await Todo.create({ text: 'Active 1', completed: false })
      await Todo.create({ text: 'Completed 1', completed: true })
      await Todo.create({ text: 'Completed 2', completed: true })
      await Todo.create({ text: 'Active 2', completed: false })

      // 🚗 DRIVER: Calls DELETE endpoint to clear completed todos
      const response = await request(app)
        .delete('/api/todos')
        .expect(200)

      // 🚗 DRIVER: Verifies the response
      expect(response.body.success).toBe(true)
      expect(response.body.data.deletedCount).toBe(2)

      // 🚗 DRIVER: Verifies only active todos remain in database
      const remainingTodos = await Todo.find({})
      expect(remainingTodos).toHaveLength(2)
      expect(remainingTodos.every(todo => !todo.completed)).toBe(true)
    })

    it('should return success even if no completed todos exist', async () => {
      await Todo.create({ text: 'Active 1', completed: false })

      const response = await request(app)
        .delete('/api/todos')
        .expect(200)

      expect(response.body.success).toBe(true)
      expect(response.body.data.deletedCount).toBe(0)
    })
  })

  describe('Integration: Full CRUD workflow', () => {
    it('should complete a full CRUD workflow', async () => {
      // DRIVER: Orchestrates complete workflow
      //    This test acts as a driver that calls multiple endpoints
      //    and verifies the entire CRUD cycle
      
      // STUB: Test data for creation
      //  DRIVER: CREATE - Calls POST endpoint
      const createResponse = await request(app)
        .post('/api/todos')
        .send({ text: 'Workflow Todo' })
        .expect(201)

      const todoId = createResponse.body.data._id

      //  DRIVER: READ - Calls GET endpoint and verifies
      const readResponse = await request(app)
        .get(`/api/todos/${todoId}`)
        .expect(200)

      expect(readResponse.body.data.text).toBe('Workflow Todo')

      // DRIVER: UPDATE - Calls PUT endpoint and verifies
      const updateResponse = await request(app)
        .put(`/api/todos/${todoId}`)
        .send({ completed: true })
        .expect(200)

      expect(updateResponse.body.data.completed).toBe(true)

      //  DRIVER: DELETE - Calls DELETE endpoint
      await request(app)
        .delete(`/api/todos/${todoId}`)
        .expect(200)

      // DRIVER: VERIFY - Calls GET to verify deletion
      const deletedResponse = await request(app)
        .get(`/api/todos/${todoId}`)
        .expect(404)
    })
  })
})
