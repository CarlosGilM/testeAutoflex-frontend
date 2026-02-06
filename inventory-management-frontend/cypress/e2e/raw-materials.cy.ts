describe('Página Matérias-Primas', () => {
    beforeEach(() => {
        cy.intercept('GET', 'api/raw-materials', {
            statusCode: 200,
            body: [
                { code: 1, name: 'Aço', stockQuantity: 50 },
                { code: 2, name: 'Plástico', stockQuantity: 100 }
            ]
        }).as('getMaterials');

        cy.visit('/raw-materials');
        cy.wait('@getMaterials');
    });

    it('deve listar os itens vindos da API', () => {
        cy.contains('Aço').should('be.visible');
        cy.contains('50 Unidades').should('be.visible');
        cy.contains('Plástico').should('be.visible');
    });

    it('deve adicionar um novo material', () => {
        cy.intercept('POST', 'api/raw-materials', {
            statusCode: 201,
            body: { code: 3, name: 'Madeira', stockQuantity: 20 }
        }).as('createMaterial');

        cy.intercept('GET', 'api/raw-materials', {
            body: [
                { code: 1, name: 'Aço', stockQuantity: 50 },
                { code: 2, name: 'Plástico', stockQuantity: 100 },
                { code: 3, name: 'Madeira', stockQuantity: 20 }
            ]
        }).as('getMaterialsUpdated');

        cy.contains('button', 'Adicionar Material').click();
        cy.get('input[placeholder="Ex: Aço 1020"]').type('Madeira');
        cy.get('input[placeholder="0"]').type('20');
        cy.contains('button', 'Salvar').click();

        cy.wait('@createMaterial');
        cy.wait('@getMaterialsUpdated');

        cy.contains('Madeira').should('be.visible');
    });

    it('deve excluir um material', () => {
        cy.intercept('DELETE', 'api/raw-materials/1', {
            statusCode: 204
        }).as('deleteMaterial');

        cy.intercept('GET', 'api/raw-materials', {
            body: [{ code: 2, name: 'Plástico', stockQuantity: 100 }]
        }).as('getMaterialsAfterDelete');

        cy.get('.btn-delete').first().click();

        cy.contains('Sim, Excluir').click();

        cy.wait('@deleteMaterial');
        cy.wait('@getMaterialsAfterDelete');

        cy.contains('Aço').should('not.exist');
    });
});