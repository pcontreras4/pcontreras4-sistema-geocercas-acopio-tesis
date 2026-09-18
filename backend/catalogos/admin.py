from django.contrib import admin

from .models import Clasificacion, Padron, Producto

admin.site.register(Padron)
admin.site.register(Producto)
admin.site.register(Clasificacion)
