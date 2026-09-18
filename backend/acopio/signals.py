from django.db.models import Sum
from django.db.models.signals import post_delete, post_save
from django.dispatch import receiver

from .models import CompraAcopio, DetalleCompra


def recalcular_total(compra: CompraAcopio) -> None:
    total = compra.detalles.aggregate(suma=Sum("subtotal"))["suma"] or 0
    CompraAcopio.objects.filter(pk=compra.pk).update(total_compra=total)


@receiver(post_save, sender=DetalleCompra)
def detalle_compra_guardado(sender, instance, **kwargs):
    recalcular_total(instance.compra)


@receiver(post_delete, sender=DetalleCompra)
def detalle_compra_eliminado(sender, instance, **kwargs):
    recalcular_total(instance.compra)
