from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.settings import api_settings
from rest_framework_gis.filters import InBBoxFilter
from rest_framework_gis.pagination import GeoJsonPagination

from .models import Geocerca, Productor
from .serializers import GeocercaSerializer, ProductorSerializer


class ProductorViewSet(viewsets.ModelViewSet):
    queryset = Productor.objects.all().order_by("apellidos", "nombres")
    serializer_class = ProductorSerializer
    permission_classes = [IsAuthenticated]
    filterset_fields = ["padron", "estado"]


class GeocercaViewSet(viewsets.ModelViewSet):
    queryset = Geocerca.objects.all().order_by("nombre")
    serializer_class = GeocercaSerializer
    permission_classes = [IsAuthenticated]
    filterset_fields = ["productor", "tipo", "estado"]
    bbox_filter_field = "geometria"
    filter_backends = list(api_settings.DEFAULT_FILTER_BACKENDS) + [InBBoxFilter]
    pagination_class = GeoJsonPagination
