from django.shortcuts import render
from rest_framework import viewsets, status;
from .models import *;
from .serializers import *;
from rest_framework.views import APIView;
from rest_framework.response import Response;
import json # ✅ Pastikan ini diimport
from django.contrib.auth.hashers import check_password

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
                return Response({"username": penghuni_kost.username}, status=status.HTTP_200_OK)  # ✅ Kembalikan username
            return Response({"error": "Nomor telepon tidak ditemukan"}, status=status.HTTP_404_NOT_FOUND)

        penghuni_kost = PenghuniKost.objects.values("no_hp")  # ✅ Ambil semua nomor HP jika query kosong
        return Response(list(penghuni_kost), status=status.HTTP_200_OK)


    # ✅ FOKUS PERUBAHAN DI SINI: Method POST yang menangani Step 1 DAN Step 2
    def post(self, request):
        try:
            no_hp = request.data.get("no_hp")
            password = request.data.get("password") # Akan None jika dari Login Step 1 / Lupa Password
            new_password = request.data.get("new_password") # ✅ Akan ada jika dari Lupa Password
        except Exception:
            return Response({"success": False, "message": "Format data request tidak valid."}, status=status.HTTP_400_BAD_REQUEST)

        # Validasi dasar: nomor HP harus ada
        if not no_hp:
            return Response({"success": False, "message": "Nomor HP diperlukan."}, status=status.HTTP_400_BAD_REQUEST)

        # Cari user berdasarkan nomor HP
        penghuni_kost = PenghuniKost.objects.filter(no_hp=no_hp).first()

        # Cek apakah nomor HP terdaftar
        if not penghuni_kost:
            return Response({"success": False, "message": "Nomor HP tidak terdaftar."}, status=status.HTTP_404_NOT_FOUND)

        # ✅ LOGIKA PEMISAH ANTARA SKENARIO
        if new_password: # ✅ SKENARIO LUPA PASSWORD
            penghuni_kost.password = make_password(new_password) # Hash password baru
            penghuni_kost.save()
            return Response({"success": True, "message": "Password berhasil direset."}, status=status.HTTP_200_OK)
        elif password: # SKENARIO LOGIN STEP 2 (password ada, tapi bukan new_password)
            if check_password(password, penghuni_kost.password):
                return Response({"success": True, "message": "Login berhasil!"}, status=status.HTTP_200_OK)
            else:
                return Response({"success": False, "message": "Password salah."}, status=status.HTTP_401_UNAUTHORIZED)
        else: # SKENARIO LOGIN STEP 1 (hanya no_hp, tidak ada password atau new_password)
            return Response({"success": True, "message": "Nomor ditemukan, lanjut ke login step 2."}, status=status.HTTP_200_OK)
