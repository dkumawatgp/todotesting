# React Todo App - Testing Practice

A modern React todo application built with Vite, designed for practicing different types of testing: Unit Testing, Integration Testing, End-to-End (E2E) Testing, and **API Testing**.


### Installation

```bash
npm install
```


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
-  GET /api/todos - Get all todos
-  GET /api/todos/:id - Get single todo
-  POST /api/todos - Create todo
-  PUT /api/todos/:id - Update todo
-  PATCH /api/todos/:id/toggle - Toggle todo completion
-  DELETE /api/todos/:id - Delete single todo
-  DELETE /api/todos - Delete all completed todos
-  Error handling and validation
-  Full CRUD workflow integration

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
