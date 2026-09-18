from rest_framework.routers import DefaultRouter

from .views import ClasificacionViewSet, PadronViewSet, ProductoViewSet

router = DefaultRouter()
router.register("padrones", PadronViewSet, basename="padron")
router.register("productos", ProductoViewSet, basename="producto")
router.register("clasificaciones", ClasificacionViewSet, basename="clasificacion")

urlpatterns = router.urls
