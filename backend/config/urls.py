from django.contrib import admin
from django.urls import include, path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from accounts.views import MeView

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/auth/login/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("api/auth/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("api/auth/me/", MeView.as_view(), name="me"),
    path("api/", include("accounts.urls")),
    path("api/", include("catalogos.urls")),
    path("api/", include("productores.urls")),
    path("api/", include("seguimiento.urls")),
    path("api/", include("acopio.urls")),
    path("api/", include("ventas.urls")),
    path("api/", include("dashboard.urls")),
    path("api/", include("inventario.urls")),
]
