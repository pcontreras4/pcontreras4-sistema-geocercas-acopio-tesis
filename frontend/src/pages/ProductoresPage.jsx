import CrudTable from "../components/CrudTable";
import useApiResource from "../hooks/useApiResource";

export default function ProductoresPage() {
  const resource = useApiResource("productores");
  const padrones = useApiResource("padrones");

  const fields = [
    {
      name: "padron",
      label: "Padrón",
      type: "select",
      required: true,
      options: padrones.items.map((p) => ({ value: p.id, label: p.nombre_padron })),
    },
    { name: "nombres", label: "Nombres", required: true },
    { name: "apellidos", label: "Apellidos", required: true },
    { name: "dni", label: "DNI", required: true },
    { name: "telefono", label: "Teléfono" },
    { name: "direccion", label: "Dirección" },
    { name: "comunidad", label: "Comunidad" },
  ];

  return <CrudTable title="Productores" fields={fields} resource={resource} />;
}
