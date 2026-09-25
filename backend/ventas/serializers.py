from rest_framework import serializers

from catalogos.validators import validar_clasificacion_del_producto
from inventario.services import errores_de_venta

from .models import DetalleVenta, Venta


class DetalleVentaSerializer(serializers.ModelSerializer):
    class Meta:
        model = DetalleVenta
        fields = ["id", "producto", "clasificacion", "cantidad", "precio_unitario", "subtotal"]
        read_only_fields = ["subtotal"]

    def validate(self, attrs):
        return validar_clasificacion_del_producto(attrs)


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

    def validate(self, attrs):
        detalles = attrs.get("detalles")
        if detalles is None:
            return attrs
        acopiador = self.instance.acopiador if self.instance else self.context["request"].user
        errores = errores_de_venta(acopiador, detalles, self.instance)
        if errores:
            raise serializers.ValidationError({"detalles": errores})
        return attrs

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
