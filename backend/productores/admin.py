from django.contrib import admin
from django.contrib.gis.admin import GISModelAdmin

from .models import Geocerca, Productor

admin.site.register(Productor)
admin.site.register(Geocerca, GISModelAdmin)
