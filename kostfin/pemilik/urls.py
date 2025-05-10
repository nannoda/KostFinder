from django.urls import path, include;
from rest_framework.routers import DefaultRouter;
from .views import PemilikKostViewSet, KostViewSet, KostImageViewSet;

router = DefaultRouter();
router.register(r'pemilik', PemilikKostViewSet);
router.register(r'kost', KostViewSet);
router.register(r'kost-images', KostImageViewSet);

urlpatterns = [
    path('', include(router.urls)),
];