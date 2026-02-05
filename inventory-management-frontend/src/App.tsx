import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import RawMaterials from './pages/RawMaterials';
import Production from './pages/Production';
import Products from './pages/Products';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />} />
                { }
                <Route path="/products" element={<Products />} />
                <Route path="/raw-materials" element={<RawMaterials />} />
                <Route path="/production" element={<Production />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;