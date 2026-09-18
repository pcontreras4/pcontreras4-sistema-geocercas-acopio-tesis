from django.db import models

from config.choices import InteresVenta, TipoSeguimiento


class SeguimientoProductor(models.Model):
    productor = models.ForeignKey(
        "productores.Productor", on_delete=models.CASCADE, related_name="seguimientos"
    )
    fecha_seguimiento = models.DateTimeField(auto_now_add=True)
    tipo_seguimiento = models.CharField(
        max_length=20, choices=TipoSeguimiento.choices
    )
    descripcion = models.TextField(blank=True)
    estado_productor = models.CharField(max_length=100, blank=True)
    interes_venta = models.CharField(
        max_length=20, choices=InteresVenta.choices, default=InteresVenta.NINGUNO
    )
    proxima_accion = models.TextField(blank=True)
    observacion = models.TextField(blank=True)

    class Meta:
        db_table = "seguimiento_productor"
        ordering = ["-fecha_seguimiento"]

    def __str__(self):
        return f"Seguimiento de {self.productor} ({self.fecha_seguimiento:%Y-%m-%d})"
