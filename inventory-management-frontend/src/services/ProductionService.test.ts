import { describe, test, expect, vi, beforeEach, type Mock } from 'vitest';
import ProductionService from './ProductionService';
import api from './api';

vi.mock('./api');

const mockApi = api as unknown as {
    get: Mock;
};

describe('ProductionService', () => {

    beforeEach(() => {
        vi.clearAllMocks();
    });

    test('getSuggestions -> deve chamar a URL específica de sugestão', async () => {
        const mockSuggestions = [
            {
                productCode: 1,
                productName: 'Mesa',
                productPrice: 100,
                quantityToProduce: 5,
                totalEstimatedValue: 500
            }
        ];

        mockApi.get.mockResolvedValue({ data: mockSuggestions });

        const result = await ProductionService.getSuggestions();

        expect(mockApi.get).toHaveBeenCalledWith('/products/production-suggestion');

        expect(result).toEqual(mockSuggestions);
    });
});