import { useState } from "react";
import apiClient from "../api/client";
import useApiResource from "../hooks/useApiResource";

const EMPTY_DETALLE = { producto: "", clasificacion: "", cantidad: "", precio_unitario: "" };

export default function ComprasPage() {
  const compras = useApiResource("compras");
  const productores = useApiResource("productores");
  const productos = useApiResource("productos");
  const clasificaciones = useApiResource("clasificaciones");

  const [productor, setProductor] = useState("");
  const [observacion, setObservacion] = useState("");
  const [detalles, setDetalles] = useState([{ ...EMPTY_DETALLE }]);
  const [transporte, setTransporte] = useState({ chofer: "", placa: "", tipo_vehiculo: "", costo_transporte: "" });
  const [almacenamiento, setAlmacenamiento] = useState({ ubicacion: "", cantidad: "" });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [errorTabla, setErrorTabla] = useState(null);

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

  function addDetalle() {
    setDetalles((prev) => [...prev, { ...EMPTY_DETALLE }]);
  }

  function removeDetalle(index) {
    setDetalles((prev) => prev.filter((_, i) => i !== index));
  }

  function resetForm() {
    setProductor("");
    setObservacion("");
    setDetalles([{ ...EMPTY_DETALLE }]);
    setTransporte({ chofer: "", placa: "", tipo_vehiculo: "", costo_transporte: "" });
    setAlmacenamiento({ ubicacion: "", cantidad: "" });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const payload = {
        productor,
        observacion,
        detalles: detalles
          .filter((d) => d.producto && d.clasificacion && d.cantidad && d.precio_unitario)
          .map((d) => ({
            producto: d.producto,
            clasificacion: d.clasificacion,
            cantidad: d.cantidad,
            precio_unitario: d.precio_unitario,
          })),
        transportes: transporte.chofer || transporte.placa ? [transporte] : [],
        almacenamientos: almacenamiento.ubicacion ? [almacenamiento] : [],
      };
      if (payload.detalles.length === 0) {
        setError("Agrega al menos un producto con cantidad y precio.");
        return;
      }
      await apiClient.post("/compras/", payload);
      resetForm();
      await compras.reload();
    } catch {
      setError("No se pudo registrar la compra.");
    } finally {
      setSaving(false);
    }
  }

  async function handleEliminar(id) {
    if (!window.confirm("¿Eliminar esta compra?")) return;
    setErrorTabla(null);
    try {
      await compras.deleteItem(id);
    } catch (err) {
      setErrorTabla(err.response?.data?.detail ?? "No se pudo eliminar la compra.");
    }
  }

  return (
    <section className="crud-page">
      <h1>Acopio (compras)</h1>

      <form className="crud-form" onSubmit={handleSubmit}>
        <div className="form-field">
          <label>Productor</label>
          <select value={productor} onChange={(e) => setProductor(e.target.value)} required>
            <option value="">Selecciona...</option>
            {productores.items.map((p) => (
              <option key={p.id} value={p.id}>
                {p.nombres} {p.apellidos}
              </option>
            ))}
          </select>
        </div>

        <h3>Productos comprados</h3>
        {detalles.map((d, i) => (
          <div key={i} className="detalle-row">
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
        ))}
        <button type="button" onClick={addDetalle}>
          + Agregar producto
        </button>

        <h3>Transporte (opcional)</h3>
        <div className="detalle-row">
          <input
            placeholder="Chofer"
            value={transporte.chofer}
            onChange={(e) => setTransporte({ ...transporte, chofer: e.target.value })}
          />
          <input
            placeholder="Placa"
            value={transporte.placa}
            onChange={(e) => setTransporte({ ...transporte, placa: e.target.value })}
          />
          <input
            placeholder="Tipo de vehículo"
            value={transporte.tipo_vehiculo}
            onChange={(e) => setTransporte({ ...transporte, tipo_vehiculo: e.target.value })}
          />
          <input
            type="number"
            step="0.01"
            placeholder="Costo"
            value={transporte.costo_transporte}
            onChange={(e) => setTransporte({ ...transporte, costo_transporte: e.target.value })}
          />
        </div>

        <h3>Almacenamiento (opcional)</h3>
        <div className="detalle-row">
          <input
            placeholder="Ubicación"
            value={almacenamiento.ubicacion}
            onChange={(e) => setAlmacenamiento({ ...almacenamiento, ubicacion: e.target.value })}
          />
          <input
            type="number"
            step="0.01"
            placeholder="Cantidad almacenada"
            value={almacenamiento.cantidad}
            onChange={(e) => setAlmacenamiento({ ...almacenamiento, cantidad: e.target.value })}
          />
        </div>

        <div className="form-field">
          <label>Observación</label>
          <textarea value={observacion} onChange={(e) => setObservacion(e.target.value)} />
        </div>

        {error && <p className="error">{error}</p>}

        <div className="form-actions">
          <button type="submit" disabled={saving}>
            Registrar compra
          </button>
        </div>
      </form>

      {errorTabla && <p className="error">{errorTabla}</p>}

      <table className="data-table">
        <thead>
          <tr>
            <th>Fecha</th>
            <th>Productor</th>
            <th>Total</th>
            <th>Observación</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {compras.items.map((c) => (
            <tr key={c.id}>
              <td>{new Date(c.fecha_compra).toLocaleString()}</td>
              <td>{c.productor}</td>
              <td>S/ {c.total_compra}</td>
              <td>{c.observacion}</td>
              <td className="row-actions">
                <button onClick={() => handleEliminar(c.id)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
