from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated

from accounts.mixins import ScopedQuerysetMixin

from .models import Venta
from .serializers import VentaSerializer


class VentaViewSet(ScopedQuerysetMixin, viewsets.ModelViewSet):
    queryset = Venta.objects.all().prefetch_related("detalles")
    serializer_class = VentaSerializer
    permission_classes = [IsAuthenticated]
    filterset_fields = ["acopiador", "cliente"]
    owner_lookup = "acopiador"

    def perform_create(self, serializer):
        serializer.save(acopiador=self.request.user)
