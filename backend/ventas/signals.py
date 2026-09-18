from django.db.models import Sum
from django.db.models.signals import post_delete, post_save
from django.dispatch import receiver

from .models import DetalleVenta, Venta


def recalcular_total(venta: Venta) -> None:
    total = venta.detalles.aggregate(suma=Sum("subtotal"))["suma"] or 0
    Venta.objects.filter(pk=venta.pk).update(total_venta=total)


@receiver(post_save, sender=DetalleVenta)
def detalle_venta_guardado(sender, instance, **kwargs):
    recalcular_total(instance.venta)


@receiver(post_delete, sender=DetalleVenta)
def detalle_venta_eliminado(sender, instance, **kwargs):
    recalcular_total(instance.venta)
