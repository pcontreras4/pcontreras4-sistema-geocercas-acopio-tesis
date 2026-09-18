from django.db.models import Count, Sum
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from acopio.models import CompraAcopio, DetalleCompra
from catalogos.models import Padron
from productores.models import Geocerca, Productor
from ventas.models import DetalleVenta, Venta


class DashboardResumenView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        es_admin = user.is_administrador

        productores_qs = Productor.objects.all()
        padrones_qs = Padron.objects.all()
        geocercas_qs = Geocerca.objects.all()
        compras_qs = CompraAcopio.objects.all()
        ventas_qs = Venta.objects.all()
        detalle_compra_qs = DetalleCompra.objects.all()
        detalle_venta_qs = DetalleVenta.objects.all()

        if not es_admin:
            productores_qs = productores_qs.filter(padron__acopiador=user)
            padrones_qs = padrones_qs.filter(acopiador=user)
            geocercas_qs = geocercas_qs.filter(productor__padron__acopiador=user)
            compras_qs = compras_qs.filter(acopiador=user)
            ventas_qs = ventas_qs.filter(acopiador=user)
            detalle_compra_qs = detalle_compra_qs.filter(compra__acopiador=user)
            detalle_venta_qs = detalle_venta_qs.filter(venta__acopiador=user)

        productores_por_padron = list(
            productores_qs.values("padron__nombre_padron")
            .annotate(total=Count("id"))
            .order_by("-total")
        )

        productos_mas_acopiados = list(
            detalle_compra_qs.values("producto__nombre_producto")
            .annotate(total_cantidad=Sum("cantidad"))
            .order_by("-total_cantidad")[:5]
        )

        productos_mas_vendidos = list(
            detalle_venta_qs.values("producto__nombre_producto")
            .annotate(total_cantidad=Sum("cantidad"))
            .order_by("-total_cantidad")[:5]
        )

        data = {
            "totales": {
                "productores": productores_qs.count(),
                "padrones": padrones_qs.count(),
                "geocercas": geocercas_qs.count(),
                "compras": compras_qs.count(),
                "ventas": ventas_qs.count(),
                "monto_acopiado": compras_qs.aggregate(s=Sum("total_compra"))["s"] or 0,
                "monto_vendido": ventas_qs.aggregate(s=Sum("total_venta"))["s"] or 0,
            },
            "productores_por_padron": productores_por_padron,
            "productos_mas_acopiados": productos_mas_acopiados,
            "productos_mas_vendidos": productos_mas_vendidos,
        }
        return Response(data)
