from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated

from accounts.mixins import ScopedQuerysetMixin

from .models import Clasificacion, Padron, Producto
from .serializers import ClasificacionSerializer, PadronSerializer, ProductoSerializer


class PadronViewSet(ScopedQuerysetMixin, viewsets.ModelViewSet):
    queryset = Padron.objects.all().order_by("nombre_padron")
    serializer_class = PadronSerializer
    permission_classes = [IsAuthenticated]
    filterset_fields = ["estado", "acopiador"]
    owner_lookup = "acopiador"

    def perform_create(self, serializer):
        serializer.save(acopiador=self.request.user)


class ProductoViewSet(viewsets.ModelViewSet):
    queryset = Producto.objects.all().order_by("nombre_producto")
    serializer_class = ProductoSerializer
    permission_classes = [IsAuthenticated]
    filterset_fields = ["estado"]


class ClasificacionViewSet(viewsets.ModelViewSet):
    queryset = Clasificacion.objects.all().order_by("nombre_clasificacion")
    serializer_class = ClasificacionSerializer
    permission_classes = [IsAuthenticated]
    filterset_fields = ["estado"]
