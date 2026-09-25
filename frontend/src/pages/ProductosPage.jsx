import { useState } from "react";
import useApiResource from "../hooks/useApiResource";

const EMPTY_FORM = {
  nombre_producto: "",
  unidad_medida: "",
  descripcion: "",
  clasificaciones: [],
  estado: "activo",
};

function mensajeDeError(err, fallback) {
  const data = err.response?.data;
  if (!data) return fallback;
  if (data.detail) return data.detail;
  const primero = Object.values(data)[0];
  return Array.isArray(primero) ? primero[0] : String(primero);
}

export default function ProductosPage() {
  const productos = useApiResource("productos");
  const clasificaciones = useApiResource("clasificaciones");
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState(null);

  function nombresDe(ids) {
    return ids
      .map((id) => clasificaciones.items.find((c) => c.id === id)?.nombre_clasificacion)
      .filter(Boolean)
      .join(", ");
  }

  function toggleClasificacion(id) {
    setForm((f) => ({
      ...f,
      clasificaciones: f.clasificaciones.includes(id)
        ? f.clasificaciones.filter((x) => x !== id)
        : [...f.clasificaciones, id],
    }));
  }

  function startEdit(item) {
    setEditingId(item.id);
    setFormError(null);
    setForm({ ...EMPTY_FORM, ...item });
  }

  function cancelEdit() {
    setEditingId(null);
    setFormError(null);
    setForm(EMPTY_FORM);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (form.clasificaciones.length === 0) {
      setFormError("Selecciona al menos una clasificación.");
      return;
    }
    setSaving(true);
    setFormError(null);
    try {
      if (editingId) {
        await productos.updateItem(editingId, form);
      } else {
        await productos.createItem(form);
      }
      cancelEdit();
    } catch (err) {
      setFormError(mensajeDeError(err, "No se pudo guardar el producto."));
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(item) {
    if (!window.confirm(`¿Eliminar el producto "${item.nombre_producto}"?`)) return;
    setFormError(null);
    try {
      await productos.deleteItem(item.id);
    } catch (err) {
      setFormError(mensajeDeError(err, "No se pudo eliminar el producto."));
    }
  }

  return (
    <section className="crud-page">
      <h1>Productos</h1>

      <form className="crud-form" onSubmit={handleSubmit}>
        <div className="form-field">
          <label>Nombre del producto</label>
          <input
            value={form.nombre_producto}
            onChange={(e) => setForm({ ...form, nombre_producto: e.target.value })}
            required
          />
        </div>
        <div className="form-field">
          <label>Unidad de medida</label>
          <input
            value={form.unidad_medida}
            onChange={(e) => setForm({ ...form, unidad_medida: e.target.value })}
            required
          />
        </div>
        <div className="form-field">
          <label>Descripción</label>
          <textarea
            value={form.descripcion}
            onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
          />
        </div>
        <div className="form-field">
          <label>Clasificaciones que aplican (al menos una)</label>
          <div className="check-group">
            {clasificaciones.items.map((c) => (
              <label key={c.id} className="check-item">
                <input
                  type="checkbox"
                  checked={form.clasificaciones.includes(c.id)}
                  onChange={() => toggleClasificacion(c.id)}
                />
                {c.nombre_clasificacion}
              </label>
            ))}
          </div>
        </div>
        <div className="form-field">
          <label>Estado</label>
          <select value={form.estado} onChange={(e) => setForm({ ...form, estado: e.target.value })}>
            <option value="activo">Activo</option>
            <option value="inactivo">Inactivo</option>
          </select>
        </div>

        {formError && <p className="error">{formError}</p>}

        <div className="form-actions">
          <button type="submit" disabled={saving}>
            {editingId ? "Guardar cambios" : "Registrar"}
          </button>
          {editingId && (
            <button type="button" onClick={cancelEdit}>
              Cancelar
            </button>
          )}
        </div>
      </form>

      {productos.loading && <p>Cargando...</p>}
      {productos.error && <p className="error">{productos.error}</p>}

      <table className="data-table">
        <thead>
          <tr>
            <th>Nombre del producto</th>
            <th>Unidad de medida</th>
            <th>Clasificaciones</th>
            <th>Descripción</th>
            <th>Estado</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {productos.items.map((item) => (
            <tr key={item.id}>
              <td>{item.nombre_producto}</td>
              <td>{item.unidad_medida}</td>
              <td>{nombresDe(item.clasificaciones)}</td>
              <td>{item.descripcion}</td>
              <td>{item.estado}</td>
              <td className="row-actions">
                <button onClick={() => startEdit(item)}>Editar</button>
                <button onClick={() => handleDelete(item)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
