# React Todo App - Testing Practice

A modern React todo application built with Vite, designed for practicing different types of testing: Unit Testing, Integration Testing, End-to-End (E2E) Testing, and **API Testing**.

## Features

- ✅ Add new todos
- ✅ Toggle todo completion
- ✅ Delete individual todos
- ✅ Clear all completed todos
- ✅ View todo statistics (Total, Active, Completed)
- 🎨 Beautiful, modern UI with gradient design
- 🔌 RESTful API backend with MongoDB
- 🧪 Comprehensive API testing examples

## Tech Stack

### Frontend
- **React 18** - UI library
- **Vite** - Build tool and dev server
- **Vitest** - Unit and integration testing
- **React Testing Library** - Component testing utilities
- **Cypress** - E2E testing framework

### Backend
- **Node.js** - Runtime environment
- **Express** - Web framework
- **MongoDB** - Database
- **Mongoose** - MongoDB ODM
- **Supertest** - API testing

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- MongoDB (local installation or MongoDB Atlas account)

### Installation

```bash
npm install
```

### Setup MongoDB

1. **Local MongoDB**: Make sure MongoDB is running locally
   ```bash
   # macOS with Homebrew
   brew services start mongodb-community
   
   # Or use MongoDB Atlas (cloud)
   ```

2. **Update `.env` file** (create from `.env.example`):
   ```env
   MONGODB_URI=mongodb://localhost:27017/todoapp
   PORT=3001
   ```

### Running the Application

**Option 1: Run frontend and backend separately**

```bash
# Terminal 1: Start backend server
npm run dev:server

# Terminal 2: Start frontend
npm run dev
```

**Option 2: Run both together (requires `concurrently`)**

```bash
npm run dev:all
```

- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:3001`

### Building for Production

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

## Testing

### Unit Tests

Unit tests focus on testing individual components in isolation.

**Run unit tests:**
```bash
npm test
```

**Run tests with UI:**
```bash
npm run test:ui
```

**Run tests with coverage:**
```bash
npm run test:coverage
```

**Unit test files:**
- `src/components/__tests__/TodoItem.test.jsx` - Tests for TodoItem component
- `src/components/__tests__/AddTodo.test.jsx` - Tests for AddTodo component
- `src/components/__tests__/TodoList.test.jsx` - Tests for TodoList component

### Integration Tests

Integration tests verify that multiple components work together correctly.

**Run integration tests:**
```bash
npm test
```

**Integration test files:**
- `src/__tests__/App.integration.test.jsx` - Tests for component interactions

### E2E Tests

End-to-end tests simulate real user interactions with the entire application.

**Run E2E tests (interactive):**
```bash
npm run test:e2e
```

**Run E2E tests (headless):**
```bash
npm run test:e2e:headless
```

**E2E test files:**
- `cypress/e2e/todo.cy.js` - Complete user workflow tests

**Note:** Make sure both the dev server (`npm run dev:server`) and frontend (`npm run dev`) are running before running E2E tests.

### API Tests

API tests verify the backend REST API endpoints.

**Run API tests:**
```bash
npm run test:api
```

**API test files:**
- `server/__tests__/todoRoutes.test.js` - Comprehensive API endpoint tests
- `server/__tests__/health.test.js` - Health check endpoint tests

**API Test Coverage:**
- ✅ GET /api/todos - Get all todos
- ✅ GET /api/todos/:id - Get single todo
- ✅ POST /api/todos - Create todo
- ✅ PUT /api/todos/:id - Update todo
- ✅ PATCH /api/todos/:id/toggle - Toggle todo completion
- ✅ DELETE /api/todos/:id - Delete single todo
- ✅ DELETE /api/todos - Delete all completed todos
- ✅ Error handling and validation
- ✅ Full CRUD workflow integration

## API Endpoints

### Base URL
```
http://localhost:3001/api
```

### Endpoints

#### Health Check
- `GET /api/health` - Server health status

#### Todos
- `GET /api/todos` - Get all todos
- `GET /api/todos/:id` - Get a single todo
- `POST /api/todos` - Create a new todo
  ```json
  {
    "text": "New todo item"
  }
  ```
- `PUT /api/todos/:id` - Update a todo
  ```json
  {
    "text": "Updated text",
    "completed": true
  }
  ```
- `PATCH /api/todos/:id/toggle` - Toggle todo completion
- `DELETE /api/todos/:id` - Delete a single todo
- `DELETE /api/todos` - Delete all completed todos

### Response Format

**Success Response:**
```json
{
  "success": true,
  "data": { ... }
}
```

**Error Response:**
```json
{
  "success": false,
  "error": "Error message"
}
```

## Project Structure

```
TestingProject/
├── server/
│   ├── __tests__/          # API tests
│   │   ├── todoRoutes.test.js
│   │   └── health.test.js
│   ├── models/             # MongoDB models
│   │   └── Todo.js
│   ├── routes/              # API routes
│   │   └── todoRoutes.js
│   └── index.js            # Server entry point
├── src/
│   ├── components/
│   │   ├── __tests__/      # Unit tests
│   │   ├── AddTodo.jsx
│   │   ├── TodoItem.jsx
│   │   └── TodoList.jsx
│   ├── __tests__/          # Integration tests
│   ├── services/           # API service
│   │   └── api.js
│   ├── App.jsx
│   └── main.jsx
├── cypress/
│   ├── e2e/                # E2E tests
│   └── support/
├── package.json
├── vite.config.js
├── cypress.config.js
└── .env                    # Environment variables
```

## Learning Resources

This project is designed to help you practice:

1. **Unit Testing**: Testing individual components and functions
2. **Integration Testing**: Testing how components work together
3. **E2E Testing**: Testing complete user workflows
4. **API Testing**: Testing REST API endpoints with Supertest

Each test file includes comments and examples to help you understand different testing patterns and best practices.

## Environment Variables

Create a `.env` file in the root directory:

```env
# MongoDB Connection String
MONGODB_URI=mongodb://localhost:27017/todoapp

# Server Port
PORT=3001
```

For MongoDB Atlas (cloud):
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/todoapp
```

## Troubleshooting

### MongoDB Connection Issues
- Make sure MongoDB is running: `mongod` or `brew services start mongodb-community`
- Check your connection string in `.env`
- For MongoDB Atlas, ensure your IP is whitelisted

### API Tests Failing
- Make sure MongoDB is running
- Tests use a separate test database: `todoapp_test`
- Check that port 3001 is not in use

### Frontend Can't Connect to API
- Ensure backend server is running: `npm run dev:server`
- Check that `VITE_API_URL` in `.env` matches your backend URL
- Vite proxy is configured in `vite.config.js` for development

## License

MIT
