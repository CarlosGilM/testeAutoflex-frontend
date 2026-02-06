import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, test, expect } from 'vitest';
import Home from './Home';

describe('Página Home', () => {

    test('deve renderizar o título e subtítulo da marca', () => {
        render(
            <MemoryRouter>
                <Home />
            </MemoryRouter>
        );

        expect(screen.getByText('AutoFlex')).toBeInTheDocument();

        expect(screen.getByText('Sistema de Gestão de Estoque')).toBeInTheDocument();
    });

    test('deve conter os 3 cards de navegação com os links corretos', () => {
        render(
            <MemoryRouter>
                <Home />
            </MemoryRouter>
        );

        const productsLink = screen.getByRole('link', { name: /produtos/i });
        expect(productsLink).toBeInTheDocument();
        expect(productsLink).toHaveAttribute('href', '/products');

        const materialsLink = screen.getByRole('link', { name: /matérias-primas/i });
        expect(materialsLink).toBeInTheDocument();
        expect(materialsLink).toHaveAttribute('href', '/raw-materials');

        const productionLink = screen.getByRole('link', { name: /sugestões de produção/i });
        expect(productionLink).toBeInTheDocument();
        expect(productionLink).toHaveAttribute('href', '/production');
    });

});