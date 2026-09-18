import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const NAV_ITEMS = [
  { to: "/", label: "Dashboard", end: true },
  { to: "/padrones", label: "Padrones" },
  { to: "/productores", label: "Productores" },
  { to: "/geocercas", label: "Geocercas" },
  { to: "/productos", label: "Productos" },
  { to: "/clasificaciones", label: "Clasificaciones" },
  { to: "/seguimientos", label: "Seguimiento" },
  { to: "/compras", label: "Acopio (compras)" },
  { to: "/ventas", label: "Ventas" },
];

const ADMIN_NAV_ITEM = { to: "/acopiadores", label: "Acopiadores" };

export default function AppLayout() {
  const { logout, isAdmin, user } = useAuth();
  const navItems = isAdmin ? [...NAV_ITEMS, ADMIN_NAV_ITEM] : NAV_ITEMS;

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <h2>Acopio Agrícola</h2>
        {user && (
          <p className="sidebar-user">
            {user.first_name || user.username}
            <span className="sidebar-role">{isAdmin ? "Administrador" : "Acopiador"}</span>
          </p>
        )}
        <nav>
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        <button className="logout-btn" onClick={logout}>
          Cerrar sesión
        </button>
      </aside>
      <main className="content">
        <Outlet />
      </main>
    </div>
  );
}
