// ✅ Tests de frontend (UI)
describe('Interfaz de usuarios', () => {
  it('Debería mostrar la lista en pantalla', () => {
    cy.visit('http://localhost:5173/Usuarios');
    cy.contains('Usuarios');
    cy.contains('Mostrar más').click();
    cy.get('[data-cy="usuario-item"]').should('exist').should('be.visible');
    cy.url().should('include', '/Usuarios');
  });
});