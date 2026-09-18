from rest_framework import serializers

from .models import SeguimientoProductor


class SeguimientoProductorSerializer(serializers.ModelSerializer):
    class Meta:
        model = SeguimientoProductor
        fields = [
            "id",
            "productor",
            "fecha_seguimiento",
            "tipo_seguimiento",
            "descripcion",
            "estado_productor",
            "interes_venta",
            "proxima_accion",
            "observacion",
        ]
        read_only_fields = ["fecha_seguimiento"]
