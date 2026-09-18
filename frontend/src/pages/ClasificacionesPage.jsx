import CrudTable from "../components/CrudTable";
import useApiResource from "../hooks/useApiResource";

const FIELDS = [{ name: "nombre_clasificacion", label: "Clasificación", required: true }];

export default function ClasificacionesPage() {
  const resource = useApiResource("clasificaciones");
  return <CrudTable title="Clasificaciones" fields={FIELDS} resource={resource} />;
}
