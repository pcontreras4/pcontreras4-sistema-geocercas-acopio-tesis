from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated

from .models import Acopiador
from .serializers import AcopiadorSerializer


class AcopiadorViewSet(viewsets.ModelViewSet):
    queryset = Acopiador.objects.all().order_by("username")
    serializer_class = AcopiadorSerializer
    permission_classes = [IsAuthenticated]
    filterset_fields = ["estado"]
