import express from 'express'
import Todo from '../models/Todo.js'

const router = express.Router()

// GET /api/todos - Get all todos
router.get('/', async (req, res) => {
  try {
    const todos = await Todo.find().sort({ createdAt: -1 })
    res.json({
      success: true,
      count: todos.length,
      data: todos,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    })
  }
})

// GET /api/todos/:id - Get a single todo
router.get('/:id', async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id)

    if (!todo) {
      return res.status(404).json({
        success: false,
        error: 'Todo not found',
      })
    }

    res.json({
      success: true,
      data: todo,
    })
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        error: 'Invalid todo ID',
      })
    }
    res.status(500).json({
      success: false,
      error: error.message,
    })
  }
})

// POST /api/todos - Create a new todo
router.post('/', async (req, res) => {
  try {
    const { text } = req.body

    if (!text || !text.trim()) {
      return res.status(400).json({
        success: false,
        error: 'Todo text is required',
      })
    }

    const todo = await Todo.create({
      text: text.trim(),         /////////////////////////////////////////////////////////////
      completed: false,
    })

    res.status(201).json({
      success: true,
      data: todo,
    })
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        error: Object.values(error.errors).map((err) => err.message).join(', '),
      })
    }
    res.status(500).json({
      success: false,
      error: error.message,
    })
  }
})

// PUT /api/todos/:id - Update a todo
router.put('/:id', async (req, res) => {
  try {
    const { text, completed } = req.body
    const updateData = {}

    if (text !== undefined) {
      if (!text || !text.trim()) {
        return res.status(400).json({
          success: false,
          error: 'Todo text cannot be empty',
        })
      }
      updateData.text = text.trim()
    }

    if (completed !== undefined) {
      updateData.completed = Boolean(completed)
    }

    const todo = await Todo.findByIdAndUpdate(
      req.params.id,
      updateData,
      {
        new: true,
        runValidators: true,
      }
    )

    if (!todo) {
      return res.status(404).json({
        success: false,
        error: 'Todo not found',
      })
    }

    res.json({
      success: true,
      data: todo,
    })
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        error: 'Invalid todo ID',
      })
    }
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        error: Object.values(error.errors).map((err) => err.message).join(', '),
      })
    }
    res.status(500).json({
      success: false,
      error: error.message,
    })
  }
})

// PATCH /api/todos/:id/toggle - Toggle todo completion status
router.patch('/:id/toggle', async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id)

    if (!todo) {
      return res.status(404).json({
        success: false,
        error: 'Todo not found',
      })
    }

    todo.completed = !todo.completed
    await todo.save()

    res.json({
      success: true,
      data: todo,
    })
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        error: 'Invalid todo ID',
      })
    }
    res.status(500).json({
      success: false,
      error: error.message,
    })
  }
})

// DELETE /api/todos/:id - Delete a todo
router.delete('/:id', async (req, res) => {
  try {
    const todo = await Todo.findByIdAndDelete(req.params.id)

    if (!todo) {
      return res.status(404).json({
        success: false,
        error: 'Todo not found',
      })
    }

    res.json({
      success: true,
      data: {},
      message: 'Todo deleted successfully',
    })
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        error: 'Invalid todo ID',
      })
    }
    res.status(500).json({
      success: false,
      error: error.message,
    })
  }
})

// DELETE /api/todos - Delete all completed todos
router.delete('/', async (req, res) => {
  try {
    const result = await Todo.deleteMany({ completed: true })

    res.json({
      success: true,
      data: {
        deletedCount: result.deletedCount,
      },
      message: `${result.deletedCount} completed todo(s) deleted successfully`,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    })
  }
})

export default router
