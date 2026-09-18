from django.contrib.auth.models import AbstractUser
from django.db import models

from config.choices import EstadoRegistro


class Acopiador(AbstractUser):
    """
    Usuario del sistema. Reutiliza los campos nativos de Django:
    username -> usuario, email -> correo, first_name -> nombres,
    last_name -> apellidos, password -> password (hash).
    """

    dni = models.CharField(max_length=15, unique=True)
    telefono = models.CharField(max_length=20, blank=True)
    estado = models.CharField(
        max_length=20, choices=EstadoRegistro.choices, default=EstadoRegistro.ACTIVO
    )

    class Meta:
        db_table = "acopiador"

    def __str__(self):
        return f"{self.first_name} {self.last_name}".strip() or self.username
