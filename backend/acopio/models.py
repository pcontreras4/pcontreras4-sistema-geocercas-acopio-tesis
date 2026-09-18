from django.db import models


class CompraAcopio(models.Model):
    acopiador = models.ForeignKey(
        "accounts.Acopiador", on_delete=models.PROTECT, related_name="compras"
    )
    productor = models.ForeignKey(
        "productores.Productor", on_delete=models.PROTECT, related_name="compras"
    )
    fecha_compra = models.DateTimeField(auto_now_add=True)
    total_compra = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    observacion = models.TextField(blank=True)

    class Meta:
        db_table = "compra_acopio"
        verbose_name_plural = "compras de acopio"
        ordering = ["-fecha_compra"]

    def __str__(self):
        return f"Compra #{self.pk} - {self.productor}"


class DetalleCompra(models.Model):
    compra = models.ForeignKey(
        CompraAcopio, on_delete=models.CASCADE, related_name="detalles"
    )
    producto = models.ForeignKey("catalogos.Producto", on_delete=models.PROTECT)
    clasificacion = models.ForeignKey("catalogos.Clasificacion", on_delete=models.PROTECT)
    cantidad = models.DecimalField(max_digits=10, decimal_places=2)
    precio_unitario = models.DecimalField(max_digits=10, decimal_places=2)
    subtotal = models.DecimalField(max_digits=12, decimal_places=2, editable=False)

    class Meta:
        db_table = "detalle_compra"

    def save(self, *args, **kwargs):
        self.subtotal = self.cantidad * self.precio_unitario
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.producto} x{self.cantidad} (compra #{self.compra_id})"


class Transporte(models.Model):
    compra = models.ForeignKey(
        CompraAcopio, on_delete=models.CASCADE, related_name="transportes"
    )
    chofer = models.CharField(max_length=100, blank=True)
    placa = models.CharField(max_length=15, blank=True)
    tipo_vehiculo = models.CharField(max_length=50, blank=True)
    costo_transporte = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    observacion = models.TextField(blank=True)

    class Meta:
        db_table = "transporte"

    def __str__(self):
        return f"Transporte compra #{self.compra_id}"


class Almacenamiento(models.Model):
    compra = models.ForeignKey(
        CompraAcopio, on_delete=models.CASCADE, related_name="almacenamientos"
    )
    ubicacion = models.CharField(max_length=150)
    fecha_ingreso = models.DateTimeField(auto_now_add=True)
    cantidad = models.DecimalField(max_digits=10, decimal_places=2)
    observacion = models.TextField(blank=True)

    class Meta:
        db_table = "almacenamiento"

    def __str__(self):
        return f"Almacenamiento compra #{self.compra_id}"
