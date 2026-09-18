import CrudTable from "../components/CrudTable";
import useApiResource from "../hooks/useApiResource";

const FIELDS = [
  { name: "nombre_padron", label: "Nombre del padrón", required: true },
  { name: "descripcion", label: "Descripción", type: "textarea" },
];

export default function PadronesPage() {
  const resource = useApiResource("padrones");
  return <CrudTable title="Padrones" fields={FIELDS} resource={resource} />;
}
