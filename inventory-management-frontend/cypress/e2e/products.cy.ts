describe('Página Produtos', () => {
    beforeEach(() => {
        cy.intercept('GET', 'api/products', {
            body: []
        }).as('getProducts');

        cy.intercept('GET', 'api/raw-materials', {
            body: [
                { code: 101, name: 'Farinha', stockQuantity: 50 },
                { code: 102, name: 'Ovos', stockQuantity: 100 }
            ]
        }).as('getMaterials');

        cy.visit('/products');
        cy.wait(['@getProducts', '@getMaterials']);
    });

    it('deve criar um produto com receita', () => {
        cy.intercept('POST', 'api/products', {
            statusCode: 201,
            body: { code: 1, name: 'Bolo', price: 20, compositions: [] }
        }).as('createProduct');

        cy.intercept('GET', 'api/products', {
            body: [{ code: 1, name: 'Bolo', price: 20, compositions: [{ rawMaterialName: 'Farinha', quantityNeeded: 2 }] }]
        }).as('getProductsUpdated');

        cy.contains('button', 'Adicionar Produto').click();

        cy.get('.modal-content input[type="text"]').type('Bolo');
        cy.get('.modal-content input[type="number"]').first().type('20');

        cy.get('select.recipe-select').select('101');

        cy.get('.recipe-qty').clear().type('2');

        cy.get('.btn-add-recipe').click();

        cy.contains('.recipe-item', 'Farinha').should('be.visible');
        cy.contains('.recipe-item', '2 un').should('be.visible');

        cy.contains('button', 'Criar Produto').click();

        cy.wait('@createProduct');
        cy.wait('@getProductsUpdated');
        cy.contains('Bolo').should('be.visible');
    });

    it('deve validar regra de receita vazia', () => {
        const alertStub = cy.stub();
        cy.on('window:alert', alertStub);

        cy.contains('button', 'Adicionar Produto').click();

        cy.get('.modal-content input[type="text"]').type('Bolo Ruim');
        cy.get('.modal-content input[type="number"]').first().type('10');

        cy.contains('button', 'Criar Produto').click().then(() => {
            expect(alertStub.getCall(0)).to.be.calledWithMatch(/pelo menos 1 matéria-prima/);
        });
    });
});