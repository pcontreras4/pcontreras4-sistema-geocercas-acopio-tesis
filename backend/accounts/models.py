from django.contrib.auth.models import AbstractUser
from django.db import models

from config.choices import EstadoRegistro, RolUsuario


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
    rol = models.CharField(
        max_length=20, choices=RolUsuario.choices, default=RolUsuario.ACOPIADOR
    )

    class Meta:
        db_table = "acopiador"

    def save(self, *args, **kwargs):
        if self.is_superuser:
            self.rol = RolUsuario.ADMINISTRADOR
        self.is_active = self.estado == EstadoRegistro.ACTIVO
        super().save(*args, **kwargs)

    @property
    def is_administrador(self):
        return self.rol == RolUsuario.ADMINISTRADOR

    def __str__(self):
        return f"{self.first_name} {self.last_name}".strip() or self.username
