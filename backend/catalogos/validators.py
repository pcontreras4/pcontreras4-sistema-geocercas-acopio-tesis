from rest_framework import serializers


def validar_clasificacion_del_producto(attrs):
    producto = attrs.get("producto")
    clasificacion = attrs.get("clasificacion")
    if producto and clasificacion:
        if not producto.clasificaciones.filter(pk=clasificacion.pk).exists():
            raise serializers.ValidationError(
                {"clasificacion": "La clasificación no corresponde al producto seleccionado."}
            )
    return attrs
