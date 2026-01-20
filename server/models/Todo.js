import mongoose from 'mongoose'

const todoSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: [true, 'Todo text is required'],
     // trim: true,
      minlength: [1, 'Todo text cannot be empty'],
    },
    completed: {
      type: Boolean,
      default: false,
    },
    deadline: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true, 
  }
)

const Todo = mongoose.model('Todo', todoSchema)

export default Todo
