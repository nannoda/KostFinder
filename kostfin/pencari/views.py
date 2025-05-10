from django.shortcuts import render
from rest_framework import viewsets, status;
from .models import *;
from .serializers import *;
from rest_framework.views import APIView;
from rest_framework.response import Response;

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
    
class PenghuniRegisterView(APIView):
    def post(self, request):
        serializer = PenghuniRegisterSerializer(data= request.data);
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Pendaftaran pencari berhasil"}, status=status.HTTP_201_CREATED);
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST);

class PenghuniLoginView(APIView):
    def post(self, request):
        serializer = PenghuniLoginSerializer(data=request.data);
        if serializer.is_valid():
            return Response({"message": "Login pencari berhasil", "data": serializer.validated_data});
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST);
