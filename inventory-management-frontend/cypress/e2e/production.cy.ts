describe('Página Sugestão de Produção', () => {
    it('deve exibir loading e depois a lista', () => {
        cy.intercept('GET', '**/api/products/production-suggestion', {
            delay: 500,
            statusCode: 200,
            body: [
                {
                    productCode: 1,
                    productName: 'Mesa',
                    productPrice: 500,
                    quantityToProduce: 2,
                    totalEstimatedValue: 1000
                }
            ]
        }).as('getSuggestions');

        cy.visit('/production');

        cy.contains('Calculando melhor produção...').should('exist');

        cy.wait('@getSuggestions');

        cy.contains('Mesa').should('be.visible');
        cy.contains(/500,00/).should('be.visible');
        cy.contains(/1.000,00/).should('be.visible');
    });

    it('deve exibir estado vazio (empty state)', () => {
        cy.intercept('GET', '**/api/products/production-suggestion', {
            statusCode: 200,
            body: []
        }).as('getEmpty');

        cy.visit('/production');

        cy.wait('@getEmpty');

        cy.contains('Nenhuma Produção Possível').should('be.visible');
        cy.get('.empty-production-card').should('exist');
    });
});