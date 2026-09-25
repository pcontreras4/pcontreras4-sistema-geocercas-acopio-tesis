from django.db.models import ProtectedError
from rest_framework import status, viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from accounts.mixins import ScopedQuerysetMixin

from .models import Clasificacion, Padron, Producto
from .serializers import ClasificacionSerializer, PadronSerializer, ProductoSerializer


class MensajeSiEstaEnUsoMixin:
    """Responde 409 con un mensaje claro si el registro no se puede borrar por estar en uso."""

    mensaje_en_uso = "No se puede eliminar: el registro ya está en uso."

    def destroy(self, request, *args, **kwargs):
        try:
            return super().destroy(request, *args, **kwargs)
        except ProtectedError:
            return Response({"detail": self.mensaje_en_uso}, status=status.HTTP_409_CONFLICT)


class PadronViewSet(ScopedQuerysetMixin, viewsets.ModelViewSet):
    queryset = Padron.objects.all().order_by("nombre_padron")
    serializer_class = PadronSerializer
    permission_classes = [IsAuthenticated]
    filterset_fields = ["estado", "acopiador"]
    owner_lookup = "acopiador"

    def perform_create(self, serializer):
        serializer.save(acopiador=self.request.user)


class ProductoViewSet(MensajeSiEstaEnUsoMixin, viewsets.ModelViewSet):
    queryset = Producto.objects.all().prefetch_related("clasificaciones").order_by("nombre_producto")
    serializer_class = ProductoSerializer
    permission_classes = [IsAuthenticated]
    filterset_fields = ["estado"]
    mensaje_en_uso = "No se puede eliminar: el producto ya se usó en compras, ventas o geocercas."


class ClasificacionViewSet(MensajeSiEstaEnUsoMixin, viewsets.ModelViewSet):
    queryset = Clasificacion.objects.all().order_by("nombre_clasificacion")
    serializer_class = ClasificacionSerializer
    permission_classes = [IsAuthenticated]
    filterset_fields = ["estado"]
    mensaje_en_uso = "No se puede eliminar: la clasificación ya se usó en compras o ventas."
