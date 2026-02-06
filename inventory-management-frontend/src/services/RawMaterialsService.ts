import api from './api';

export interface RawMaterialDTO {
    code?: number;
    name: string;
    stockQuantity: number;
}

const RawMaterialsService = {
    getAll: async () => {
        const response = await api.get<RawMaterialDTO[]>('/raw-materials');
        return response.data;
    },

    create: async (data: RawMaterialDTO) => {
        const response = await api.post<RawMaterialDTO>('/raw-materials', data);
        return response.data;
    },

    update: async (code: number, data: RawMaterialDTO) => {
        const response = await api.put<RawMaterialDTO>(`/raw-materials/${code}`, data);
        return response.data;
    },

    delete: async (code: number) => {
        await api.delete(`/raw-materials/${code}`);
    }
};

export default RawMaterialsService;