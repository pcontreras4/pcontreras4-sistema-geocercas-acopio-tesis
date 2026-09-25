import { useCallback, useEffect, useState } from "react";
import apiClient from "../api/client";
import { useAuth } from "../context/AuthContext";
import useApiResource from "../hooks/useApiResource";

const EMPTY_DETALLE = { producto: "", clasificacion: "", cantidad: "", precio_unitario: "" };

export default function VentasPage() {
  const ventas = useApiResource("ventas");
  const productos = useApiResource("productos");
  const clasificaciones = useApiResource("clasificaciones");
  const { user } = useAuth();

  const [existencias, setExistencias] = useState({});

  const cargarExistencias = useCallback(() => {
    if (!user) return;
    apiClient.get("/inventario/", { params: { acopiador: user.id } }).then((res) => {
      const mapa = {};
      res.data.productos.forEach((p) =>
        p.clasificaciones.forEach((c) => {
          mapa[`${p.producto}-${c.clasificacion}`] = c.existencia;
        })
      );
      setExistencias(mapa);
    });
  }, [user]);

  useEffect(() => {
    cargarExistencias();
  }, [cargarExistencias]);

  const [cliente, setCliente] = useState("");
  const [puntoVenta, setPuntoVenta] = useState("");
  const [observacion, setObservacion] = useState("");
  const [detalles, setDetalles] = useState([{ ...EMPTY_DETALLE }]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  function updateDetalle(index, field, value) {
    setDetalles((prev) => prev.map((d, i) => (i === index ? { ...d, [field]: value } : d)));
  }

  function clasificacionesDe(productoId) {
    const producto = productos.items.find((p) => String(p.id) === String(productoId));
    return clasificaciones.items.filter((c) => producto?.clasificaciones.includes(c.id));
  }

  function cambiarProducto(index, productoId) {
    const opciones = clasificacionesDe(productoId);
    setDetalles((prev) =>
      prev.map((d, i) =>
        i === index
          ? { ...d, producto: productoId, clasificacion: opciones.length === 1 ? String(opciones[0].id) : "" }
          : d
      )
    );
  }

  function estadoLinea(d, i) {
    if (!d.producto || !d.clasificacion) return null;
    const clave = `${d.producto}-${d.clasificacion}`;
    const primera = detalles.findIndex((x) => `${x.producto}-${x.clasificacion}` === clave);
    if (primera !== i) {
      return { tipo: "error", texto: `Ya está en la línea ${primera + 1}: edita esa cantidad.` };
    }
    const disponible = existencias[clave] ?? 0;
    if (Number(d.cantidad) > disponible) {
      return { tipo: "error", texto: `Stock insuficiente. Disponible: ${disponible}` };
    }
    return { tipo: "ok", texto: `Disponible: ${disponible}` };
  }

  function addDetalle() {
    setDetalles((prev) => [...prev, { ...EMPTY_DETALLE }]);
  }

  function removeDetalle(index) {
    setDetalles((prev) => prev.filter((_, i) => i !== index));
  }

  function resetForm() {
    setCliente("");
    setPuntoVenta("");
    setObservacion("");
    setDetalles([{ ...EMPTY_DETALLE }]);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const payload = {
        cliente,
        punto_venta: puntoVenta,
        observacion,
        detalles: detalles
          .filter((d) => d.producto && d.clasificacion && d.cantidad && d.precio_unitario)
          .map((d) => ({
            producto: d.producto,
            clasificacion: d.clasificacion,
            cantidad: d.cantidad,
            precio_unitario: d.precio_unitario,
          })),
      };
      if (payload.detalles.length === 0) {
        setError("Agrega al menos un producto con cantidad y precio.");
        return;
      }
      if (detalles.some((d, i) => estadoLinea(d, i)?.tipo === "error")) {
        setError("Corrige las líneas marcadas en rojo antes de registrar la venta.");
        return;
      }
      await apiClient.post("/ventas/", payload);
      resetForm();
      await ventas.reload();
      cargarExistencias();
    } catch (err) {
      setError(err.response?.data?.detalles?.[0] ?? "No se pudo registrar la venta.");
    } finally {
      setSaving(false);
    }
  }

  async function handleEliminar(id) {
    if (!window.confirm("¿Eliminar esta venta?")) return;
    await ventas.deleteItem(id);
    cargarExistencias();
  }

  return (
    <section className="crud-page">
      <h1>Ventas</h1>

      <form className="crud-form" onSubmit={handleSubmit}>
        <div className="form-field">
          <label>Cliente</label>
          <input value={cliente} onChange={(e) => setCliente(e.target.value)} required />
        </div>
        <div className="form-field">
          <label>Punto de venta</label>
          <input value={puntoVenta} onChange={(e) => setPuntoVenta(e.target.value)} />
        </div>

        <h3>Productos vendidos</h3>
        {detalles.map((d, i) => (
          <div key={i}>
          <div className="detalle-row">
            <select value={d.producto} onChange={(e) => cambiarProducto(i, e.target.value)} required>
              <option value="">Producto...</option>
              {productos.items.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.nombre_producto}
                </option>
              ))}
            </select>
            <select
              value={d.clasificacion}
              onChange={(e) => updateDetalle(i, "clasificacion", e.target.value)}
              disabled={!d.producto}
              required
            >
              <option value="">Clasificación...</option>
              {clasificacionesDe(d.producto).map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nombre_clasificacion}
                </option>
              ))}
            </select>
            <input
              type="number"
              step="0.01"
              placeholder="Cantidad"
              value={d.cantidad}
              onChange={(e) => updateDetalle(i, "cantidad", e.target.value)}
              required
            />
            <input
              type="number"
              step="0.01"
              placeholder="Precio unitario"
              value={d.precio_unitario}
              onChange={(e) => updateDetalle(i, "precio_unitario", e.target.value)}
              required
            />
            {detalles.length > 1 && (
              <button type="button" onClick={() => removeDetalle(i)}>
                Quitar
              </button>
            )}
          </div>
          {estadoLinea(d, i) && (
            <p className={`linea-aviso ${estadoLinea(d, i).tipo}`}>{estadoLinea(d, i).texto}</p>
          )}
          </div>
        ))}
        <button type="button" onClick={addDetalle}>
          + Agregar producto
        </button>

        <div className="form-field">
          <label>Observación</label>
          <textarea value={observacion} onChange={(e) => setObservacion(e.target.value)} />
        </div>

        {error && <p className="error">{error}</p>}

        <div className="form-actions">
          <button type="submit" disabled={saving}>
            Registrar venta
          </button>
        </div>
      </form>

      <table className="data-table">
        <thead>
          <tr>
            <th>Fecha</th>
            <th>Cliente</th>
            <th>Punto de venta</th>
            <th>Total</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {ventas.items.map((v) => (
            <tr key={v.id}>
              <td>{new Date(v.fecha_venta).toLocaleString()}</td>
              <td>{v.cliente}</td>
              <td>{v.punto_venta}</td>
              <td>S/ {v.total_venta}</td>
              <td className="row-actions">
                <button onClick={() => handleEliminar(v.id)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
