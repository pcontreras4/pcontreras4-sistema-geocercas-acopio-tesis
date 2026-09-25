from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from catalogos.models import Clasificacion, Producto

from .services import existencias


class InventarioView(APIView):
    """
    Existencia teórica (comprado - vendido) por producto y clasificación.
    Un acopiador siempre ve solo lo suyo; el administrador ve el consolidado
    o, con ?acopiador=<id>, el de un acopiador en particular.
    """

    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        if user.is_administrador:
            acopiador_id = request.query_params.get("acopiador")
            datos = existencias(int(acopiador_id) if acopiador_id else None)
        else:
            datos = existencias(user)

        productos = {p.pk: p for p in Producto.objects.filter(pk__in={k[0] for k in datos})}
        clasificaciones = {
            c.pk: c for c in Clasificacion.objects.filter(pk__in={k[1] for k in datos})
        }

        agrupado = {}
        for (producto_id, clasificacion_id), valores in datos.items():
            producto = productos[producto_id]
            grupo = agrupado.setdefault(
                producto_id,
                {
                    "producto": producto.pk,
                    "nombre_producto": producto.nombre_producto,
                    "unidad_medida": producto.unidad_medida,
                    "existencia_total": 0.0,
                    "clasificaciones": [],
                },
            )
            existencia = valores["comprado"] - valores["vendido"]
            grupo["existencia_total"] += float(existencia)
            grupo["clasificaciones"].append(
                {
                    "clasificacion": clasificacion_id,
                    "nombre_clasificacion": clasificaciones[clasificacion_id].nombre_clasificacion,
                    "comprado": float(valores["comprado"]),
                    "vendido": float(valores["vendido"]),
                    "existencia": float(existencia),
                }
            )

        resultado = sorted(agrupado.values(), key=lambda g: g["nombre_producto"])
        for grupo in resultado:
            grupo["clasificaciones"].sort(key=lambda c: c["nombre_clasificacion"])
        return Response({"productos": resultado})
