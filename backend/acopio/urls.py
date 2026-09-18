from rest_framework.routers import DefaultRouter

from .views import CompraAcopioViewSet

router = DefaultRouter()
router.register("compras", CompraAcopioViewSet, basename="compra")

urlpatterns = router.urls
