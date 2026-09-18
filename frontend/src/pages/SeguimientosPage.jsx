import CrudTable from "../components/CrudTable";
import useApiResource from "../hooks/useApiResource";

const TIPO_OPTIONS = [
  { value: "visita", label: "Visita" },
  { value: "llamada", label: "Llamada" },
  { value: "negociacion", label: "Negociación" },
  { value: "otro", label: "Otro" },
];

const INTERES_OPTIONS = [
  { value: "alto", label: "Alto" },
  { value: "medio", label: "Medio" },
  { value: "bajo", label: "Bajo" },
  { value: "ninguno", label: "Ninguno" },
];

export default function SeguimientosPage() {
  const resource = useApiResource("seguimientos");
  const productores = useApiResource("productores");

  const fields = [
    {
      name: "productor",
      label: "Productor",
      type: "select",
      required: true,
      options: productores.items.map((p) => ({ value: p.id, label: `${p.nombres} ${p.apellidos}` })),
    },
    { name: "tipo_seguimiento", label: "Tipo", type: "select", required: true, options: TIPO_OPTIONS },
    { name: "descripcion", label: "Descripción", type: "textarea" },
    { name: "estado_productor", label: "Estado del productor" },
    { name: "interes_venta", label: "Interés de venta", type: "select", options: INTERES_OPTIONS },
    { name: "proxima_accion", label: "Próxima acción", type: "textarea" },
    { name: "observacion", label: "Observación", type: "textarea" },
  ];

  return <CrudTable title="Seguimiento de productores" fields={fields} resource={resource} hasEstado={false} />;
}
