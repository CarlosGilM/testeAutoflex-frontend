import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { describe, test, expect, vi, beforeEach } from 'vitest';
import RawMaterials from './RawMaterials';
import RawMaterialsService from '../services/RawMaterialsService';

vi.mock('../services/RawMaterialsService');

const mockService = vi.mocked(RawMaterialsService);

const mockMaterials = [
    { code: 1, name: 'Aço 1020', stockQuantity: 50 },
    { code: 2, name: 'Plástico ABS', stockQuantity: 100 },
];

describe('Página RawMaterials (Matérias-Primas)', () => {

    beforeEach(() => {
        vi.clearAllMocks();
    });

    test('deve renderizar a lista de materiais corretamente ao carregar', async () => {
        mockService.getAll.mockResolvedValue(mockMaterials);

        render(
            <MemoryRouter>
                <RawMaterials />
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getByText('Aço 1020')).toBeInTheDocument();
            expect(screen.getByText('Plástico ABS')).toBeInTheDocument();
            expect(screen.getByText('50 Unidades')).toBeInTheDocument();
        });

        expect(mockService.getAll).toHaveBeenCalledTimes(1);
    });

    test('deve exibir mensagem de estado vazio quando não houver materiais', async () => {
        mockService.getAll.mockResolvedValue([]);

        render(
            <MemoryRouter>
                <RawMaterials />
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getByText('Nenhum material cadastrado.')).toBeInTheDocument();
        });
    });

    test('deve abrir o modal e criar um novo material', async () => {
        const user = userEvent.setup();
        mockService.getAll.mockResolvedValue([]);
        mockService.create.mockResolvedValue({ code: 3, name: 'Madeira', stockQuantity: 20 });

        render(
            <MemoryRouter>
                <RawMaterials />
            </MemoryRouter>
        );

        await waitFor(() => screen.getByText('Nenhum material cadastrado.'));

        const addButton = screen.getByRole('button', { name: /adicionar material/i });
        await user.click(addButton);

        expect(screen.getByRole('heading', { name: 'Novo Material' })).toBeInTheDocument();

        const inputName = screen.getByRole('textbox');
        const inputStock = screen.getByRole('spinbutton'); 

        await user.type(inputName, 'Madeira');
        await user.type(inputStock, '20');

        const saveButton = screen.getByRole('button', { name: 'Salvar' });
        await user.click(saveButton);

        await waitFor(() => {
            expect(mockService.create).toHaveBeenCalledWith({
                name: 'Madeira',
                stockQuantity: 20
            });
        });

        expect(mockService.getAll).toHaveBeenCalledTimes(2);
    });

    test('deve editar um material existente', async () => {
        const user = userEvent.setup();
        mockService.getAll.mockResolvedValue(mockMaterials);
        mockService.update.mockResolvedValue({ code: 1, name: 'Aço Editado', stockQuantity: 60 });

        render(
            <MemoryRouter>
                <RawMaterials />
            </MemoryRouter>
        );

        await waitFor(() => expect(screen.getByText('Aço 1020')).toBeInTheDocument());

        const editButtons = screen.getAllByTitle('Editar');
        await user.click(editButtons[0]);

        expect(screen.getByRole('heading', { name: 'Editar Material' })).toBeInTheDocument();

        const inputName = screen.getByDisplayValue('Aço 1020');
        await user.clear(inputName);
        await user.type(inputName, 'Aço Editado');

        const saveButton = screen.getByRole('button', { name: 'Salvar Alterações' });
        await user.click(saveButton);

        await waitFor(() => {
            expect(mockService.update).toHaveBeenCalledWith(1, {
                name: 'Aço Editado',
                stockQuantity: 50
            });
        });
    });

    test('deve excluir um material', async () => {
        const user = userEvent.setup();
        mockService.getAll.mockResolvedValue(mockMaterials);
        mockService.delete.mockResolvedValue();

        render(
            <MemoryRouter>
                <RawMaterials />
            </MemoryRouter>
        );

        await waitFor(() => expect(screen.getByText('Aço 1020')).toBeInTheDocument());

        const deleteButtons = screen.getAllByTitle('Excluir');
        await user.click(deleteButtons[0]);

        expect(screen.getByText(/tem certeza que deseja excluir/i)).toBeInTheDocument();

        const productNames = screen.getAllByText('Aço 1020');
        expect(productNames.length).toBeGreaterThanOrEqual(1);

        const confirmButton = screen.getByRole('button', { name: 'Sim, Excluir' });
        await user.click(confirmButton);

        await waitFor(() => {
            expect(mockService.delete).toHaveBeenCalledWith(1);
        });

        expect(mockService.getAll).toHaveBeenCalledTimes(2);
    });
});