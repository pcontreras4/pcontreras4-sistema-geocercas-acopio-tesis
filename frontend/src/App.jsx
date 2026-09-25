import { Navigate, Route, Routes } from "react-router-dom";
import AdminRoute from "./components/AdminRoute";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";
import AppLayout from "./layout/AppLayout";
import AcopiadoresPage from "./pages/AcopiadoresPage";
import ClasificacionesPage from "./pages/ClasificacionesPage";
import ComprasPage from "./pages/ComprasPage";
import DashboardPage from "./pages/DashboardPage";
import GeocercasPage from "./pages/GeocercasPage";
import InventarioPage from "./pages/InventarioPage";
import LoginPage from "./pages/LoginPage";
import PadronesPage from "./pages/PadronesPage";
import ProductoresPage from "./pages/ProductoresPage";
import ProductosPage from "./pages/ProductosPage";
import SeguimientosPage from "./pages/SeguimientosPage";
import VentasPage from "./pages/VentasPage";

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/padrones" element={<PadronesPage />} />
            <Route path="/productores" element={<ProductoresPage />} />
            <Route path="/geocercas" element={<GeocercasPage />} />
            <Route path="/productos" element={<ProductosPage />} />
            <Route path="/clasificaciones" element={<ClasificacionesPage />} />
            <Route path="/seguimientos" element={<SeguimientosPage />} />
            <Route path="/compras" element={<ComprasPage />} />
            <Route path="/ventas" element={<VentasPage />} />
            <Route path="/inventario" element={<InventarioPage />} />
            <Route element={<AdminRoute />}>
              <Route path="/acopiadores" element={<AcopiadoresPage />} />
            </Route>
          </Route>
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  );
}
