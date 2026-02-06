import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { describe, test, expect, vi, beforeEach } from 'vitest';
import Products from './Products';
import ProductService from '../services/ProductService';
import RawMaterialsService from '../services/RawMaterialsService';

vi.mock('../services/ProductService');
vi.mock('../services/RawMaterialsService');

const mockProductService = vi.mocked(ProductService);
const mockMaterialService = vi.mocked(RawMaterialsService);

const mockMaterials = [
    { code: 101, name: 'Farinha', stockQuantity: 50 },
    { code: 102, name: 'Açúcar', stockQuantity: 30 },
];

const mockProducts = [
    {
        code: 1,
        name: 'Bolo de Cenoura',
        price: 25.0,
        compositions: [
            { rawMaterialCode: 101, rawMaterialName: 'Farinha', quantityNeeded: 2, productCode: 1 },
            { rawMaterialCode: 102, rawMaterialName: 'Açúcar', quantityNeeded: 1, productCode: 1 }
        ]
    },
    {
        code: 2,
        name: 'Bolo de Chocolate',
        price: 30.0,
        compositions: []
    }
];

describe('Página Products (Produtos)', () => {

    beforeEach(() => {
        vi.clearAllMocks();
        vi.spyOn(window, 'alert').mockImplementation(() => { });
    });

    test('deve renderizar a lista de produtos corretamente', async () => {

        mockProductService.getAll.mockResolvedValue(mockProducts);
        mockMaterialService.getAll.mockResolvedValue(mockMaterials);

        render(
            <MemoryRouter>
                <Products />
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getByText('Bolo de Cenoura')).toBeInTheDocument();
            expect(screen.getByText('Bolo de Chocolate')).toBeInTheDocument();
            expect(screen.getByText(/25,00/)).toBeInTheDocument();
        });
    });

    test('deve exibir estado vazio quando não houver produtos', async () => {
        mockProductService.getAll.mockResolvedValue([]);
        mockMaterialService.getAll.mockResolvedValue(mockMaterials);

        render(
            <MemoryRouter>
                <Products />
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getByText('Nenhum produto cadastrado.')).toBeInTheDocument();
        });
    });

    test('deve abrir modal, adicionar itens na receita e criar produto', async () => {
        const user = userEvent.setup();
        mockProductService.getAll.mockResolvedValue([]);
        mockMaterialService.getAll.mockResolvedValue(mockMaterials);
        mockProductService.create.mockResolvedValue({ code: 3, name: 'Novo Bolo', price: 10, compositions: [] });

        render(
            <MemoryRouter>
                <Products />
            </MemoryRouter>
        );

        await waitFor(() => screen.getByText('Nenhum produto cadastrado.'));

        await user.click(screen.getByRole('button', { name: /adicionar produto/i }));
        expect(screen.getByRole('heading', { name: 'Novo Produto' })).toBeInTheDocument();

        const inputs = screen.getAllByRole('textbox');
        const numberInputs = screen.getAllByRole('spinbutton');


        await user.type(inputs[0], 'Novo Bolo');
  
        await user.type(numberInputs[0], '10');


        const select = screen.getByRole('combobox');
        await user.selectOptions(select, '101'); 

        await user.clear(numberInputs[1]);
        await user.type(numberInputs[1], '5');

        const addButton = document.querySelector('.btn-add-recipe');
        if (addButton) await user.click(addButton);

        expect(screen.getByText('Farinha', { selector: 'span' })).toBeInTheDocument();

        expect(screen.getByText('5 un')).toBeInTheDocument();

        await user.click(screen.getByRole('button', { name: 'Criar Produto' }));

        await waitFor(() => {
            expect(mockProductService.create).toHaveBeenCalledWith({
                name: 'Novo Bolo',
                price: 10,
                compositions: [
                    { rawMaterialCode: 101, quantityNeeded: 5, productCode: 0 }
                ]
            });
        });
    });

    test('deve impedir criação de produto sem receita (Regra de Negócio)', async () => {
        const user = userEvent.setup();
        mockProductService.getAll.mockResolvedValue([]);
        mockMaterialService.getAll.mockResolvedValue(mockMaterials);

        render(
            <MemoryRouter>
                <Products />
            </MemoryRouter>
        );

        await waitFor(() => screen.getByText('Nenhum produto cadastrado.'));

        await user.click(screen.getByRole('button', { name: /adicionar produto/i }));
        const inputs = screen.getAllByRole('textbox');
        await user.type(inputs[0], 'Bolo Vazio');

        await user.click(screen.getByRole('button', { name: 'Criar Produto' }));

        expect(window.alert).toHaveBeenCalledWith(expect.stringContaining('pelo menos 1 matéria-prima'));

        expect(mockProductService.create).not.toHaveBeenCalled();
    });

    test('deve visualizar detalhes da receita (Eye icon)', async () => {
        const user = userEvent.setup();
        mockProductService.getAll.mockResolvedValue(mockProducts);
        mockMaterialService.getAll.mockResolvedValue(mockMaterials);

        render(
            <MemoryRouter>
                <Products />
            </MemoryRouter>
        );

        await waitFor(() => screen.getByText('Bolo de Cenoura'));

        await user.click(screen.getByText('2 itens'));

        expect(screen.getByText('Composição do Produto')).toBeInTheDocument();
        expect(screen.getByText('Farinha')).toBeInTheDocument();
        expect(screen.getByText('Açúcar')).toBeInTheDocument();
    });

    test('deve editar um produto e mostrar aviso de receita imutável', async () => {
        const user = userEvent.setup();
        mockProductService.getAll.mockResolvedValue(mockProducts);
        mockMaterialService.getAll.mockResolvedValue(mockMaterials);
        mockProductService.update.mockResolvedValue({ ...mockProducts[0], name: 'Bolo Editado' });

        render(
            <MemoryRouter>
                <Products />
            </MemoryRouter>
        );

        await waitFor(() => screen.getByText('Bolo de Cenoura'));

        const editButtons = screen.getAllByTitle('Editar');
        await user.click(editButtons[0]);

        expect(screen.getByRole('heading', { name: 'Editar Produto' })).toBeInTheDocument();

        expect(screen.getByText(/A receita não pode ser alterada/i)).toBeInTheDocument();

        const nameInput = screen.getByDisplayValue('Bolo de Cenoura');
        await user.clear(nameInput);
        await user.type(nameInput, 'Bolo Editado');

        await user.click(screen.getByRole('button', { name: 'Salvar Alterações' }));

        await waitFor(() => {
            expect(mockProductService.update).toHaveBeenCalledWith(1, expect.objectContaining({
                name: 'Bolo Editado'
            }));
        });
    });

    test('deve excluir um produto', async () => {
        const user = userEvent.setup();
        mockProductService.getAll.mockResolvedValue(mockProducts);
        mockMaterialService.getAll.mockResolvedValue(mockMaterials);
        mockProductService.delete.mockResolvedValue();

        render(
            <MemoryRouter>
                <Products />
            </MemoryRouter>
        );

        await waitFor(() => screen.getByText('Bolo de Cenoura'));

        const deleteButtons = screen.getAllByTitle('Excluir');
        await user.click(deleteButtons[0]);

        expect(screen.getByText(/Tem certeza que deseja excluir/i)).toBeInTheDocument();

        await user.click(screen.getByRole('button', { name: 'Sim, Excluir' }));

        await waitFor(() => {
            expect(mockProductService.delete).toHaveBeenCalledWith(1);
        });
    });

});