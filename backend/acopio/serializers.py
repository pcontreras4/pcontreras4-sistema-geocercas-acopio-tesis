from rest_framework import serializers

from catalogos.validators import validar_clasificacion_del_producto

from .models import Almacenamiento, CompraAcopio, DetalleCompra, Transporte


class DetalleCompraSerializer(serializers.ModelSerializer):
    class Meta:
        model = DetalleCompra
        fields = ["id", "producto", "clasificacion", "cantidad", "precio_unitario", "subtotal"]
        read_only_fields = ["subtotal"]

    def validate(self, attrs):
        return validar_clasificacion_del_producto(attrs)


class TransporteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Transporte
        fields = [
            "id",
            "compra",
            "chofer",
            "placa",
            "tipo_vehiculo",
            "costo_transporte",
            "observacion",
        ]
        read_only_fields = ["compra"]


class AlmacenamientoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Almacenamiento
        fields = [
            "id",
            "compra",
            "ubicacion",
            "fecha_ingreso",
            "cantidad",
            "observacion",
        ]
        read_only_fields = ["compra", "fecha_ingreso"]


class CompraAcopioSerializer(serializers.ModelSerializer):
    detalles = DetalleCompraSerializer(many=True)
    transportes = TransporteSerializer(many=True, required=False)
    almacenamientos = AlmacenamientoSerializer(many=True, required=False)

    class Meta:
        model = CompraAcopio
        fields = [
            "id",
            "acopiador",
            "productor",
            "fecha_compra",
            "total_compra",
            "observacion",
            "detalles",
            "transportes",
            "almacenamientos",
        ]
        read_only_fields = ["acopiador", "fecha_compra", "total_compra"]

    def create(self, validated_data):
        detalles_data = validated_data.pop("detalles")
        transportes_data = validated_data.pop("transportes", [])
        almacenamientos_data = validated_data.pop("almacenamientos", [])

        compra = CompraAcopio.objects.create(**validated_data)
        for detalle in detalles_data:
            DetalleCompra.objects.create(compra=compra, **detalle)
        for transporte in transportes_data:
            Transporte.objects.create(compra=compra, **transporte)
        for almacenamiento in almacenamientos_data:
            Almacenamiento.objects.create(compra=compra, **almacenamiento)
        return compra

    def update(self, instance, validated_data):
        detalles_data = validated_data.pop("detalles", None)
        transportes_data = validated_data.pop("transportes", None)
        almacenamientos_data = validated_data.pop("almacenamientos", None)

        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        if detalles_data is not None:
            instance.detalles.all().delete()
            for detalle in detalles_data:
                DetalleCompra.objects.create(compra=instance, **detalle)
        if transportes_data is not None:
            instance.transportes.all().delete()
            for transporte in transportes_data:
                Transporte.objects.create(compra=instance, **transporte)
        if almacenamientos_data is not None:
            instance.almacenamientos.all().delete()
            for almacenamiento in almacenamientos_data:
                Almacenamiento.objects.create(compra=instance, **almacenamiento)
        return instance
