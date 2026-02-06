import api from './api';

export interface CompositionDTO {
    id?: number;
    rawMaterialCode: number;
    rawMaterialName?: string;
    quantityNeeded: number;
    productCode?: number;
}

export interface ProductResponseDTO {
    code: number;
    name: string;
    price: number;
    compositions: CompositionDTO[];
}

export interface ProductRequestDTO {
    name: string;
    price: number;
    compositions: CompositionDTO[];
}

const ProductService = {
    getAll: async () => {
        const response = await api.get<ProductResponseDTO[]>('/products');
        return response.data;
    },

    create: async (data: ProductRequestDTO) => {
        const response = await api.post<ProductResponseDTO>('/products', data);
        return response.data;
    },

    update: async (code: number, data: ProductRequestDTO) => {
        const response = await api.put<ProductResponseDTO>(`/products/${code}`, data);
        return response.data;
    },

    delete: async (code: number) => {
        await api.delete(`/products/${code}`);
    }
};

export default ProductService;