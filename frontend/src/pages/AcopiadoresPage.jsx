import { useState } from "react";
import useApiResource from "../hooks/useApiResource";

const ROL_OPTIONS = [
  { value: "acopiador", label: "Acopiador" },
  { value: "administrador", label: "Administrador" },
];

const EMPTY_FORM = {
  username: "",
  first_name: "",
  last_name: "",
  email: "",
  dni: "",
  telefono: "",
  rol: "acopiador",
  estado: "activo",
  password: "",
};

export default function AcopiadoresPage() {
  const { items, loading, error, createItem, updateItem, deleteItem } = useApiResource("acopiadores");
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  function startEdit(item) {
    setEditingId(item.id);
    setForm({ ...EMPTY_FORM, ...item, password: "" });
  }

  function cancelEdit() {
    setEditingId(null);
    setForm(EMPTY_FORM);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = { ...form };
      if (editingId && !payload.password) {
        delete payload.password;
      }
      if (editingId) {
        await updateItem(editingId, payload);
      } else {
        await createItem(payload);
      }
      cancelEdit();
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("¿Eliminar este acopiador?")) return;
    await deleteItem(id);
  }

  return (
    <section className="crud-page">
      <h1>Gestión de acopiadores</h1>

      <form className="crud-form" onSubmit={handleSubmit}>
        <div className="form-field">
          <label>Usuario</label>
          <input
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
            required
          />
        </div>
        <div className="form-field">
          <label>Nombres</label>
          <input
            value={form.first_name}
            onChange={(e) => setForm({ ...form, first_name: e.target.value })}
            required
          />
        </div>
        <div className="form-field">
          <label>Apellidos</label>
          <input
            value={form.last_name}
            onChange={(e) => setForm({ ...form, last_name: e.target.value })}
            required
          />
        </div>
        <div className="form-field">
          <label>DNI</label>
          <input value={form.dni} onChange={(e) => setForm({ ...form, dni: e.target.value })} required />
        </div>
        <div className="form-field">
          <label>Teléfono</label>
          <input value={form.telefono} onChange={(e) => setForm({ ...form, telefono: e.target.value })} />
        </div>
        <div className="form-field">
          <label>Correo</label>
          <input
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
        </div>
        <div className="form-field">
          <label>Rol</label>
          <select value={form.rol} onChange={(e) => setForm({ ...form, rol: e.target.value })}>
            {ROL_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
        <div className="form-field">
          <label>Estado</label>
          <select value={form.estado} onChange={(e) => setForm({ ...form, estado: e.target.value })}>
            <option value="activo">Activo</option>
            <option value="inactivo">Inactivo</option>
          </select>
        </div>
        <div className="form-field">
          <label>{editingId ? "Nueva contraseña (dejar en blanco para no cambiarla)" : "Contraseña"}</label>
          <input
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required={!editingId}
          />
        </div>

        {error && <p className="error">{error}</p>}

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

      <table className="data-table">
        <thead>
          <tr>
            <th>Usuario</th>
            <th>Nombres</th>
            <th>Apellidos</th>
            <th>DNI</th>
            <th>Rol</th>
            <th>Estado</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id}>
              <td>{item.username}</td>
              <td>{item.first_name}</td>
              <td>{item.last_name}</td>
              <td>{item.dni}</td>
              <td>{item.rol}</td>
              <td>{item.estado}</td>
              <td className="row-actions">
                <button onClick={() => startEdit(item)}>Editar</button>
                <button onClick={() => handleDelete(item.id)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
