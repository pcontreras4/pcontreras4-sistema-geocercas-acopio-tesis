from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Acopiador
from .permissions import IsAdministrador
from .serializers import AcopiadorSerializer


class AcopiadorViewSet(viewsets.ModelViewSet):
    queryset = Acopiador.objects.all().order_by("username")
    serializer_class = AcopiadorSerializer
    permission_classes = [IsAdministrador]
    filterset_fields = ["estado", "rol"]


class MeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response(AcopiadorSerializer(request.user).data)
