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
import ProductDetail from "./pages/ProductDetail";
import CheckoutPage from "./pages/CheckoutPage";
import { Toaster } from "react-hot-toast";

//  Import Admin Panel
import AdminLayout from "./admin/layout/AdminLayout";
 import DashboardPage from "./admin/pages/admin/Dashboard";
 import ProductsPage from "./admin/pages/admin/Products";
// import OrdersPage from "./admin/pages/OrdersPage";
// import UsersPage from "./admin/pages/UsersPage";

function App() {
  return (
    <Router>
      <Toaster position="top-right" />
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Admin routes (separate layout) */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<DashboardPage />} /> 
          <Route path="products" element={<ProductsPage />} />
          {/*  
          <Route path="orders" element={<OrdersPage />} />
          <Route path="users" element={<UsersPage />} /> */}
        </Route>

        {/* User routes with protected layout */}
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
          <Route path="/cart" element={<CartPage />} />
          <Route path="/wishlist" element={<WishlistPage />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/checkout" element={<CheckoutPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
