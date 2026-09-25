import CrudTable from "../components/CrudTable";
import useApiResource from "../hooks/useApiResource";

const FIELDS = [{ name: "nombre_clasificacion", label: "Clasificación", required: true }];

export default function ClasificacionesPage() {
  const clasificaciones = useApiResource("clasificaciones");
  const productos = useApiResource("productos");

  const resource = {
    ...clasificaciones,
    deleteItem: async (id) => {
      await clasificaciones.deleteItem(id);
      await productos.reload();
    },
  };

  function avisoSiEsLaUnica(clasificacion) {
    const afectados = productos.items
      .filter((p) => p.clasificaciones.length === 1 && p.clasificaciones[0] === clasificacion.id)
      .map((p) => p.nombre_producto);
    if (afectados.length === 0) return null;
    return (
      `"${clasificacion.nombre_clasificacion}" es la única clasificación de: ${afectados.join(", ")}.\n\n` +
      "Si la eliminas, esos productos no podrán usarse en compras ni ventas hasta que les asignes otra.\n\n¿Continuar?"
    );
  }

  return (
    <CrudTable
      title="Clasificaciones"
      fields={FIELDS}
      resource={resource}
      deleteMessage={avisoSiEsLaUnica}
    />
  );
}
