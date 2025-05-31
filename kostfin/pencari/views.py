from django.shortcuts import render
from rest_framework import viewsets, status;
from .models import *;
from .serializers import *;
from rest_framework.views import APIView;
from rest_framework.response import Response;
from rest_framework.decorators import api_view

# Create your views here.

class PenghuniKostViewSet(viewsets.ModelViewSet):
    queryset = PenghuniKost.objects.all();
    serializer_class = PenghuniKostSerializer;

class NotifikasiViewSet(viewsets.ModelViewSet):
    queryset = Notifikasi.objects.all();
    serializer_class = NotifikasiSerializer;

class BookingViewSet(viewsets.ModelViewSet):
    serializer_class = BookingSerializer

    def get_queryset(self):
        if self.action in ['retrieve', 'update', 'partial_update', 'destroy']:
            return Booking.objects.all()
        
        pemilik_id = self.request.query_params.get('pemilik_id')
        if pemilik_id is not None:
            return Booking.objects.filter(kost__pemilik__id=pemilik_id)
        return Booking.objects.none()
    
class PembayaranViewSet(viewsets.ModelViewSet):
    queryset = Pembayaran.objects.all();
    serializer_class = Pembayaranserializers;

class ReviewRatingViewSet(viewsets.ModelViewSet):
    queryset = ReviewRating.objects.all();
    serializer_class = ReviewRatingSerializer;
    
class PenghuniRegisterView(APIView):
    def get(self, request):
        penghuni_kost = PenghuniKost.objects.all()  # ✅ Gunakan model PenghuniKost
        serializer = PenghuniRegisterSerializer(penghuni_kost, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    def post(self, request):
        serializer = PenghuniRegisterSerializer(data= request.data);
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Pendaftaran pencari berhasil"}, status=status.HTTP_201_CREATED);
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST);

class PenghuniLoginView(APIView):
    def get(self, request):
        no_hp = request.GET.get("no_hp")  # ✅ Ambil nomor HP dari query string
        if no_hp:
            penghuni_kost = PenghuniKost.objects.filter(no_hp=no_hp).first()
            if penghuni_kost:
                return Response({"username": penghuni_kost.username, "id" : penghuni_kost.id}, status=status.HTTP_200_OK)  # ✅ Kembalikan username
            return Response({"error": "Nomor telepon tidak ditemukan"}, status=status.HTTP_404_NOT_FOUND)

        penghuni_kost = PenghuniKost.objects.values("no_hp")  # ✅ Ambil semua nomor HP jika query kosong
        return Response(list(penghuni_kost), status=status.HTTP_200_OK)


    def post(self, request):
        no_hp = request.data.get("no_hp")  # ✅ Ambil nomor dari request
        if not no_hp:
            return Response({"error": "Nomor telepon diperlukan"}, status=status.HTTP_400_BAD_REQUEST)

        penghuni_kost = PenghuniKost.objects.filter(no_hp=no_hp).first()  # ✅ Cek apakah nomor ada di database
        if penghuni_kost:
            return Response({"message": "Nomor ditemukan, lanjut ke login step 2"}, status=status.HTTP_200_OK)
        return Response({"error": "Nomor telepon tidak ditemukan"}, status=status.HTTP_404_NOT_FOUND)
    
@api_view(['POST'])
def buat_booking(request):
    serializer = BookingSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=201)
    return Response(serializer.errors, status=400)
