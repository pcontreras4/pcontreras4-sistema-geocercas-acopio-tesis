from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.settings import api_settings
from rest_framework_gis.filters import InBBoxFilter
from rest_framework_gis.pagination import GeoJsonPagination

from accounts.mixins import ScopedQuerysetMixin

from .models import Geocerca, Productor
from .serializers import GeocercaSerializer, ProductorSerializer


class ProductorViewSet(ScopedQuerysetMixin, viewsets.ModelViewSet):
    queryset = Productor.objects.all().order_by("apellidos", "nombres")
    serializer_class = ProductorSerializer
    permission_classes = [IsAuthenticated]
    filterset_fields = ["padron", "estado"]
    owner_lookup = "padron__acopiador"


class GeocercaViewSet(ScopedQuerysetMixin, viewsets.ModelViewSet):
    queryset = Geocerca.objects.all().order_by("nombre")
    serializer_class = GeocercaSerializer
    permission_classes = [IsAuthenticated]
    filterset_fields = ["productor", "tipo", "estado"]
    bbox_filter_field = "geometria"
    filter_backends = list(api_settings.DEFAULT_FILTER_BACKENDS) + [InBBoxFilter]
    pagination_class = GeoJsonPagination
    owner_lookup = "productor__padron__acopiador"
