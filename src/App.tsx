// src/App.tsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { adminRoutes } from "./admin/routes";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AppLayout from "./layout/AppLayout";
import ProfilePage from "./pages/ProfilePage";
import ShopPage from "./pages/Shop";
import CartPage from "./pages/CartPage";
import WishlistPage from "./pages/WishlistPage";
import ProductDetail from "./pages/ProductDetail";
import CheckoutPage from "./pages/CheckoutPage";
import ProtectedRoute from "./routes/ProtectedRoute";
// import NotFoundPage from "./pages/NotFoundPage"; // Adaugă o pagină pentru 404

function App() {
  return (
    <Router>
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#333',
            color: '#fff',
          },
        }}
      />
      
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Admin routes */}
        <Route path={adminRoutes.path} element={adminRoutes.element}>
          {adminRoutes.children?.map((child) => (
            <Route
              key={child.path || "index"}
              index={child.index}
              path={child.path}
              element={child.element}
            />
          ))}
        </Route>

        {/* Protected user routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
        
          <Route path="profile" element={<ProfilePage />} />
          <Route index path="/" element={<ShopPage />} />
          <Route path="cart" element={<CartPage />} />
          <Route path="wishlist" element={<WishlistPage />} />
          <Route path="product/:id" element={<ProductDetail />} />
          <Route path="checkout" element={<CheckoutPage />} />
          
          {/* Optional: Settings page or other protected routes */}
        </Route>

     
      </Routes>
    </Router>
  );
}

export default App;