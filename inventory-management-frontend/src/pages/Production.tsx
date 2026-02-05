import { useState } from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle } from 'lucide-react';

// Interface atualizada (Sem o limitedBy)
interface ProductionSuggestion {
    id: number;
    name: string;
    code: string;
    quantity: number;
    unitValue: number;
    totalValue: number;
}

export default function Production() {
    // Dados Mockados atualizados
    const mockData: ProductionSuggestion[] = [
        {
            id: 1,
            name: 'Xisculos',
            code: 'zkjsalkad',
            quantity: 20,
            unitValue: 20.00,
            totalValue: 400.00,
        },
        {
            id: 2,
            name: 'Mesa Industrial',
            code: 'MSA-200',
            quantity: 5,
            unitValue: 150.00,
            totalValue: 750.00,
        }
    ];

    const [suggestions, setSuggestions] = useState<ProductionSuggestion[]>([]);

    const toggleSimulation = () => {
        if (suggestions.length > 0) {
            setSuggestions([]);
        } else {
            setSuggestions(mockData);
        }
    };

    return (
        <div className="page-container">

            {/* Botão de Simulação (Temporário) */}
            <div style={{ marginBottom: 20, textAlign: 'right' }}>
                <button onClick={toggleSimulation} style={{ padding: '8px 16px', cursor: 'pointer', fontSize: '0.8rem', borderRadius: '6px', border: '1px solid #cbd5e1', background: 'white' }}>
                    🔄 Simular: {suggestions.length > 0 ? 'Ver Vazio' : 'Ver Lista'}
                </button>
            </div>

            <header className="page-header">
                <div className="header-content">
                    <Link to="/" className="back-link">← Voltar</Link>
                    <h1 className="page-title">Plano de Produção</h1>
                    <p className="page-subtitle">Produtos priorizados por valor. Produtos mais valiosos aparecem primeiro.</p>
                </div>
            </header>

            {/* --- CONTEÚDO --- */}
            {suggestions.length === 0 ? (
                // ESTADO VAZIO
                <div className="empty-production-card">
                    <div className="warning-icon-box">
                        <AlertTriangle size={48} />
                    </div>
                    <h2>Nenhuma Produção Possível</h2>
                    <p>
                        Não há produtos que possam ser fabricados com o estoque atual de matérias-primas.
                        Adicione mais materiais ou crie produtos com os ingredientes disponíveis.
                    </p>
                </div>
            ) : (
                // LISTA DE SUGESTÕES
                <div className="production-list">
                    {suggestions.map((item, index) => (
                        <div key={item.id} className="production-card">

                            {/* Lado Esquerdo */}
                            <div className="prod-left">
                                <div className="rank-badge">{index + 1}</div>
                                <div className="prod-info">
                                    <h3>{item.name}</h3>
                                    <span className="prod-code">Cód: {item.code}</span>
                                    {/* REMOVIDO O LIMITED BY AQUI */}
                                </div>
                            </div>

                            {/* Lado Direito */}
                            <div className="prod-right">
                                <div className="stat-box">
                                    <span className="stat-label">Qtd</span>
                                    <span className="stat-value">{item.quantity}</span>
                                </div>

                                <div className="stat-box">
                                    <span className="stat-label">Valor Unit.</span>
                                    <span className="stat-value">
                                        {item.unitValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                    </span>
                                </div>

                                <div className="total-badge">
                                    {item.totalValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                </div>
                            </div>

                        </div>
                    ))}
                </div>
            )}

        </div>
    );
}