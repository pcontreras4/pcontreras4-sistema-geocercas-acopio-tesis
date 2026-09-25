import { useEffect, useState } from "react";
import apiClient from "../api/client";
import { useAuth } from "../context/AuthContext";
import useApiResource from "../hooks/useApiResource";

const formato = new Intl.NumberFormat("es-PE", { maximumFractionDigits: 2 });

function SelectorAcopiador({ value, onChange }) {
  const acopiadores = useApiResource("acopiadores");
  return (
    <div className="filtro">
      <label>Acopiador</label>
      <select value={value} onChange={(e) => onChange(e.target.value)}>
        <option value="">Todos (consolidado)</option>
        {acopiadores.items.map((a) => (
          <option key={a.id} value={a.id}>
            {a.first_name} {a.last_name} ({a.username})
          </option>
        ))}
      </select>
    </div>
  );
}

export default function InventarioPage() {
  const { isAdmin } = useAuth();
  const [acopiador, setAcopiador] = useState("");
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    apiClient
      .get("/inventario/", { params: acopiador ? { acopiador } : {} })
      .then((res) => setProductos(res.data.productos))
      .catch(() => setError("No se pudo cargar el inventario."))
      .finally(() => setLoading(false));
  }, [acopiador]);

  return (
    <section className="crud-page">
      <h1>Inventario</h1>
      <p className="nota">
        Existencia teórica: total comprado menos total vendido, por producto y clasificación.
      </p>

      {isAdmin && <SelectorAcopiador value={acopiador} onChange={setAcopiador} />}

      {loading && <p>Cargando...</p>}
      {error && <p className="error">{error}</p>}
      {!loading && !error && productos.length === 0 && (
        <p>Aún no hay compras registradas.</p>
      )}

      <div className="inventario-grid">
        {productos.map((p) => (
          <div key={p.producto} className="inv-card">
            <div className="inv-header">
              <h3>
                {p.nombre_producto} <span className="unidad">({p.unidad_medida})</span>
              </h3>
              <span className={p.existencia_total < 0 ? "inv-total negativo" : "inv-total"}>
                {formato.format(p.existencia_total)}
              </span>
            </div>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Clasificación</th>
                  <th>Comprado</th>
                  <th>Vendido</th>
                  <th>Existencia</th>
                </tr>
              </thead>
              <tbody>
                {p.clasificaciones.map((c) => (
                  <tr key={c.clasificacion}>
                    <td>{c.nombre_clasificacion}</td>
                    <td>{formato.format(c.comprado)}</td>
                    <td>{formato.format(c.vendido)}</td>
                    <td className={c.existencia < 0 ? "negativo" : ""}>{formato.format(c.existencia)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </div>
    </section>
  );
}
