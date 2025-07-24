// src/App.tsx
import React  from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { adminRoutes } from "./admin/routes";
import AboutProject from "./pages/AboutProject";
const Login = React.lazy(() => import("./pages/Login")); 
const Register = React.lazy(() => import("./pages/Register"));
const AppLayout = React.lazy(() => import("./layout/AppLayout"));
const ProfilePage = React.lazy(() => import("./pages/ProfilePage"));
const ShopPage = React.lazy(() => import("./pages/Shop"));
const CartPage = React.lazy(() => import("./pages/CartPage"));
const WishlistPage = React.lazy(() => import("./pages/WishlistPage"));
const ProductDetail = React.lazy(() => import("./pages/ProductDetail"));
const CheckoutPage = React.lazy(() => import("./pages/CheckoutPage"));
const ProtectedRoute = React.lazy(() => import("./routes/ProtectedRoute"));
const OnBoarding = React.lazy(() => import("./pages/OnBoarding"));


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
        <Route index path="/onboarding" element={<OnBoarding />} />
        <Route path="/about" element={<AboutProject/>} />
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