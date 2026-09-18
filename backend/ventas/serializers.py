from rest_framework import serializers

from .models import DetalleVenta, Venta


class DetalleVentaSerializer(serializers.ModelSerializer):
    class Meta:
        model = DetalleVenta
        fields = ["id", "producto", "clasificacion", "cantidad", "precio_unitario", "subtotal"]
        read_only_fields = ["subtotal"]


class VentaSerializer(serializers.ModelSerializer):
    detalles = DetalleVentaSerializer(many=True)

    class Meta:
        model = Venta
        fields = [
            "id",
            "acopiador",
            "fecha_venta",
            "cliente",
            "punto_venta",
            "total_venta",
            "observacion",
            "detalles",
        ]
        read_only_fields = ["acopiador", "fecha_venta", "total_venta"]

    def create(self, validated_data):
        detalles_data = validated_data.pop("detalles")
        venta = Venta.objects.create(**validated_data)
        for detalle in detalles_data:
            DetalleVenta.objects.create(venta=venta, **detalle)
        return venta

    def update(self, instance, validated_data):
        detalles_data = validated_data.pop("detalles", None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        if detalles_data is not None:
            instance.detalles.all().delete()
            for detalle in detalles_data:
                DetalleVenta.objects.create(venta=instance, **detalle)
        return instance
