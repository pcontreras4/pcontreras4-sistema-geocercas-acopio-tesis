import "leaflet/dist/leaflet.css";
import { useState } from "react";
import { GeoJSON, MapContainer, Popup, TileLayer } from "react-leaflet";
import apiClient from "../api/client";
import DrawPolygonControl from "../components/DrawPolygonControl";
import useApiResource from "../hooks/useApiResource";

const AREQUIPA_CENTER = [-16.409, -71.537];

const TIPO_OPTIONS = [
  { value: "parcela", label: "Parcela" },
  { value: "area_acopio", label: "Área de acopio" },
  { value: "otro", label: "Otro" },
];

// Paleta categórica: un color estable por id de producto (se repite si hay más
// de 10 productos, pero para el catálogo típico de una tesis alcanza sobrado).
const PALETA_PRODUCTOS = [
  "#2f7d4f",
  "#8a5a2f",
  "#2f5d8a",
  "#b3452c",
  "#6a4c93",
  "#c9a227",
  "#1b998b",
  "#e07a5f",
  "#3d5a80",
  "#9b5de5",
];

function colorPorProducto(productoId) {
  if (!productoId) return "#9aa39c";
  const idx = (Number(productoId) - 1) % PALETA_PRODUCTOS.length;
  return PALETA_PRODUCTOS[idx >= 0 ? idx : 0];
}

export default function GeocercasPage() {
  const geocercas = useApiResource("geocercas");
  const productores = useApiResource("productores");
  const productos = useApiResource("productos");

  const [drawing, setDrawing] = useState(false);
  const [pendingGeometry, setPendingGeometry] = useState(null);
  const [form, setForm] = useState({ nombre: "", tipo: "parcela", productor: "", producto: "" });
  const [saving, setSaving] = useState(false);

  function nombreProducto(id) {
    return productos.items.find((p) => String(p.id) === String(id))?.nombre_producto ?? "";
  }

  function handleDrawn(geometry) {
    setPendingGeometry(geometry);
  }

  async function handleGuardar(e) {
    e.preventDefault();
    if (!pendingGeometry) return;
    setSaving(true);
    try {
      await apiClient.post("/geocercas/", {
        type: "Feature",
        geometry: pendingGeometry,
        properties: {
          nombre: form.nombre,
          tipo: form.tipo,
          productor: form.productor,
          producto: form.producto,
        },
      });
      setPendingGeometry(null);
      setForm({ nombre: "", tipo: "parcela", productor: "", producto: "" });
      setDrawing(false);
      await geocercas.reload();
    } finally {
      setSaving(false);
    }
  }

  async function handleEliminar(id) {
    if (!window.confirm("¿Eliminar esta geocerca?")) return;
    await geocercas.deleteItem(id);
  }

  const productosEnUso = [
    ...new Map(
      (geocercas.items?.features ?? [])
        .map((f) => f.properties?.producto)
        .filter(Boolean)
        .map((id) => [id, id])
    ).keys(),
  ];

  return (
    <section className="crud-page">
      <h1>Geocercas</h1>

      <div className="map-toolbar">
        <button onClick={() => setDrawing((v) => !v)}>
          {drawing ? "Cancelar dibujo" : "+ Nueva geocerca"}
        </button>
      </div>

      {productosEnUso.length > 0 && (
        <div className="map-legend">
          {productosEnUso.map((id) => (
            <span key={id} className="legend-item">
              <span className="legend-swatch" style={{ background: colorPorProducto(id) }} />
              {nombreProducto(id)}
            </span>
          ))}
        </div>
      )}

      <div className="map-wrapper">
        <MapContainer center={AREQUIPA_CENTER} zoom={12} style={{ height: 480 }}>
          <TileLayer
            attribution='&copy; OpenStreetMap contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {geocercas.items?.features?.map((feature) => (
            <GeoJSON
              key={feature.id}
              data={feature}
              style={{
                color: colorPorProducto(feature.properties?.producto),
                fillColor: colorPorProducto(feature.properties?.producto),
                fillOpacity: 0.4,
              }}
            >
              <Popup>
                {feature.properties?.nombre}
                <br />
                {nombreProducto(feature.properties?.producto)}
              </Popup>
            </GeoJSON>
          ))}
          {drawing && <DrawPolygonControl onCreated={handleDrawn} />}
        </MapContainer>
      </div>

      {pendingGeometry && (
        <form className="crud-form" onSubmit={handleGuardar}>
          <p>Polígono dibujado. Completa los datos para guardar la geocerca:</p>
          <div className="form-field">
            <label>Nombre</label>
            <input
              value={form.nombre}
              onChange={(e) => setForm({ ...form, nombre: e.target.value })}
              required
            />
          </div>
          <div className="form-field">
            <label>Tipo</label>
            <select
              value={form.tipo}
              onChange={(e) => setForm({ ...form, tipo: e.target.value })}
            >
              {TIPO_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
          <div className="form-field">
            <label>Productor</label>
            <select
              value={form.productor}
              onChange={(e) => setForm({ ...form, productor: e.target.value })}
              required
            >
              <option value="">Selecciona...</option>
              {productores.items.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.nombres} {p.apellidos}
                </option>
              ))}
            </select>
          </div>
          <div className="form-field">
            <label>Producto cultivado</label>
            <select
              value={form.producto}
              onChange={(e) => setForm({ ...form, producto: e.target.value })}
              required
            >
              <option value="">Selecciona...</option>
              {productos.items.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.nombre_producto}
                </option>
              ))}
            </select>
          </div>
          <div className="form-actions">
            <button type="submit" disabled={saving}>
              Guardar geocerca
            </button>
            <button type="button" onClick={() => setPendingGeometry(null)}>
              Descartar
            </button>
          </div>
        </form>
      )}

      <table className="data-table">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Producto</th>
            <th>Tipo</th>
            <th>Productor</th>
            <th>Estado</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {geocercas.items?.features?.map((feature) => (
            <tr key={feature.id}>
              <td>{feature.properties?.nombre}</td>
              <td>
                <span
                  className="legend-swatch"
                  style={{ background: colorPorProducto(feature.properties?.producto) }}
                />
                {nombreProducto(feature.properties?.producto)}
              </td>
              <td>{feature.properties?.tipo}</td>
              <td>{feature.properties?.productor}</td>
              <td>{feature.properties?.estado}</td>
              <td className="row-actions">
                <button onClick={() => handleEliminar(feature.id)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
