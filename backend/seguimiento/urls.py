from rest_framework.routers import DefaultRouter

from .views import SeguimientoProductorViewSet

router = DefaultRouter()
router.register("seguimientos", SeguimientoProductorViewSet, basename="seguimiento")

urlpatterns = router.urls
