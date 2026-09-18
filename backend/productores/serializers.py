from rest_framework import serializers
from rest_framework_gis.serializers import GeoFeatureModelSerializer

from .models import Geocerca, Productor


class ProductorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Productor
        fields = [
            "id",
            "padron",
            "nombres",
            "apellidos",
            "dni",
            "telefono",
            "direccion",
            "comunidad",
            "estado",
            "fecha_registro",
        ]
        read_only_fields = ["fecha_registro"]


class GeocercaSerializer(GeoFeatureModelSerializer):
    class Meta:
        model = Geocerca
        geo_field = "geometria"
        fields = [
            "id",
            "productor",
            "nombre",
            "descripcion",
            "tipo",
            "estado",
            "fecha_registro",
        ]
        read_only_fields = ["fecha_registro"]
