from django.shortcuts import render
from rest_framework import viewsets, status;
from .models import PemilikKost, Kost, KostImage;
from .serializers import PemilikKostSerializers, KostImageSerializers, KostSerializers, PemilikRegisterSerializers, PemilikLoginSerializers;
from rest_framework.views import APIView;
from rest_framework.response import Response
import json # ✅ Pastikan ini diimport
from django.contrib.auth.hashers import check_password

# Create your views here.

class PemilikKostViewSet(viewsets.ModelViewSet):
    queryset = PemilikKost.objects.all();
    serializer_class = PemilikKostSerializers;
    
class KostViewSet(viewsets.ModelViewSet):
    queryset = Kost.objects.all();
    serializer_class = KostSerializers;

class KostImageViewSet(viewsets.ModelViewSet):
    queryset = KostImage.objects.all();
    serializer_class = KostImageSerializers;

class PemilikRegisterView(APIView):
    def get(self, request):
        pemilik_list = PemilikKost.objects.all()  # ✅ Ambil semua pemilik yang terdaftar
        serializer = PemilikRegisterSerializers(pemilik_list, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)  # ✅ Kirim daftar pemilik ke frontend

    def post(self, request):
        serializer = PemilikRegisterSerializers(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({'message': 'Pendaftaran berhasil'}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    
class PemilikLoginView(APIView):
    def get(self, request):
        no_hp = request.GET.get("no_hp")

        if no_hp:
            pemilik_kost = PemilikKost.objects.filter(no_hp=no_hp).first()
            if pemilik_kost:
                return Response({"username": pemilik_kost.username}, status=status.HTTP_200_OK)  # ✅ Kembalikan username pemilik
            return Response({"error": "Nomor telepon tidak ditemukan"}, status=status.HTTP_404_NOT_FOUND)

        pemilik_kost = PemilikKost.objects.values("no_hp")
        return Response(list(pemilik_kost), status=status.HTTP_200_OK)

    def post(self, request):
        try:
            no_hp = request.data.get("no_hp")
            password = request.data.get("password") # Akan None jika dari Login Step 1
        except Exception:
            return Response({"success": False, "message": "Format data request tidak valid."}, status=status.HTTP_400_BAD_REQUEST)

        # Validasi dasar: nomor HP harus ada
        if not no_hp:
            return Response({"success": False, "message": "Nomor HP diperlukan."}, status=status.HTTP_400_BAD_REQUEST)

        # Cari user berdasarkan nomor HP di model PemilikKost
        pemilik_kost = PemilikKost.objects.filter(no_hp=no_hp).first()

        # Cek apakah nomor HP terdaftar
        if not pemilik_kost:
            return Response({"success": False, "message": "Nomor HP tidak terdaftar."}, status=status.HTTP_404_NOT_FOUND)

        # ✅ LOGIKA PEMISAH ANTARA STEP 1 DAN STEP 2
        if password: # Jika password ada, berarti ini dari Login Step 2 (verifikasi password)
            # Ini adalah skenario Login Step 2: verifikasi password
            if check_password(password, pemilik_kost.password): # ✅ Gunakan pemilik_kost.password
                # Login BERHASIL
                return Response({
                    "success": True,
                    "message": "Login berhasil!"
                    # Anda bisa menambahkan data user lain di sini jika perlu
                }, status=status.HTTP_200_OK)
            else:
                # Password SALAH
                return Response({
                    "success": False,
                    "message": "Password salah."
                }, status=status.HTTP_401_UNAUTHORIZED)
        else: # Jika password TIDAK ada (None), berarti ini dari Login Step 1 (hanya verifikasi nomor HP)
            # Ini adalah skenario Login Step 1: hanya verifikasi nomor HP
            return Response({"success": True, "message": "Nomor ditemukan, lanjut ke login step 2."}, status=status.HTTP_200_OK)

