import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import apiClient from "../api/client";

export default function DashboardPage() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    apiClient
      .get("/dashboard/resumen/")
      .then((res) => setData(res.data))
      .catch(() => setError("No se pudo cargar el dashboard."));
  }, []);

  if (error) return <p className="error">{error}</p>;
  if (!data) return <p>Cargando...</p>;

  const { totales, productores_por_padron, productos_mas_acopiados, productos_mas_vendidos } = data;

  return (
    <section className="dashboard-page">
      <h1>Dashboard</h1>

      <div className="kpi-grid">
        <KpiCard label="Productores" value={totales.productores} />
        <KpiCard label="Padrones" value={totales.padrones} />
        <KpiCard label="Geocercas" value={totales.geocercas} />
        <KpiCard label="Compras registradas" value={totales.compras} />
        <KpiCard label="Ventas registradas" value={totales.ventas} />
        <KpiCard label="Monto acopiado" value={`S/ ${totales.monto_acopiado}`} />
        <KpiCard label="Monto vendido" value={`S/ ${totales.monto_vendido}`} />
      </div>

      <div className="chart-grid">
        <ChartCard title="Productores por padrón">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={productores_por_padron}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="padron__nombre_padron" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="total" fill="#2f7d4f" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Productos más acopiados">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={productos_mas_acopiados}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="producto__nombre_producto" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="total_cantidad" fill="#8a5a2f" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Productos más vendidos">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={productos_mas_vendidos}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="producto__nombre_producto" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="total_cantidad" fill="#2f5d8a" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </section>
  );
}

function KpiCard({ label, value }) {
  return (
    <div className="kpi-card">
      <span className="kpi-value">{value}</span>
      <span className="kpi-label">{label}</span>
    </div>
  );
}

function ChartCard({ title, children }) {
  return (
    <div className="chart-card">
      <h3>{title}</h3>
      {children}
    </div>
  );
}
