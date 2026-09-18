from rest_framework.routers import DefaultRouter

from .views import AcopiadorViewSet

router = DefaultRouter()
router.register("acopiadores", AcopiadorViewSet, basename="acopiador")

urlpatterns = router.urls
