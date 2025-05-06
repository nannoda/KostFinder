from django.shortcuts import render
from rest_framework import viewsets;
from .models import *;
from .serializers import *;
# Create your views here.

class PenghuniKostViewSet(viewsets.ModelViewSet):
    queryset = PenghuniKost.objects.all();
    serializer_class = PenghuniKostSerializer;

class NotifikasiViewSet(viewsets.ModelViewSet):
    queryset = Notifikasi.objects.all();
    serializer_class = NotifikasiSerializer;

class BookingViewSet(viewsets.ModelViewSet):
    queryset = Booking.objects.all();
    serializer_class = BookingSerializer;

class PembayaranViewSet(viewsets.ModelViewSet):
    queryset = Pembayaran.objects.all();
    serializer_class = Pembayaranserializers;

class ReviewRatingViewSet(viewsets.ModelViewSet):
    queryset = ReviewRating.objects.all();
    serializer_class = ReviewRatingSerializer;