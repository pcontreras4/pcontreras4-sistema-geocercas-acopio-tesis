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

export default function AppLayout() {
  const { logout } = useAuth();

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <h2>Acopio Agrícola</h2>
        <nav>
          {NAV_ITEMS.map((item) => (
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
