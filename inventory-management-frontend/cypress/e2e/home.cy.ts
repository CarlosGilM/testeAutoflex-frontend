describe('Página Home', () => {
    beforeEach(() => {
        cy.visit('/');
    });

    it('deve carregar a home com título e cards', () => {
        cy.contains('AutoFlex').should('be.visible');
        cy.contains('Sistema de Gestão de Estoque').should('be.visible');

        // Verifica se os 3 cards existem e têm os links corretos
        cy.get('a[href="/products"]').should('contain', 'Produtos');
        cy.get('a[href="/raw-materials"]').should('contain', 'Matérias-Primas');
        cy.get('a[href="/production"]').should('contain', 'Sugestões de Produção');
    });

    it('deve navegar para a página de produtos ao clicar no card', () => {
        cy.get('a[href="/products"]').click();
        // Verifica se a URL mudou
        cy.url().should('include', '/products');
        // Verifica se carregou o título da nova página
        cy.contains('h1', 'Produtos').should('be.visible');
    });
});