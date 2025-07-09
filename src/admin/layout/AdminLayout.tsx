import { Outlet, NavLink } from "react-router-dom";
import { Home, Package, ShoppingCart, Users } from "lucide-react";

export default function AdminLayout() {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-100 p-4 space-y-4 border-r">
        <h2 className="text-lg font-bold mb-6">Admin Panel</h2>
        <nav className="space-y-2">
          <NavItem to="/admin"> <Home size={18} /> Dashboard </NavItem>
          <NavItem to="/admin/products"> <Package size={18} /> Produse </NavItem>
          <NavItem to="/admin/orders"> <ShoppingCart size={18} /> Comenzi </NavItem>
          <NavItem to="/admin/users"> <Users size={18} /> Utilizatori </NavItem>
        </nav>
      </aside>

      {/* Content */}
      <main className="flex-1 p-6 bg-white">
        <Outlet />
      </main>
    </div>
  );
}

function NavItem({ to, children }: { to: string; children: React.ReactNode }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center gap-2 p-2 rounded hover:bg-gray-200 ${isActive ? "bg-gray-300 font-medium" : ""}`
      }
    >
      {children}
    </NavLink>
  );
}
