import {type RouteObject } from "react-router-dom";
import AdminLayout from "./layout/AdminLayout";
// import DashboardPage from "./pages/DashboardPage";
// import ProductsPage from "./pages/ProductsPage";
// import OrdersPage from "./pages/OrdersPage";
// import UsersPage from "./pages/UsersPage";

export const adminRoutes: RouteObject = {
  path: "/admin",
  element: <AdminLayout />,
  children: [
    // { index: true, element: <DashboardPage /> },
    // { path: "products", element: <ProductsPage /> },
    // { path: "orders", element: <OrdersPage /> },
    // { path: "users", element: <UsersPage /> },
  ],
};
