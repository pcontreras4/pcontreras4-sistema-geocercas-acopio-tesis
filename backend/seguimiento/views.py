from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated

from .models import SeguimientoProductor
from .serializers import SeguimientoProductorSerializer


class SeguimientoProductorViewSet(viewsets.ModelViewSet):
    queryset = SeguimientoProductor.objects.all()
    serializer_class = SeguimientoProductorSerializer
    permission_classes = [IsAuthenticated]
    filterset_fields = ["productor", "tipo_seguimiento", "interes_venta"]
