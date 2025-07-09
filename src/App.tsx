// App.tsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProfilePage from "./pages/ProfilePage";
import ProtectedRoute from "./routes/ProtectedRoute";
import AppLayout from "./layout/AppLayout";
import ShopPage from "./pages/Shop";
import CartPage from "./pages/CartPage";
import WishlistPage from "./pages/WishlistPage";
import {Toaster} from "react-hot-toast";
import ProductDetail from "./pages/ProductDetail";

function App() {
  return (
    <Router>
        <Toaster position="top-right"/>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected routes inside layout */}
        <Route
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/" element={<Home />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/shop" element={<ShopPage />} />
          <Route path="/cart" element={<CartPage/>} />
          <Route path="/wishlist" element={<WishlistPage/>} />
          <Route path="/product/:id" element={<ProductDetail />} />

        
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
