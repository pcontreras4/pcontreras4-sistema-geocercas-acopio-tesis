from django.db import models


class Venta(models.Model):
    acopiador = models.ForeignKey(
        "accounts.Acopiador", on_delete=models.PROTECT, related_name="ventas"
    )
    fecha_venta = models.DateTimeField(auto_now_add=True)
    cliente = models.CharField(max_length=150)
    punto_venta = models.CharField(max_length=150, blank=True)
    total_venta = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    observacion = models.TextField(blank=True)

    class Meta:
        db_table = "venta"
        ordering = ["-fecha_venta"]

    def __str__(self):
        return f"Venta #{self.pk} - {self.cliente}"


class DetalleVenta(models.Model):
    venta = models.ForeignKey(Venta, on_delete=models.CASCADE, related_name="detalles")
    producto = models.ForeignKey("catalogos.Producto", on_delete=models.PROTECT)
    clasificacion = models.ForeignKey("catalogos.Clasificacion", on_delete=models.PROTECT)
    cantidad = models.DecimalField(max_digits=10, decimal_places=2)
    precio_unitario = models.DecimalField(max_digits=10, decimal_places=2)
    subtotal = models.DecimalField(max_digits=12, decimal_places=2, editable=False)

    class Meta:
        db_table = "detalle_venta"

    def save(self, *args, **kwargs):
        self.subtotal = self.cantidad * self.precio_unitario
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.producto} x{self.cantidad} (venta #{self.venta_id})"
