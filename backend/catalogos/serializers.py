from rest_framework import serializers

from .models import Clasificacion, Padron, Producto


class PadronSerializer(serializers.ModelSerializer):
    class Meta:
        model = Padron
        fields = [
            "id",
            "acopiador",
            "nombre_padron",
            "descripcion",
            "fecha_registro",
            "estado",
        ]
        read_only_fields = ["acopiador", "fecha_registro"]


class ProductoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Producto
        fields = ["id", "nombre_producto", "descripcion", "unidad_medida", "estado"]


class ClasificacionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Clasificacion
        fields = ["id", "nombre_clasificacion", "estado"]
