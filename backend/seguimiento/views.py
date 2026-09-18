from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated

from accounts.mixins import ScopedQuerysetMixin

from .models import SeguimientoProductor
from .serializers import SeguimientoProductorSerializer


class SeguimientoProductorViewSet(ScopedQuerysetMixin, viewsets.ModelViewSet):
    queryset = SeguimientoProductor.objects.all()
    serializer_class = SeguimientoProductorSerializer
    permission_classes = [IsAuthenticated]
    filterset_fields = ["productor", "tipo_seguimiento", "interes_venta"]
    owner_lookup = "productor__padron__acopiador"
