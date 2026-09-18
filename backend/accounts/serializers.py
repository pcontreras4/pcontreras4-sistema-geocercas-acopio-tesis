from django.contrib.auth.password_validation import validate_password
from rest_framework import serializers

from .models import Acopiador


class AcopiadorSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, validators=[validate_password])

    class Meta:
        model = Acopiador
        fields = [
            "id",
            "username",
            "first_name",
            "last_name",
            "email",
            "dni",
            "telefono",
            "estado",
            "rol",
            "password",
        ]

    def create(self, validated_data):
        password = validated_data.pop("password")
        acopiador = Acopiador(**validated_data)
        acopiador.set_password(password)
        acopiador.save()
        return acopiador

    def update(self, instance, validated_data):
        password = validated_data.pop("password", None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        if password:
            instance.set_password(password)
        instance.save()
        return instance
