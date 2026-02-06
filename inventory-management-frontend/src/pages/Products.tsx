import { useState, useEffect } from 'react';
import { Plus, Trash2, Pencil, Box, X, AlertTriangle, Loader2, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import ProductService, { ProductResponseDTO } from '../services/ProductService';
import RawMaterialsService, { RawMaterialDTO } from '../services/RawMaterialsService';

interface FormRecipeItem {
    materialId: number;
    materialName: string;
    quantity: number;
}

export default function Products() {
    const [products, setProducts] = useState<ProductResponseDTO[]>([]);
    const [availableMaterials, setAvailableMaterials] = useState<RawMaterialDTO[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Modais
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false); // Modal de Detalhes
    const [isEditing, setIsEditing] = useState(false);

    // Seleção
    const [currentCode, setCurrentCode] = useState<number | null>(null);
    const [productToDelete, setProductToDelete] = useState<ProductResponseDTO | null>(null);
    const [productToView, setProductToView] = useState<ProductResponseDTO | null>(null);

    // Formulário
    const [formName, setFormName] = useState('');
    const [formValue, setFormValue] = useState('');
    const [formRecipe, setFormRecipe] = useState<FormRecipeItem[]>([]);

    // Controles da Receita
    const [selectedMatId, setSelectedMatId] = useState('');
    const [selectedQty, setSelectedQty] = useState('1');

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const [productsData, materialsData] = await Promise.all([
                ProductService.getAll(),
                RawMaterialsService.getAll()
            ]);
            setProducts(productsData);
            setAvailableMaterials(materialsData);
        } catch (error) {
            console.error("Erro ao carregar dados:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const openModal = (product?: ProductResponseDTO) => {
        setSelectedMatId('');
        setSelectedQty('1');

        if (product) {
            setIsEditing(true);
            setCurrentCode(product.code);
            setFormName(product.name);
            setFormValue(product.price.toString());
            const visualRecipe: FormRecipeItem[] = product.compositions.map(comp => ({
                materialId: comp.rawMaterialCode,
                materialName: comp.rawMaterialName || 'Material',
                quantity: comp.quantityNeeded
            }));
            setFormRecipe(visualRecipe);
        } else {
            setIsEditing(false);
            setCurrentCode(null);
            setFormName('');
            setFormValue('');
            setFormRecipe([]);
        }
        setIsModalOpen(true);
    };

    const openViewModal = (product: ProductResponseDTO) => {
        setProductToView(product);
        setIsViewModalOpen(true);
    };

    const addMaterialToRecipe = () => {
        if (!selectedMatId || !selectedQty) return;
        const matIdNum = Number(selectedMatId);
        const material = availableMaterials.find(m => m.code === matIdNum);
        if (!material) return;

        if (formRecipe.some(item => item.materialId === matIdNum)) {
            alert("Este material já está na receita.");
            return;
        }

        const newItem: FormRecipeItem = {
            materialId: material.code!,
            materialName: material.name,
            quantity: Number(selectedQty)
        };

        setFormRecipe([...formRecipe, newItem]);
        setSelectedMatId('');
        setSelectedQty('1');
    };

    const removeMaterialFromRecipe = (index: number) => {
        const newRecipe = [...formRecipe];
        newRecipe.splice(index, 1);
        setFormRecipe(newRecipe);
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();

        // REGRA DE NEGÓCIO: Mínimo 1 material para novos produtos
        if (!isEditing && formRecipe.length === 0) {
            alert("Erro: Um produto novo deve ter pelo menos 1 matéria-prima na receita.");
            return;
        }

        if (!formName || !formValue) return;

        const payload = {
            name: formName,
            price: Number(formValue),
            compositions: formRecipe.map(item => ({
                rawMaterialCode: item.materialId,
                quantityNeeded: item.quantity,
                productCode: currentCode || 0
            }))
        };

        try {
            if (isEditing && currentCode) {
                await ProductService.update(currentCode, payload);
            } else {
                await ProductService.create(payload);
            }
            await fetchData();
            setIsModalOpen(false);
        } catch (error) {
            console.error("Erro ao salvar:", error);
            alert("Erro ao salvar produto.");
        }
    };

    const handleDelete = async () => {
        if (productToDelete && productToDelete.code) {
            try {
                await ProductService.delete(productToDelete.code);
                await fetchData();
                setIsDeleteModalOpen(false);
                setProductToDelete(null);
            } catch (error) {
                alert("Erro ao excluir produto.");
            }
        }
    };

    return (
        <div className="page-container">
            <header className="page-header">
                <div className="header-content">
                    <Link to="/" className="back-link">← Voltar</Link>
                    <h1 className="page-title">Produtos</h1>
                    <p className="page-subtitle">Gerencie seu catálogo de produtos e receitas.</p>
                </div>
                <button onClick={() => openModal()} className="btn-primary">
                    <Plus size={20} />
                    Adicionar Produto
                </button>
            </header>

            <div className="table-container">
                {isLoading ? (
                    <div className="empty-state">
                        <Loader2 size={48} className="animate-spin" color="#2563eb" />
                        <p>Carregando catálogo...</p>
                    </div>
                ) : products.length === 0 ? (
                    <div className="empty-state">
                        <Box size={48} color="#cbd5e1" />
                        <p>Nenhum produto cadastrado.</p>
                    </div>
                ) : (
                    <table className="materials-table">
                        <thead>
                            <tr>
                                <th>Código</th>
                                <th style={{ width: '40%' }}>Nome</th>
                                <th>Valor (R$)</th>
                                <th>Receita</th>
                                <th style={{ textAlign: 'right' }}>Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map((prod) => (
                                <tr key={prod.code}>
                                    <td style={{ fontFamily: 'monospace', color: '#64748b' }}>{prod.code}</td>
                                    <td className="td-name">{prod.name}</td>
                                    <td>{prod.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
                                    <td>
                                        <button
                                            className="btn-view-recipe"
                                            onClick={() => openViewModal(prod)}
                                        >
                                            <Eye size={16} />
                                            {prod.compositions ? prod.compositions.length : 0} itens
                                        </button>
                                    </td>
                                    <td className="td-actions">
                                        <button className="btn-icon btn-edit" onClick={() => openModal(prod)} title="Editar">
                                            <Pencil size={18} />
                                        </button>
                                        <button className="btn-icon btn-delete" onClick={() => { setProductToDelete(prod); setIsDeleteModalOpen(true); }} title="Excluir">
                                            <Trash2 size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* --- MODAL DE PRODUTO (CREATE/EDIT) --- */}
            {isModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content modal-large">
                        <div className="modal-header">
                            <h2>{isEditing ? 'Editar Produto' : 'Novo Produto'}</h2>
                            <button onClick={() => setIsModalOpen(false)} className="btn-close"><X size={20} /></button>
                        </div>

                        <form onSubmit={handleSave}>
                            <div className="form-group">
                                <label>Nome do Produto</label>
                                <input type="text" value={formName} onChange={e => setFormName(e.target.value)} autoFocus />
                            </div>
                            <div className="form-group">
                                <label>Valor de Venda (R$)</label>
                                <input type="number" value={formValue} onChange={e => setFormValue(e.target.value)} />
                            </div>

                            <hr className="divider" />

                            {/* RECEITA: Só aparece no cadastro */}
                            {!isEditing && (
                                <div className="form-group">
                                    <label>Receita (Matérias-Primas)</label>
                                    <div className="recipe-builder">
                                        <select value={selectedMatId} onChange={(e) => setSelectedMatId(e.target.value)} className="recipe-select">
                                            <option value="">Selecione um material...</option>
                                            {availableMaterials.map(m => (
                                                <option key={m.code} value={m.code}>{m.name}</option>
                                            ))}
                                        </select>
                                        <input type="number" min="1" value={selectedQty} onChange={(e) => setSelectedQty(e.target.value)} className="recipe-qty" />
                                        <button type="button" onClick={addMaterialToRecipe} className="btn-add-recipe"><Plus size={20} /></button>
                                    </div>

                                    <div className="recipe-list">
                                        {formRecipe.length === 0 ? (
                                            <div className="recipe-empty">Nenhum material adicionado.</div>
                                        ) : (
                                            formRecipe.map((item, idx) => (
                                                <div key={idx} className="recipe-item">
                                                    <span>{item.materialName}</span>
                                                    <div className="recipe-item-actions">
                                                        <span className="qty-tag">{item.quantity} un</span>
                                                        <button type="button" onClick={() => removeMaterialFromRecipe(idx)} className="btn-remove-recipe"><Trash2 size={14} /></button>
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>
                            )}

                            {isEditing && (
                                <div className="info-box">
                                    <AlertTriangle size={20} />
                                    <p>A receita não pode ser alterada. Para mudar a composição, exclua e crie um novo produto.</p>
                                </div>
                            )}

                            <div className="modal-actions">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="btn-secondary">Cancelar</button>
                                <button type="submit" className="btn-primary">{isEditing ? 'Salvar Alterações' : 'Criar Produto'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* --- MODAL DE DETALHES DA RECEITA (VIEW) --- */}
            {isViewModalOpen && productToView && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div className="modal-header">
                            <div>
                                <h2>Composição do Produto</h2>
                                <p style={{ fontSize: '0.9rem', color: '#64748b' }}>{productToView.name}</p>
                            </div>
                            <button onClick={() => setIsViewModalOpen(false)} className="btn-close"><X size={20} /></button>
                        </div>

                        <div className="view-recipe-container">
                            {productToView.compositions.map((comp, idx) => (
                                <div key={idx} className="view-recipe-item">
                                    <span className="mat-name">{comp.rawMaterialName}</span>
                                    <span className="mat-qty">{comp.quantityNeeded} unidades</span>
                                </div>
                            ))}
                        </div>

                        <div className="modal-actions">
                            <button onClick={() => setIsViewModalOpen(false)} className="btn-primary">Fechar</button>
                        </div>
                    </div>
                </div>
            )}

            {/* --- MODAL DE EXCLUSÃO --- */}
            {isDeleteModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content modal-danger">
                        <div className="modal-icon-danger"><AlertTriangle size={32} /></div>
                        <h2>Excluir Produto?</h2>
                        <p>Tem certeza que deseja excluir <strong>{productToDelete?.name}</strong>?</p>
                        <div className="modal-actions">
                            <button onClick={() => setIsDeleteModalOpen(false)} className="btn-secondary">Cancelar</button>
                            <button onClick={handleDelete} className="btn-danger">Sim, Excluir</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}