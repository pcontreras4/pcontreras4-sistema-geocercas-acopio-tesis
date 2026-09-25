from rest_framework import status, viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from accounts.mixins import ScopedQuerysetMixin
from inventario.services import saldos_negativos_al_quitar_compra

from .models import CompraAcopio
from .serializers import CompraAcopioSerializer


class CompraAcopioViewSet(ScopedQuerysetMixin, viewsets.ModelViewSet):
    queryset = CompraAcopio.objects.all().prefetch_related(
        "detalles", "transportes", "almacenamientos"
    )
    serializer_class = CompraAcopioSerializer
    permission_classes = [IsAuthenticated]
    filterset_fields = ["productor", "acopiador"]
    owner_lookup = "acopiador"

    def perform_create(self, serializer):
        serializer.save(acopiador=self.request.user)

    def destroy(self, request, *args, **kwargs):
        compra = self.get_object()
        negativos = saldos_negativos_al_quitar_compra(compra)
        if negativos:
            return Response(
                {
                    "detail": "No se puede eliminar: parte de esta compra ya se vendió y la "
                    "existencia quedaría en negativo (" + "; ".join(negativos) + ")."
                },
                status=status.HTTP_409_CONFLICT,
            )
        return super().destroy(request, *args, **kwargs)
