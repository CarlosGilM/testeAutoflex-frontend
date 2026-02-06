import { describe, test, expect, vi, beforeEach, type Mock } from 'vitest';
import RawMaterialsService from './RawMaterialsService';
import api from './api';

vi.mock('./api');

const mockApi = api as unknown as {
    get: Mock;
    post: Mock;
    put: Mock;
    delete: Mock;
};

describe('RawMaterialsService', () => {

    beforeEach(() => {
        vi.clearAllMocks();
    });

    test('getAll -> deve chamar o método GET na url correta', async () => {
        const mockData = [
            { code: 1, name: 'Aço', stockQuantity: 10 },
            { code: 2, name: 'Ferro', stockQuantity: 5 }
        ];

        mockApi.get.mockResolvedValue({ data: mockData });

        const result = await RawMaterialsService.getAll();

        expect(mockApi.get).toHaveBeenCalledWith('/raw-materials');
        expect(result).toEqual(mockData);
    });

    test('create -> deve chamar o método POST com o payload correto', async () => {
        const payload = { name: 'Madeira', stockQuantity: 50 };
        const mockResponse = { code: 3, ...payload };

        mockApi.post.mockResolvedValue({ data: mockResponse });

        const result = await RawMaterialsService.create(payload);

        expect(mockApi.post).toHaveBeenCalledWith('/raw-materials', payload);
        expect(result).toEqual(mockResponse);
    });

    test('update -> deve chamar o método PUT com código e payload', async () => {
        const code = 10;
        const payload = { name: 'Aço Editado', stockQuantity: 15 };
        const mockResponse = { code, ...payload };

        mockApi.put.mockResolvedValue({ data: mockResponse });

        await RawMaterialsService.update(code, payload);

        expect(mockApi.put).toHaveBeenCalledWith(`/raw-materials/${code}`, payload);
    });

    test('delete -> deve chamar o método DELETE com a URL correta', async () => {
        const code = 99;

        mockApi.delete.mockResolvedValue({});

        await RawMaterialsService.delete(code);

        expect(mockApi.delete).toHaveBeenCalledWith(`/raw-materials/${code}`);
    });
});