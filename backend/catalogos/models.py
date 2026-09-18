from django.db import models

from config.choices import EstadoRegistro


class Padron(models.Model):
    acopiador = models.ForeignKey(
        "accounts.Acopiador", on_delete=models.PROTECT, related_name="padrones"
    )
    nombre_padron = models.CharField(max_length=150)
    descripcion = models.TextField(blank=True)
    fecha_registro = models.DateTimeField(auto_now_add=True)
    estado = models.CharField(
        max_length=20, choices=EstadoRegistro.choices, default=EstadoRegistro.ACTIVO
    )

    class Meta:
        db_table = "padron"

    def __str__(self):
        return self.nombre_padron


class Producto(models.Model):
    nombre_producto = models.CharField(max_length=100)
    descripcion = models.TextField(blank=True)
    unidad_medida = models.CharField(max_length=20)
    estado = models.CharField(
        max_length=20, choices=EstadoRegistro.choices, default=EstadoRegistro.ACTIVO
    )

    class Meta:
        db_table = "producto"

    def __str__(self):
        return self.nombre_producto


class Clasificacion(models.Model):
    nombre_clasificacion = models.CharField(max_length=50)
    estado = models.CharField(
        max_length=20, choices=EstadoRegistro.choices, default=EstadoRegistro.ACTIVO
    )

    class Meta:
        db_table = "clasificacion"
        verbose_name_plural = "clasificaciones"

    def __str__(self):
        return self.nombre_clasificacion
