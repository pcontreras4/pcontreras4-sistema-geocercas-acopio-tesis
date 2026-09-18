from django.contrib import admin

from .models import Almacenamiento, CompraAcopio, DetalleCompra, Transporte


class DetalleCompraInline(admin.TabularInline):
    model = DetalleCompra
    extra = 1


class TransporteInline(admin.TabularInline):
    model = Transporte
    extra = 0


class AlmacenamientoInline(admin.TabularInline):
    model = Almacenamiento
    extra = 0


@admin.register(CompraAcopio)
class CompraAcopioAdmin(admin.ModelAdmin):
    inlines = [DetalleCompraInline, TransporteInline, AlmacenamientoInline]
    list_display = ("id", "productor", "acopiador", "fecha_compra", "total_compra")
