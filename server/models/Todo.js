import mongoose from 'mongoose'

const todoSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: [true, 'Todo text is required'],
    
      minlength: [1, 'Todo text cannot be empty'],
    },
    completed: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt
  }
)

const Todo = mongoose.model('Todo', todoSchema)

export default Todo
