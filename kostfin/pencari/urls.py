from django.urls import path, include;
from rest_framework.routers import DefaultRouter;
from .views import *;

router = DefaultRouter();
router.register(r'penghuni', PenghuniKostViewSet);
router.register(r'notifikasi', NotifikasiViewSet);
router.register(r'booking', BookingViewSet);
router.register(r'pembayaran', PembayaranViewSet);
router.register(r'review', ReviewRatingViewSet);

urlpatterns = [
    path('', include(router.urls)),
];