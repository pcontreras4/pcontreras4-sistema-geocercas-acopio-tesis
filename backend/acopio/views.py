from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated

from .models import CompraAcopio
from .serializers import CompraAcopioSerializer


class CompraAcopioViewSet(viewsets.ModelViewSet):
    queryset = CompraAcopio.objects.all().prefetch_related(
        "detalles", "transportes", "almacenamientos"
    )
    serializer_class = CompraAcopioSerializer
    permission_classes = [IsAuthenticated]
    filterset_fields = ["productor", "acopiador"]

    def perform_create(self, serializer):
        serializer.save(acopiador=self.request.user)
