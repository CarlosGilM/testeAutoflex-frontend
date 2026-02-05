import { useState } from 'react';
import { Plus, Trash2, Pencil, Box, X, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';

// Interfaces
interface RecipeItem {
    materialId: number;
    materialName: string;
    quantity: number;
}

interface Product {
    id: number;
    code: string;
    name: string;
    value: number;
    recipe: RecipeItem[];
}

// Simulando matérias-primas
const availableMaterials = [
    { id: 1, name: 'Chapa de Aço 5mm' },
    { id: 2, name: 'Parafusos M6' },
    { id: 3, name: 'Tinta Epóxi Azul' },
    { id: 4, name: 'Cimento CP-II' },
    { id: 5, name: 'Madeira MDF' },
];

export default function Products() {
    const [products, setProducts] = useState<Product[]>([
        {
            id: 1,
            code: 'PROD8492',
            name: 'Xisculos',
            value: 20.00,
            recipe: [{ materialId: 1, materialName: 'Chapa de Aço 5mm', quantity: 1 }]
        }
    ]);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    const [currentId, setCurrentId] = useState<number | null>(null);
    const [productToDelete, setProductToDelete] = useState<Product | null>(null);

    // Formulário (Código removido do formulário visual, mas mantido no estado interno se for edição)
    const [editingCode, setEditingCode] = useState('');
    const [formName, setFormName] = useState('');
    const [formValue, setFormValue] = useState('');
    const [formRecipe, setFormRecipe] = useState<RecipeItem[]>([]);

    // Controles da Receita
    const [selectedMatId, setSelectedMatId] = useState('');
    const [selectedQty, setSelectedQty] = useState('1');

    // --- FUNÇÕES ---

    const openModal = (product?: Product) => {
        if (product) {
            setIsEditing(true);
            setCurrentId(product.id);
            setEditingCode(product.code); // Guarda o código existente
            setFormName(product.name);
            setFormValue(product.value.toString());
            setFormRecipe([...product.recipe]);
        } else {
            setIsEditing(false);
            setCurrentId(null);
            setEditingCode('');
            setFormName('');
            setFormValue('');
            setFormRecipe([]);
        }
        setSelectedMatId('');
        setSelectedQty('1');
        setIsModalOpen(true);
    };

    const addMaterialToRecipe = () => {
        if (!selectedMatId || !selectedQty) return;
        const material = availableMaterials.find(m => m.id === Number(selectedMatId));
        if (!material) return;

        const newItem: RecipeItem = {
            materialId: material.id,
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

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formName || !formValue) return;

        // Se for novo, gera um código aleatório. Se for edição, usa o antigo.
        const finalCode = isEditing ? editingCode : `PROD${Math.floor(Math.random() * 10000)}`;

        const productData = {
            code: finalCode,
            name: formName,
            value: Number(formValue),
            recipe: formRecipe
        };

        if (isEditing && currentId) {
            setProducts(products.map(p => p.id === currentId ? { ...productData, id: currentId } : p));
        } else {
            setProducts([...products, { ...productData, id: Date.now() }]);
        }

        setIsModalOpen(false);
    };

    const handleDelete = () => {
        if (productToDelete) {
            setProducts(products.filter(p => p.id !== productToDelete.id));
            setIsDeleteModalOpen(false);
            setProductToDelete(null);
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

            {/* TABELA */}
            <div className="table-container">
                {products.length === 0 ? (
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
                                <tr key={prod.id}>
                                    <td style={{ fontFamily: 'monospace', color: '#64748b' }}>{prod.code}</td>
                                    <td className="td-name">{prod.name}</td>
                                    <td>
                                        {prod.value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                    </td>
                                    <td>
                                        <span className="recipe-badge">
                                            {prod.recipe.length} {prod.recipe.length === 1 ? 'material' : 'materiais'}
                                        </span>
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

            {/* --- MODAL DE PRODUTO --- */}
            {isModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content modal-large">
                        <div className="modal-header">
                            <h2>{isEditing ? 'Editar Produto' : 'Novo Produto'}</h2>
                            <button onClick={() => setIsModalOpen(false)} className="btn-close"><X size={20} /></button>
                        </div>

                        <form onSubmit={handleSave}>
                            {/* CAMPO CÓDIGO REMOVIDO DAQUI */}

                            <div className="form-group">
                                <label>Nome do Produto</label>
                                <input
                                    type="text"
                                    placeholder="Nome do produto"
                                    value={formName}
                                    onChange={e => setFormName(e.target.value)}
                                    autoFocus // Foco automático no nome agora
                                />
                            </div>
                            <div className="form-group">
                                <label>Valor de Venda (R$)</label>
                                <input
                                    type="number"
                                    placeholder="0.00"
                                    value={formValue}
                                    onChange={e => setFormValue(e.target.value)}
                                />
                            </div>

                            <hr className="divider" />

                            {/* --- ÁREA DA RECEITA --- */}
                            <div className="form-group">
                                <label>Receita (Matérias-Primas)</label>

                                <div className="recipe-builder">
                                    {/* Select ocupa todo o espaço restante */}
                                    <select
                                        value={selectedMatId}
                                        onChange={(e) => setSelectedMatId(e.target.value)}
                                        className="recipe-select"
                                    >
                                        <option value="">Selecione um material...</option>
                                        {availableMaterials.map(m => (
                                            <option key={m.id} value={m.id}>{m.name}</option>
                                        ))}
                                    </select>

                                    {/* Input pequeno apenas para o número */}
                                    <input
                                        type="number"
                                        min="1"
                                        placeholder="Qtd"
                                        value={selectedQty}
                                        onChange={(e) => setSelectedQty(e.target.value)}
                                        className="recipe-qty"
                                    />

                                    <button type="button" onClick={addMaterialToRecipe} className="btn-add-recipe">
                                        <Plus size={20} />
                                    </button>
                                </div>

                                <div className="recipe-list">
                                    {formRecipe.length === 0 ? (
                                        <div className="recipe-empty">Nenhum material adicionado ainda.</div>
                                    ) : (
                                        formRecipe.map((item, idx) => (
                                            <div key={idx} className="recipe-item">
                                                <span>{item.materialName}</span>
                                                <div className="recipe-item-actions">
                                                    <span className="qty-tag">{item.quantity} un</span>
                                                    <button type="button" onClick={() => removeMaterialFromRecipe(idx)} className="btn-remove-recipe">
                                                        <Trash2 size={14} />
                                                    </button>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>

                            <div className="modal-actions">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="btn-secondary">Cancelar</button>
                                <button type="submit" className="btn-primary">
                                    {isEditing ? 'Salvar Alterações' : 'Criar Produto'}
                                </button>
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
                        <h2>Excluir Produto?</h2>
                        <p>Tem certeza que deseja excluir <strong>{productToDelete?.name}</strong>? Essa ação é irreversível.</p>
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