import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest'
import request from 'supertest' 
import mongoose from 'mongoose'
import app from '../index.js'
import Todo from '../models/Todo.js'



describe('Todo API Tests', () => {
  let testTodoId

  beforeAll(async () => {
  
    const MONGODB_URI = process.env.MONGODB_URI 
    await mongoose.connect(MONGODB_URI)
  })

  afterAll(async () => {
   
    await Todo.deleteMany({})
    await mongoose.connection.close()
  })

  beforeEach(async () => {
  
    await Todo.deleteMany({})
  })

  describe('GET /api/todos', () => {
    it('should return empty array when no todos exist', async () => {
    
      const response = await request(app)
        .get('/api/todos')
        .expect(200)

      expect(response.body.success).toBe(true)
      expect(response.body.count).toBe(0)
      expect(response.body.data).toEqual([])
    })

    it('should return all todos', async () => {
     
      const todo1 = await Todo.create({ text: 'Test Todo 1', completed: false })
      const todo2 = await Todo.create({ text: 'Test Todo 2', completed: true })

      const response = await request(app)
        .get('/api/todos')
        .expect(200)

      expect(response.body.success).toBe(true)
      expect(response.body.count).toBe(2)
      expect(response.body.data).toHaveLength(2)
      expect(response.body.data[0].text).toBe('Test Todo 2') 
    })
  })

  describe('POST /api/todos', () => {
    it('should create a new todo', async () => {
     
      const todoData = { text: 'New Todo Item' }

      
      const response = await request(app)
        .post('/api/todos')
        .send(todoData)
        .expect(201)

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
      
      const fakeId = new mongoose.Types.ObjectId()

      // DRIVER: Calls API with fake ID and verifies error response
      const response = await request(app)
        .get(`/api/todos/${fakeId}`)
        .expect(404)

      expect(response.body.success).toBe(false)
      expect(response.body.error).toBe('Todo not found')
    })

    it('should return 400 if ID is invalid', async () => {
   
      const response = await request(app)
        .get('/api/todos/invalid-id')
        .expect(400)

    
      expect(response.body.success).toBe(false)
      expect(response.body.error).toBe('Invalid todo ID')
    })
  })

  describe('PUT /api/todos/:id', () => {
    it('should update todo text', async () => {
      // STUB: Create fake todo data for testing
      const todo = await Todo.create({ text: 'Original Todo', completed: false })

      //DRIVER: Calls PUT endpoint to update the stub todo
     
      const response = await request(app)
        .put(`/api/todos/${todo._id}`)
        .send({ text: 'Updated Todo' })
        .expect(200)

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

      expect(response.body.success).toBe(true)
      expect(response.body.message).toBe('Todo deleted successfully')

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

      await Todo.create({ text: 'Active 1', completed: false })
      await Todo.create({ text: 'Completed 1', completed: true })
      await Todo.create({ text: 'Completed 2', completed: true })
      await Todo.create({ text: 'Active 2', completed: false })

      const response = await request(app)
        .delete('/api/todos')
        .expect(200)

      expect(response.body.success).toBe(true)
      expect(response.body.data.deletedCount).toBe(2)

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
      
      const createResponse = await request(app)
        .post('/api/todos')
        .send({ text: 'Workflow Todo' })
        .expect(201)

      const todoId = createResponse.body.data._id

      const readResponse = await request(app)
        .get(`/api/todos/${todoId}`)
        .expect(200)

      expect(readResponse.body.data.text).toBe('Workflow Todo')

      const updateResponse = await request(app)
        .put(`/api/todos/${todoId}`)
        .send({ completed: true })
        .expect(200)

      expect(updateResponse.body.data.completed).toBe(true)

      await request(app)
        .delete(`/api/todos/${todoId}`)
        .expect(200)

      const deletedResponse = await request(app)
        .get(`/api/todos/${todoId}`)
        .expect(404)
    })
  })
})
