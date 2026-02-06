import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, test, expect, vi, beforeEach } from 'vitest';
import Production from './Production';
import ProductionService from '../services/ProductionService';

vi.mock('../services/ProductionService');
const mockService = vi.mocked(ProductionService);

const mockSuggestions = [
    {
        productCode: 1,
        productName: 'Mesa de Jantar',
        productPrice: 450.00,
        quantityToProduce: 5,
        totalEstimatedValue: 2250.00
    },
    {
        productCode: 2,
        productName: 'Cadeira de Madeira',
        productPrice: 120.50,
        quantityToProduce: 10,
        totalEstimatedValue: 1205.00
    }
];

describe('Página Production (Plano de Produção)', () => {

    beforeEach(() => {
        vi.clearAllMocks();
    });

    test('deve exibir o estado de carregamento inicialmente', () => {

        mockService.getSuggestions.mockReturnValue(new Promise(() => { }));

        render(
            <MemoryRouter>
                <Production />
            </MemoryRouter>
        );

        expect(screen.getByText('Calculando melhor produção...')).toBeInTheDocument();
    });

    test('deve renderizar a lista de sugestões corretamente', async () => {
        mockService.getSuggestions.mockResolvedValue(mockSuggestions);

        render(
            <MemoryRouter>
                <Production />
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getByText('Mesa de Jantar')).toBeInTheDocument();
            expect(screen.getByText('Cadeira de Madeira')).toBeInTheDocument();

            expect(screen.getByText('5')).toBeInTheDocument();
            expect(screen.getByText('10')).toBeInTheDocument();

            expect(screen.getByText(/450,00/)).toBeInTheDocument();
            expect(screen.getByText(/2\.250,00/)).toBeInTheDocument();
        });

        expect(screen.getByText('1')).toBeInTheDocument();
        expect(screen.getByText('2')).toBeInTheDocument();
    });

    test('deve exibir estado vazio quando não houver sugestões', async () => {
        mockService.getSuggestions.mockResolvedValue([]);

        render(
            <MemoryRouter>
                <Production />
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getByText('Nenhuma Produção Possível')).toBeInTheDocument();
            expect(screen.getByText(/Não há insumos suficientes/i)).toBeInTheDocument();
        });
    });

    test('deve lidar com erro na API exibindo estado vazio (conforme lógica do componente)', async () => {
        mockService.getSuggestions.mockRejectedValue(new Error('Falha na API'));

        const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => { });

        render(
            <MemoryRouter>
                <Production />
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.queryByText('Calculando melhor produção...')).not.toBeInTheDocument();
        });
        expect(screen.getByText('Nenhuma Produção Possível')).toBeInTheDocument();

        expect(consoleSpy).toHaveBeenCalledWith("Erro ao carregar sugestões:", expect.any(Error));
    });

    test('deve ter um link para voltar para home', async () => {
        mockService.getSuggestions.mockResolvedValue([]);
        render(
            <MemoryRouter>
                <Production />
            </MemoryRouter>
        );

        const backLink = screen.getByText('← Voltar');
        expect(backLink).toBeInTheDocument();
        expect(backLink.closest('a')).toHaveAttribute('href', '/');
    });

});