import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './Context/CartContext';
import { WardrobeProvider } from './Context/WardrobeContext';
import Home from './Pages/Home';
import Men from './Pages/Men';
import Women from './Pages/Women';
import ProductPage from './Pages/ProductPage';
import LoginPage from './Pages/LoginPage';
import Cart from './Pages/Cart';
import Skin from './Pages/Skin';
import ShopBySkinTone from './Pages/ShopBySkinTone';
import VirtualTryOn from './Pages/VirtualTryOn';
import Wardrobe from './Pages/Wardrobe';
import Recommendations from './Pages/Recommendations';


function App() {
  return (
    <CartProvider>
      <WardrobeProvider>
        <Router>
          <div>
            <Routes>
              <Route path="/home" element={<Home />} />
              <Route path="/product" element={<ProductPage />} />
              <Route path="/men" element={<Men />} />
              <Route path="/women" element={<Women />} />
              <Route path="/" element={<Home />} />
              <Route path="/Login" element={<LoginPage />} />
              <Route path="/Cart" element={<Cart />} />
              <Route path="/Skin" element={<Skin />} />
              <Route path="/shop-by-skintone" element={<ShopBySkinTone />} />
              <Route path="/virtual-tryon" element={<VirtualTryOn />} />
              <Route path="/wardrobe" element={<Wardrobe />} />
              <Route path="/recommendations" element={<Recommendations />} />
            </Routes>
          </div>
        </Router>
      </WardrobeProvider>
    </CartProvider>
  );
}


export default App;
