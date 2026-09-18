from rest_framework.routers import DefaultRouter

from .views import GeocercaViewSet, ProductorViewSet

router = DefaultRouter()
router.register("productores", ProductorViewSet, basename="productor")
router.register("geocercas", GeocercaViewSet, basename="geocerca")

urlpatterns = router.urls
