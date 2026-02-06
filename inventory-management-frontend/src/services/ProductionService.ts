import api from './api';

export interface ProductionSuggestionDTO {
    productCode: number;
    productName: string;
    productPrice: number;
    quantityToProduce: number;
    totalEstimatedValue: number;
}

const ProductionService = {
    getSuggestions: async () => {
        const response = await api.get<ProductionSuggestionDTO[]>('/products/production-suggestion');
        return response.data;
    }
};

export default ProductionService;