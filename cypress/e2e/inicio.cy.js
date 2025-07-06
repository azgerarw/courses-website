describe('Interfaz de homepage', () => {
  it('Debería mostrar la página de inicio', () => {
    cy.visit('http://localhost:5173/');
    cy.contains('tuCurso.com');
    cy.get('[data-cy="inicio-marquee"]').should('exist').should('be.visible');
    cy.url().should('include', '/');
  });
});