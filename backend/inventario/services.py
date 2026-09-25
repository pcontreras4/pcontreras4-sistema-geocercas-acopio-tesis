from collections import defaultdict
from decimal import Decimal

from django.db.models import Sum

from acopio.models import DetalleCompra
from ventas.models import DetalleVenta


def _fmt(valor):
    texto = f"{valor:f}"
    if "." in texto:
        texto = texto.rstrip("0").rstrip(".")
    return texto or "0"


def existencias(acopiador=None):
    """
    Devuelve {(producto_id, clasificacion_id): {"comprado": Decimal, "vendido": Decimal}}.
    Con acopiador=None suma las operaciones de todos los acopiadores.
    """
    compras = DetalleCompra.objects.all()
    ventas = DetalleVenta.objects.all()
    if acopiador is not None:
        compras = compras.filter(compra__acopiador=acopiador)
        ventas = ventas.filter(venta__acopiador=acopiador)

    datos = defaultdict(lambda: {"comprado": Decimal("0"), "vendido": Decimal("0")})
    for fila in compras.values("producto", "clasificacion").annotate(total=Sum("cantidad")):
        datos[(fila["producto"], fila["clasificacion"])]["comprado"] = fila["total"]
    for fila in ventas.values("producto", "clasificacion").annotate(total=Sum("cantidad")):
        datos[(fila["producto"], fila["clasificacion"])]["vendido"] = fila["total"]
    return datos


def errores_de_venta(acopiador, detalles, venta_existente=None):
    """Mensajes de error si las líneas repiten producto+clasificación o superan la existencia."""
    claves = [(d["producto"].pk, d["clasificacion"].pk) for d in detalles]
    if len(set(claves)) != len(claves):
        return [
            "Hay líneas repetidas con el mismo producto y clasificación: "
            "edita la cantidad de la línea existente."
        ]

    datos = existencias(acopiador)
    if venta_existente is not None:
        for d in venta_existente.detalles.all():
            datos[(d.producto_id, d.clasificacion_id)]["vendido"] -= d.cantidad

    errores = []
    for d in detalles:
        clave = (d["producto"].pk, d["clasificacion"].pk)
        disponible = datos[clave]["comprado"] - datos[clave]["vendido"]
        if d["cantidad"] > disponible:
            errores.append(
                f"Stock insuficiente de {d['producto'].nombre_producto} "
                f"({d['clasificacion'].nombre_clasificacion}): "
                f"disponible {_fmt(disponible)}, solicitado {_fmt(d['cantidad'])}."
            )
    return errores


def saldos_negativos_al_quitar_compra(compra):
    """Mensajes por cada producto+clasificación que quedaría con existencia negativa."""
    datos = existencias(compra.acopiador)
    quitar = defaultdict(Decimal)
    nombres = {}
    for d in compra.detalles.select_related("producto", "clasificacion"):
        clave = (d.producto_id, d.clasificacion_id)
        quitar[clave] += d.cantidad
        nombres[clave] = f"{d.producto.nombre_producto} ({d.clasificacion.nombre_clasificacion})"

    mensajes = []
    for clave, cantidad in quitar.items():
        saldo = datos[clave]["comprado"] - cantidad - datos[clave]["vendido"]
        if saldo < 0:
            mensajes.append(f"{nombres[clave]}: {_fmt(saldo)}")
    return mensajes
