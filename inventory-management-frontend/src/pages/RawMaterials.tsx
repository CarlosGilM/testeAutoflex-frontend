import { useState } from 'react';
import { Plus, Trash2, Box, X, Pencil, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Material {
    id: number;
    name: string;
    stock: number;
}

export default function RawMaterials() {
    const [materials, setMaterials] = useState<Material[]>([
        { id: 1, name: 'Chapa de Aço 5mm', stock: 120 },
        { id: 2, name: 'Parafusos M6', stock: 5000 },
        { id: 3, name: 'Tinta Epóxi Azul', stock: 45 },
        { id: 4, name: 'Cimento CP-II', stock: 10 },
    ]);

    // Estados dos Modais
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    // Estados de Dados Temporários
    const [currentMaterial, setCurrentMaterial] = useState<Material | null>(null); // Para Edição
    const [materialToDelete, setMaterialToDelete] = useState<Material | null>(null); // Para Exclusão

    // Formulário
    const [formName, setFormName] = useState('');
    const [formStock, setFormStock] = useState('');

    // --- FUNÇÕES ---

    // 1. ADICIONAR
    const handleAddSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formName || !formStock) return;
        const newMaterial = { id: Date.now(), name: formName, stock: Number(formStock) };
        setMaterials([...materials, newMaterial]);
        setIsAddModalOpen(false);
        setFormName(''); setFormStock('');
    };

    // 2. EDITAR
    const openEditModal = (material: Material) => {
        setCurrentMaterial(material);
        setFormName(material.name);
        setFormStock(material.stock.toString());
        setIsEditModalOpen(true);
    };

    const handleEditSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!currentMaterial) return;
        setMaterials(materials.map((item) =>
            item.id === currentMaterial.id ? { ...item, name: formName, stock: Number(formStock) } : item
        ));
        setIsEditModalOpen(false);
        setCurrentMaterial(null);
    };

    // 3. EXCLUIR (Com Modal Customizado)
    const openDeleteModal = (material: Material) => {
        setMaterialToDelete(material);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = () => {
        if (materialToDelete) {
            setMaterials(materials.filter((item) => item.id !== materialToDelete.id));
            setIsDeleteModalOpen(false);
            setMaterialToDelete(null);
        }
    };

    return (
        <div className="page-container">

            {/* Cabeçalho Alinhado */}
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
                {materials.length === 0 ? (
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
                                <tr key={material.id}>
                                    <td className="td-name">{material.name}</td>
                                    <td>
                                        <span className="stock-badge">
                                            {material.stock} Unidades
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

            {/* --- MODAL DE EXCLUSÃO (NOVO) --- */}
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