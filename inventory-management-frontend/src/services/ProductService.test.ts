import { describe, test, expect, vi, beforeEach, type Mock } from 'vitest';
import ProductService from './ProductService';
import api from './api';

vi.mock('./api');

const mockApi = api as unknown as {
    get: Mock;
    post: Mock;
    put: Mock;
    delete: Mock;
};

describe('ProductService', () => {

    beforeEach(() => {
        vi.clearAllMocks();
    });

    test('getAll -> deve chamar GET /products', async () => {
        const mockProducts = [
            { code: 1, name: 'Bolo', price: 20, compositions: [] }
        ];

        mockApi.get.mockResolvedValue({ data: mockProducts });

        const result = await ProductService.getAll();

        expect(mockApi.get).toHaveBeenCalledWith('/products');
        expect(result).toEqual(mockProducts);
    });

    test('create -> deve chamar POST /products com o DTO completo', async () => {
        const payload = {
            name: 'Bolo de Cenoura',
            price: 25.50,
            compositions: [
                { rawMaterialCode: 10, quantityNeeded: 2 }
            ]
        };

        const mockResponse = { code: 5, ...payload };

        mockApi.post.mockResolvedValue({ data: mockResponse });

        const result = await ProductService.create(payload);

        expect(mockApi.post).toHaveBeenCalledWith('/products', payload);
        expect(result).toEqual(mockResponse);
    });

    test('update -> deve chamar PUT /products/{code} com os dados', async () => {
        const code = 5;
        const payload = {
            name: 'Bolo Editado',
            price: 30.00,
            compositions: []
        };

        mockApi.put.mockResolvedValue({ data: { code, ...payload } });

        await ProductService.update(code, payload);

        expect(mockApi.put).toHaveBeenCalledWith(`/products/${code}`, payload);
    });

    test('delete -> deve chamar DELETE /products/{code}', async () => {
        const code = 123;
        
        mockApi.delete.mockResolvedValue({});

        await ProductService.delete(code);

        expect(mockApi.delete).toHaveBeenCalledWith(`/products/${code}`);
    });
});