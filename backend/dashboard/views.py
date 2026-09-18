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
        productores_por_padron = list(
            Productor.objects.values("padron__nombre_padron")
            .annotate(total=Count("id"))
            .order_by("-total")
        )

        productos_mas_acopiados = list(
            DetalleCompra.objects.values("producto__nombre_producto")
            .annotate(total_cantidad=Sum("cantidad"))
            .order_by("-total_cantidad")[:5]
        )

        productos_mas_vendidos = list(
            DetalleVenta.objects.values("producto__nombre_producto")
            .annotate(total_cantidad=Sum("cantidad"))
            .order_by("-total_cantidad")[:5]
        )

        data = {
            "totales": {
                "productores": Productor.objects.count(),
                "padrones": Padron.objects.count(),
                "geocercas": Geocerca.objects.count(),
                "compras": CompraAcopio.objects.count(),
                "ventas": Venta.objects.count(),
                "monto_acopiado": CompraAcopio.objects.aggregate(s=Sum("total_compra"))["s"] or 0,
                "monto_vendido": Venta.objects.aggregate(s=Sum("total_venta"))["s"] or 0,
            },
            "productores_por_padron": productores_por_padron,
            "productos_mas_acopiados": productos_mas_acopiados,
            "productos_mas_vendidos": productos_mas_vendidos,
        }
        return Response(data)
