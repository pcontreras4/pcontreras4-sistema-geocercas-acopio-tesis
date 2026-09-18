from django.contrib import admin
from django.contrib.auth.admin import UserAdmin

from .models import Acopiador

admin.site.register(Acopiador, UserAdmin)
