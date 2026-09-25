import { useState } from "react";

/**
 * Tabla CRUD genérica para catálogos simples (Padrón, Producto, Clasificación, Seguimiento...).
 * `fields`: [{ name, label, type: 'text'|'textarea'|'select', options?, required? }]
 * `hasEstado`: si el modelo tiene un campo activo/inactivo estándar (por defecto true).
 * `deleteMessage`: función opcional (item) => texto de confirmación personalizado, o null para el estándar.
 */
export default function CrudTable({ title, fields, resource, hasEstado = true, deleteMessage }) {
  const { items, loading, error, createItem, updateItem, deleteItem } = resource;
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(defaultForm(fields));
  const [saving, setSaving] = useState(false);
  const [actionError, setActionError] = useState(null);

  function defaultForm(fieldList) {
    const base = hasEstado ? { estado: "activo" } : {};
    fieldList.forEach((f) => {
      if (!(f.name in base)) base[f.name] = "";
    });
    return base;
  }

  function startEdit(item) {
    setEditingId(item.id);
    setForm({ ...defaultForm(fields), ...item });
  }

  function cancelEdit() {
    setEditingId(null);
    setForm(defaultForm(fields));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingId) {
        await updateItem(editingId, form);
      } else {
        await createItem(form);
      }
      cancelEdit();
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(item) {
    const message = deleteMessage?.(item) ?? "¿Eliminar este registro?";
    if (!window.confirm(message)) return;
    setActionError(null);
    try {
      await deleteItem(item.id);
    } catch (err) {
      setActionError(err.response?.data?.detail ?? "No se pudo eliminar el registro.");
    }
  }

  return (
    <section className="crud-page">
      <h1>{title}</h1>

      <form className="crud-form" onSubmit={handleSubmit}>
        {fields.map((f) => (
          <div key={f.name} className="form-field">
            <label>{f.label}</label>
            {f.type === "textarea" ? (
              <textarea
                value={form[f.name] ?? ""}
                onChange={(e) => setForm({ ...form, [f.name]: e.target.value })}
                required={f.required}
              />
            ) : f.type === "select" ? (
              <select
                value={form[f.name] ?? ""}
                onChange={(e) => setForm({ ...form, [f.name]: e.target.value })}
                required={f.required}
              >
                <option value="">Selecciona...</option>
                {f.options.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            ) : (
              <input
                value={form[f.name] ?? ""}
                onChange={(e) => setForm({ ...form, [f.name]: e.target.value })}
                required={f.required}
              />
            )}
          </div>
        ))}
        {hasEstado && (
          <div className="form-field">
            <label>Estado</label>
            <select
              value={form.estado}
              onChange={(e) => setForm({ ...form, estado: e.target.value })}
            >
              <option value="activo">Activo</option>
              <option value="inactivo">Inactivo</option>
            </select>
          </div>
        )}
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

      {loading && <p>Cargando...</p>}
      {error && <p className="error">{error}</p>}
      {actionError && <p className="error">{actionError}</p>}

      <table className="data-table">
        <thead>
          <tr>
            {fields.map((f) => (
              <th key={f.name}>{f.label}</th>
            ))}
            {hasEstado && <th>Estado</th>}
            <th></th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id}>
              {fields.map((f) => (
                <td key={f.name}>{String(item[f.name] ?? "")}</td>
              ))}
              {hasEstado && <td>{item.estado}</td>}
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
