import { Package, Layers, Lightbulb, Factory } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Home() {
    return (
        <div className="home-container">

            { }
            <div className="brand-icon">
                <Factory size={40} /> { }
            </div>

            <h1 className="title">AutoFlex</h1>
            <p className="subtitle">Sistema de Gestão de Estoque</p>

            { }
            <div className="cards-grid">

                { }
                <Link to="/products" className="card">
                    <div className="icon-box icon-blue">
                        <Package size={32} />
                    </div>
                    <h3 className="card-title">Produtos</h3>
                    <p className="card-desc">
                        Gerencie seu catálogo de produtos e receitas de fabricação.
                    </p>
                </Link>

                { }
                <Link to="/raw-materials" className="card">
                    <div className="icon-box icon-green">
                        <Layers size={32} />
                    </div>
                    <h3 className="card-title">Matérias-Primas</h3>
                    <p className="card-desc">
                        Controle o estoque de insumos e materiais para produção.
                    </p>
                </Link>

                { }
                <Link to="/production" className="card">
                    <div className="icon-box icon-orange">
                        <Lightbulb size={32} />
                    </div>
                    <h3 className="card-title">Sugestões de Produção</h3>
                    <p className="card-desc">
                        Veja o que você pode produzir agora com o estoque atual.
                    </p>
                </Link>

            </div>
        </div>
    );
}