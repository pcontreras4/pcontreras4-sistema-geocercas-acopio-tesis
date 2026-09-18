import CrudTable from "../components/CrudTable";
import useApiResource from "../hooks/useApiResource";

const FIELDS = [
  { name: "nombre_producto", label: "Nombre del producto", required: true },
  { name: "unidad_medida", label: "Unidad de medida", required: true },
  { name: "descripcion", label: "Descripción", type: "textarea" },
];

export default function ProductosPage() {
  const resource = useApiResource("productos");
  return <CrudTable title="Productos" fields={FIELDS} resource={resource} />;
}
