import { type RouteObject } from "react-router-dom";
import AdminLayout from "./layout/AdminLayout";
import DashboardPage from "./pages/DashboardPage";
import ProductsPage from "./pages/admin/Products";
import OrdersPage from "./pages/admin/Orders";
import UsersPage from "./pages/admin/Users";
import ProtectedRoute from "../routes/ProtectedRoute";


export const adminRoutes: RouteObject = {
  path: "/admin",
  element: (
    <ProtectedRoute>
        <AdminLayout />
    </ProtectedRoute>
  ),
  children: [
    { index: true, element: <DashboardPage /> },
    { path: "products", element: <ProductsPage /> },
    { path: "orders", element: <OrdersPage /> },
    { path: "users", element: <UsersPage /> },
  ],
};
