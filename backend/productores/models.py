from django.contrib.gis.db import models as gis_models
from django.db import models

from config.choices import EstadoRegistro, TipoGeocerca


class Productor(models.Model):
    padron = models.ForeignKey(
        "catalogos.Padron", on_delete=models.PROTECT, related_name="productores"
    )
    nombres = models.CharField(max_length=100)
    apellidos = models.CharField(max_length=100)
    dni = models.CharField(max_length=15, unique=True)
    telefono = models.CharField(max_length=20, blank=True)
    direccion = models.CharField(max_length=200, blank=True)
    comunidad = models.CharField(max_length=100, blank=True)
    estado = models.CharField(
        max_length=20, choices=EstadoRegistro.choices, default=EstadoRegistro.ACTIVO
    )
    fecha_registro = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "productor"

    def __str__(self):
        return f"{self.nombres} {self.apellidos}"


class Geocerca(gis_models.Model):
    productor = models.ForeignKey(
        Productor, on_delete=models.CASCADE, related_name="geocercas"
    )
    nombre = models.CharField(max_length=150)
    descripcion = models.TextField(blank=True)
    tipo = models.CharField(
        max_length=20, choices=TipoGeocerca.choices, default=TipoGeocerca.PARCELA
    )
    geometria = gis_models.PolygonField(srid=4326)
    estado = models.CharField(
        max_length=20, choices=EstadoRegistro.choices, default=EstadoRegistro.ACTIVO
    )
    fecha_registro = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "geocerca"
        verbose_name_plural = "geocercas"

    def __str__(self):
        return self.nombre
