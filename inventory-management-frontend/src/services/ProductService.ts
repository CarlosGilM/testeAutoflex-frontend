import api from './api';

// --- Interfaces (DTOs) baseadas no Swagger ---

// Item da Receita (Envio e Recebimento)
export interface CompositionDTO {
    id?: number; // Opcional na criação
    rawMaterialCode: number;
    rawMaterialName?: string; // Vem do backend, não enviamos na criação
    quantityNeeded: number;
    productCode?: number;
}

// Produto (Leitura do Backend)
export interface ProductResponseDTO {
    code: number;
    name: string;
    price: number;
    compositions: CompositionDTO[];
}

// Produto (Envio para Criação/Edição)
export interface ProductRequestDTO {
    name: string;
    price: number;
    compositions: CompositionDTO[];
}

const ProductService = {
    // Listar todos
    getAll: async () => {
        const response = await api.get<ProductResponseDTO[]>('/products');
        return response.data;
    },

    // Criar (Aceita receita vazia ou preenchida)
    create: async (data: ProductRequestDTO) => {
        const response = await api.post<ProductResponseDTO>('/products', data);
        return response.data;
    },

    // Atualizar
    update: async (code: number, data: ProductRequestDTO) => {
        const response = await api.put<ProductResponseDTO>(`/products/${code}`, data);
        return response.data;
    },

    // Deletar
    delete: async (code: number) => {
        await api.delete(`/products/${code}`);
    }
};

export default ProductService;