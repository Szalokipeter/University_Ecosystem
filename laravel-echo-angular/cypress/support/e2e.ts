import './commands'
beforeEach(() => {
  console.log('resetting database');
  cy.request('POST', 'http://localhost:8000/api/test/reset-database');
});
