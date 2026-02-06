import { useState, useEffect } from 'react';
import { Plus, Trash2, Box, X, Pencil, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';
import RawMaterialsService, { RawMaterialDTO } from '../services/RawMaterialsService';

export default function RawMaterials() {
    // Estado agora tipado com o DTO do backend
    const [materials, setMaterials] = useState<RawMaterialDTO[]>([]);

    // Estados de Loading (Opcional, mas recomendado para UX)
    const [isLoading, setIsLoading] = useState(true);

    // Estados dos Modais
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    // Estados de Dados Temporários
    const [currentMaterial, setCurrentMaterial] = useState<RawMaterialDTO | null>(null);
    const [materialToDelete, setMaterialToDelete] = useState<RawMaterialDTO | null>(null);

    // Formulário
    const [formName, setFormName] = useState('');
    const [formStock, setFormStock] = useState('');


    // Carregar dados do Backend
    const fetchMaterials = async () => {
        try {
            const data = await RawMaterialsService.getAll();
            setMaterials(data);
        } catch (error) {
            console.error("Erro ao buscar materiais:", error);
            alert("Erro ao conectar com o servidor.");
        } finally {
            setIsLoading(false);
        }
    };

    // Executa ao abrir a página
    useEffect(() => {
        fetchMaterials();
    }, []);

    // 1. ADICIONAR
    const handleAddSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formName || !formStock) return;

        try {
            await RawMaterialsService.create({
                name: formName,
                stockQuantity: Number(formStock)
            });

            // Recarrega a lista e fecha o modal
            await fetchMaterials();
            setIsAddModalOpen(false);
            setFormName('');
            setFormStock('');
        } catch (error) {
            console.error("Erro ao criar:", error);
            alert("Erro ao salvar material.");
        }
    };

    // 2. PREPARAR EDIÇÃO
    const openEditModal = (material: RawMaterialDTO) => {
        setCurrentMaterial(material);
        setFormName(material.name);
        setFormStock(material.stockQuantity.toString()); // Backend usa stockQuantity
        setIsEditModalOpen(true);
    };

    // SALVAR EDIÇÃO
    const handleEditSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!currentMaterial || !currentMaterial.code) return;

        try {
            await RawMaterialsService.update(currentMaterial.code, {
                name: formName,
                stockQuantity: Number(formStock)
            });

            await fetchMaterials();
            setIsEditModalOpen(false);
            setCurrentMaterial(null);
        } catch (error) {
            console.error("Erro ao editar:", error);
            alert("Erro ao atualizar material.");
        }
    };

    // 3. EXCLUIR
    const openDeleteModal = (material: RawMaterialDTO) => {
        setMaterialToDelete(material);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        if (materialToDelete && materialToDelete.code) {
            try {
                await RawMaterialsService.delete(materialToDelete.code);
                await fetchMaterials();
                setIsDeleteModalOpen(false);
                setMaterialToDelete(null);
            } catch (error: any) { // Tipamos como 'any' para acessar as propriedades do axios
                console.error("Erro ao excluir:", error);

                // Verifica se o erro veio do backend e qual o código
                if (error.response && error.response.status === 409) {
                    alert("Não é possível excluir: Este material está sendo usado em uma receita de produto.");
                } else {
                    alert("Ocorreu um erro ao tentar excluir o material. Tente novamente.");
                }

                // Opcional: Fechar o modal mesmo com erro, ou manter aberto para o usuário tentar outra coisa
                setIsDeleteModalOpen(false);
            }
        }
    };

    return (
        <div className="page-container">

            <header className="page-header">
                <div className="header-content">
                    <Link to="/" className="back-link">← Voltar</Link>
                    <h1 className="page-title">Matérias-Primas</h1>
                    <p className="page-subtitle">Gerencie o estoque dos insumos da fábrica.</p>
                </div>
                <button onClick={() => setIsAddModalOpen(true)} className="btn-primary">
                    <Plus size={20} />
                    Adicionar Material
                </button>
            </header>

            {/* TABELA DE MATERIAIS */}
            <div className="table-container">
                {isLoading ? (
                    <div className="empty-state"><p>Carregando dados...</p></div>
                ) : materials.length === 0 ? (
                    <div className="empty-state">
                        <Box size={48} color="#cbd5e1" />
                        <p>Nenhum material cadastrado.</p>
                    </div>
                ) : (
                    <table className="materials-table">
                        <thead>
                            <tr>
                                <th style={{ width: '60%' }}>Nome do Material</th>
                                <th>Estoque Atual</th>
                                <th style={{ textAlign: 'right' }}>Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {materials.map((material) => (
                                <tr key={material.code}> { }
                                    <td className="td-name">{material.name}</td>
                                    <td>
                                        <span className="stock-badge">
                                            { }
                                            {material.stockQuantity} Unidades
                                        </span>
                                    </td>
                                    <td className="td-actions">
                                        <button
                                            className="btn-icon btn-edit"
                                            onClick={() => openEditModal(material)}
                                            title="Editar"
                                        >
                                            <Pencil size={18} />
                                        </button>
                                        <button
                                            className="btn-icon btn-delete"
                                            onClick={() => openDeleteModal(material)}
                                            title="Excluir"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* --- MODAL ADICIONAR --- */}
            {isAddModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h2>Novo Material</h2>
                            <button onClick={() => setIsAddModalOpen(false)} className="btn-close"><X size={20} /></button>
                        </div>
                        <form onSubmit={handleAddSubmit}>
                            <div className="form-group">
                                <label>Nome</label>
                                <input type="text" placeholder="Ex: Aço 1020" value={formName} onChange={e => setFormName(e.target.value)} autoFocus />
                            </div>
                            <div className="form-group">
                                <label>Estoque</label>
                                <input type="number" placeholder="0" value={formStock} onChange={e => setFormStock(e.target.value)} />
                            </div>
                            <div className="modal-actions">
                                <button type="button" onClick={() => setIsAddModalOpen(false)} className="btn-secondary">Cancelar</button>
                                <button type="submit" className="btn-primary">Salvar</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* --- MODAL EDITAR --- */}
            {isEditModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h2>Editar Material</h2>
                            <button onClick={() => setIsEditModalOpen(false)} className="btn-close"><X size={20} /></button>
                        </div>
                        <form onSubmit={handleEditSubmit}>
                            <div className="form-group">
                                <label>Nome</label>
                                <input type="text" value={formName} onChange={e => setFormName(e.target.value)} />
                            </div>
                            <div className="form-group">
                                <label>Estoque</label>
                                <input type="number" value={formStock} onChange={e => setFormStock(e.target.value)} />
                            </div>
                            <div className="modal-actions">
                                <button type="button" onClick={() => setIsEditModalOpen(false)} className="btn-secondary">Cancelar</button>
                                <button type="submit" className="btn-primary">Salvar Alterações</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* --- MODAL DE EXCLUSÃO --- */}
            {isDeleteModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content modal-danger">
                        <div className="modal-icon-danger">
                            <AlertTriangle size={32} />
                        </div>
                        <h2>Excluir Material?</h2>
                        <p>Você tem certeza que deseja excluir <strong>{materialToDelete?.name}</strong>? Essa ação não pode ser desfeita.</p>

                        <div className="modal-actions">
                            <button onClick={() => setIsDeleteModalOpen(false)} className="btn-secondary">Cancelar</button>
                            <button onClick={confirmDelete} className="btn-danger">Sim, Excluir</button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}