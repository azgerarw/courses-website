describe('Interfaz de cursos', () => {
  it('Debería mostrar la página de inicio', () => {
    const curso = 'javascript';
    cy.visit('http://localhost:5173/Cursos');
    cy.contains('Cursos disponibles');
    cy.get('input[type="text"]').type(`${curso}`);
    cy.get('div').contains('No hay cursos disponibles').should('not.exist');
    cy.get("[data-cy='curso-item']").should('exist').should('be.visible');
    cy.url().should('include', `/Cursos`);
  });

  it('Debería filtrar por categoría', () => {
    cy.visit('http://localhost:5173/Cursos');

    cy.contains('Frontend').click();
    cy.contains('Backend').click();
    cy.contains('Todos').click();
    // Aquí podrías validar que los cursos mostrados son solo de frontend si mockeas el backend
    cy.get("[data-cy='curso-item']").should('exist').should('be.visible');
  });

});

 