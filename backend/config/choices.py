from django.db import models


class EstadoRegistro(models.TextChoices):
    ACTIVO = "activo", "Activo"
    INACTIVO = "inactivo", "Inactivo"


class RolUsuario(models.TextChoices):
    ADMINISTRADOR = "administrador", "Administrador"
    ACOPIADOR = "acopiador", "Acopiador"


class TipoSeguimiento(models.TextChoices):
    VISITA = "visita", "Visita"
    LLAMADA = "llamada", "Llamada"
    NEGOCIACION = "negociacion", "Negociación"
    OTRO = "otro", "Otro"


class InteresVenta(models.TextChoices):
    ALTO = "alto", "Alto"
    MEDIO = "medio", "Medio"
    BAJO = "bajo", "Bajo"
    NINGUNO = "ninguno", "Ninguno"


class TipoGeocerca(models.TextChoices):
    PARCELA = "parcela", "Parcela"
    AREA_ACOPIO = "area_acopio", "Área de acopio"
    OTRO = "otro", "Otro"
