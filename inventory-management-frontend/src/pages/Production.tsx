import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, Loader2 } from 'lucide-react';
import ProductionService, { type ProductionSuggestionDTO } from '../services/ProductionService';

export default function Production() {
    const [suggestions, setSuggestions] = useState<ProductionSuggestionDTO[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchSuggestions = async () => {
            setIsLoading(true);
            try {
                const data = await ProductionService.getSuggestions();
                setSuggestions(data);
            } catch (error) {
                console.error("Erro ao carregar sugestões:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchSuggestions();
    }, []);

    return (
        <div className="page-container">
            <header className="page-header">
                <div className="header-content">
                    <Link to="/" className="back-link">← Voltar</Link>
                    <h1 className="page-title">Plano de Produção</h1>
                    <p className="page-subtitle">
                        Produtos priorizados por valor. Os itens mais rentáveis são sugeridos primeiro com base no estoque atual.
                    </p>
                </div>
            </header>

            {/* --- CONTEÚDO --- */}
            {isLoading ? (
                <div className="empty-state">
                    <Loader2 size={48} className="animate-spin" color="#2563eb" />
                    <p>Calculando melhor produção...</p>
                </div>
            ) : suggestions.length === 0 ? (
                <div className="empty-production-card">
                    <div className="warning-icon-box">
                        <AlertTriangle size={48} />
                    </div>
                    <h2>Nenhuma Produção Possível</h2>
                    <p>
                        Não há insumos suficientes para fabricar nenhum produto do catálogo no momento.
                        Reponha o estoque de matérias-primas para visualizar novas sugestões.
                    </p>
                </div>
            ) : (
                <div className="production-list">
                    {suggestions.map((item, index) => (
                        <div key={item.productCode} className="production-card">

                            <div className="prod-left">
                                <div className="rank-badge">{index + 1}</div>
                                <div className="prod-info">
                                    <h3>{item.productName}</h3>
                                    <span className="prod-code">Cód: {item.productCode}</span>
                                </div>
                            </div>

                            <div className="prod-right">
                                <div className="stat-box">
                                    <span className="stat-label">Qtd</span>
                                    <span className="stat-value">{item.quantityToProduce}</span>
                                </div>

                                <div className="stat-box">
                                    <span className="stat-label">Valor Unit.</span>
                                    <span className="stat-value">
                                        {item.productPrice.toLocaleString('pt-BR', {
                                            style: 'currency',
                                            currency: 'BRL'
                                        })}
                                    </span>
                                </div>

                                <div className="total-badge">
                                    {item.totalEstimatedValue.toLocaleString('pt-BR', {
                                        style: 'currency',
                                        currency: 'BRL'
                                    })}
                                </div>
                            </div>

                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}