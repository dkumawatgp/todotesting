describe('Todo App E2E Tests', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('display the app title and subtitle', () => {
    cy.contains('h1', 'Todo App').should('be.visible')
    cy.contains('Practice Testing: Unit, Integration & E2E').should('be.visible')
  })

  it('show empty state when no todos', () => {
    cy.get('[data-testid="todo-list-empty"]').should('be.visible')
    cy.contains('No todos yet. Add one above!').should('be.visible')
  })

  it('allow adding a new todo', () => {
    cy.get('[data-testid="add-todo-input"]').type('E2E Test Todo')
    cy.get('[data-testid="add-todo-button"]').click()
    
    cy.contains('E2E Test Todo').should('be.visible')
    cy.get('[data-testid="todo-list-empty"]').should('not.exist') 
  })

  it('allow adding multiple todos', () => {
    cy.get('[data-testid="add-todo-input"]').type('First Todo')
    cy.get('[data-testid="add-todo-button"]').click()
    
    cy.get('[data-testid="add-todo-input"]').type('Second Todo')
    cy.get('[data-testid="add-todo-button"]').click()
    
    cy.get('[data-testid="add-todo-input"]').type('Third Todo')
    cy.get('[data-testid="add-todo-button"]').click()
    
    cy.contains('First Todo').should('be.visible')
    cy.contains('Second Todo').should('be.visible')
    cy.contains('Third Todo').should('be.visible')
  })

  it('updat stats when todos are added', () => {
    cy.get('[data-testid="add-todo-input"]').type('Todo 1')
    cy.get('[data-testid="add-todo-button"]').click()
    
    cy.get('[data-testid="todo-stats"]').within(() => {
      cy.contains('Total: 1').should('be.visible')
      cy.contains('Active: 1').should('be.visible')
      cy.contains('Completed: 0').should('be.visible')
    })
    
    cy.get('[data-testid="add-todo-input"]').type('Todo 2')
    cy.get('[data-testid="add-todo-button"]').click()
    
    cy.get('[data-testid="todo-stats"]').within(() => {
      cy.contains('Total: 2').should('be.visible')
      cy.contains('Active: 2').should('be.visible')
    })
  })

  it('allow toggling todo completion', () => {
    cy.get('[data-testid="add-todo-input"]').type('Todo to complete')
    cy.get('[data-testid="add-todo-button"]').click()
    
    // Find the todo item by text, then find checkbox within it
    cy.contains('Todo to complete').closest('[data-testid^="todo-item"]').as('todoItem')
    cy.get('@todoItem').find('input[type="checkbox"]').should('not.be.checked')
    cy.get('@todoItem').should('not.have.class', 'completed')
    
    cy.get('@todoItem').find('input[type="checkbox"]').check()
    
    cy.get('@todoItem').find('input[type="checkbox"]').should('be.checked')
    cy.get('@todoItem').should('have.class', 'completed')
    
    cy.get('[data-testid="todo-stats"]').within(() => {
      cy.contains('Completed: 1').should('be.visible')
      cy.contains('Active: 0').should('be.visible')
    })
  })

  it('allow deleting a todo', () => {
    cy.get('[data-testid="add-todo-input"]').type('Todo to delete')
    cy.get('[data-testid="add-todo-button"]').click()
    
    cy.contains('Todo to delete').should('be.visible')
    
    // Find the todo item by text, then find delete button within it
    cy.contains('Todo to delete').closest('[data-testid^="todo-item"]').find('button').click()
    
    cy.contains('Todo to delete').should('not.exist')
    cy.get('[data-testid="todo-list-empty"]').should('be.visible')
  })

  it('allow clearing all completed todos', () => {
    // Add todos
    cy.get('[data-testid="add-todo-input"]').type('Active Todo')
    cy.get('[data-testid="add-todo-button"]').click()
    
    cy.get('[data-testid="add-todo-input"]').type('Completed Todo 1')
    cy.get('[data-testid="add-todo-button"]').click()
    
    cy.get('[data-testid="add-todo-input"]').type('Completed Todo 2')
    cy.get('[data-testid="add-todo-button"]').click()
    
    // Complete two todos by finding them and checking their checkboxes
    cy.contains('Completed Todo 1').closest('[data-testid^="todo-item"]').find('input[type="checkbox"]').check()
    cy.contains('Completed Todo 2').closest('[data-testid^="todo-item"]').find('input[type="checkbox"]').check()
    
    // Clear completed
    cy.get('[data-testid="clear-completed-button"]').should('be.visible')
    cy.get('[data-testid="clear-completed-button"]').click()
    
    // Verify only active todo remains
    cy.contains('Active Todo').should('be.visible')
    cy.contains('Completed Todo 1').should('not.exist')
    cy.contains('Completed Todo 2').should('not.exist')
    cy.get('[data-testid="clear-completed-button"]').should('not.exist')
  })

  it('complet full user workflow', () => {
    // Add initial todos
    cy.get('[data-testid="add-todo-input"]').type('Morning workout')
    cy.get('[data-testid="add-todo-button"]').click()
    
    cy.get('[data-testid="add-todo-input"]').type('Buy groceries')
    cy.get('[data-testid="add-todo-button"]').click()
    
    cy.get('[data-testid="add-todo-input"]').type('Write code')
    cy.get('[data-testid="add-todo-button"]').click()
    
    // Verify all are added
    cy.contains('Morning workout').should('be.visible')
    cy.contains('Buy groceries').should('be.visible')
    cy.contains('Write code').should('be.visible')
    
    // Complete some tasks
    cy.contains('Morning workout').closest('[data-testid^="todo-item"]').find('input[type="checkbox"]').check()
    cy.contains('Buy groceries').closest('[data-testid^="todo-item"]').find('input[type="checkbox"]').check()
    
    // Verify stats update
    cy.get('[data-testid="todo-stats"]').within(() => {
      cy.contains('Total: 3')
      cy.contains('Active: 1')
      cy.contains('Completed: 2')
    })
    
    // Clear completed
    cy.get('[data-testid="clear-completed-button"]').click()
    
    // Verify final state
    cy.contains('Write code').should('be.visible')
    cy.contains('Morning workout').should('not.exist')
    cy.contains('Buy groceries').should('not.exist')
    
    cy.get('[data-testid="todo-stats"]').within(() => {
      cy.contains('Total: 1')
      cy.contains('Active: 1')
      cy.contains('Completed: 0')
    })
  })

  it('handle form submission with Enter key', () => {
    cy.get('[data-testid="add-todo-input"]').type('Enter key todo{enter}')
    cy.contains('Enter key todo').should('be.visible')

    cy.get('[data-testid="todo-stats"]').within(() => {
      cy.contains('Total: 1')
      cy.contains('Active: 1')
      cy.contains('Completed: 0')
    })
  })

  it('does not add empty todos', () => {
    cy.get('[data-testid="add-todo-button"]').click()
    cy.get('[data-testid="todo-list-empty"]').should('be.visible')
    
    cy.get('[data-testid="add-todo-input"]').type('   ')
    cy.get('[data-testid="add-todo-button"]').click()
    cy.get('[data-testid="todo-list-empty"]').should('be.visible')
  })
})
