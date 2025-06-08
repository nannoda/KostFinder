from django.shortcuts import render
from rest_framework import viewsets, status;
from .models import PemilikKost, Kost, KostImage;
from .serializers import PemilikKostSerializers, KostImageSerializers, KostSerializers, PemilikRegisterSerializers, PemilikLoginSerializers;
from rest_framework.views import APIView;
from rest_framework.response import Response
import json # ✅ Pastikan ini diimport
from django.contrib.auth.hashers import check_password, make_password

from rest_framework.generics import RetrieveUpdateAPIView
from django.core.mail import send_mail
from django.conf import settings

# Create your views here.

class PemilikKostViewSet(viewsets.ModelViewSet):
    queryset = PemilikKost.objects.all();
    serializer_class = PemilikKostSerializers;

class KostViewSet(viewsets.ModelViewSet):
    queryset = Kost.objects.all()
    serializer_class = KostSerializers

    def create(self, request, *args, **kwargs):
        response = super().create(request, *args, **kwargs)
        kost_data = response.data

        # Kirim email ke admin
        send_mail(
            subject='Pengajuan Kost Baru Menunggu Persetujuan',
            message=f"Kost baru telah diajukan:\n\nNama: {kost_data['nama']}\nAlamat: {kost_data['alamat']}\nStatus: {kost_data['status']}",
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[settings.ADMIN_EMAIL],
            fail_silently=True,
        )
        return response

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        old_status = instance.status

        response = super().update(request, *args, **kwargs)

        instance.refresh_from_db()
        new_status = instance.status

        # Jika status berubah dari pending → disetujui, kirim email ke pemilik
        if old_status != "disetujui" and new_status == "disetujui":
            send_mail(
                subject='Kost Anda Telah Disetujui',
                message=f"Hai {instance.pemilik.nama}, kost Anda '{instance.nama}' telah disetujui oleh admin dan sudah tayang di aplikasi.",
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[instance.pemilik.email],
                fail_silently=True,
            )
        return response



class KostImageViewSet(viewsets.ModelViewSet):
    serializer_class = KostImageSerializers;

    def get_queryset(self):
        queryset = KostImage.objects.all()
        kost_id = self.request.query_params.get('kost_id')
        if kost_id:
            queryset = queryset.filter(kost__id=kost_id)
        return queryset

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
                serializer = PemilikKostSerializers(pemilik_kost)
                return Response(serializer.data, status=status.HTTP_200_OK)  # ✅ Kembalikan username pemilik
            return Response({"error": "Nomor telepon tidak ditemukan"}, status=status.HTTP_404_NOT_FOUND)

        pemilik_kost = PemilikKost.objects.values("no_hp")
        return Response(list(pemilik_kost), status=status.HTTP_200_OK)

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
        pemilik_kost = PemilikKost.objects.filter(no_hp=no_hp).first()

        # Cek apakah nomor HP terdaftar
        if not pemilik_kost:
            return Response({"success": False, "message": "Nomor HP tidak terdaftar."}, status=status.HTTP_404_NOT_FOUND)

        # ✅ LOGIKA PEMISAH ANTARA SKENARIO
        if new_password: # ✅ SKENARIO LUPA PASSWORD
            pemilik_kost.password = make_password(new_password) # Hash password baru
            pemilik_kost.save()
            return Response({"success": True, "message": "Password berhasil direset."}, status=status.HTTP_200_OK)
        elif password: # SKENARIO LOGIN STEP 2 (password ada, tapi bukan new_password)
            if check_password(password, pemilik_kost.password):
                return Response({"success": True, "message": "Login berhasil!"}, status=status.HTTP_200_OK)
            else:
                return Response({"success": False, "message": "Password salah."}, status=status.HTTP_401_UNAUTHORIZED)
        else: # SKENARIO LOGIN STEP 1 (hanya no_hp, tidak ada password atau new_password)
            return Response({"success": True, "message": "Nomor ditemukan, lanjut ke login step 2."}, status=status.HTTP_200_OK)

class KostDetailView(RetrieveUpdateAPIView):
    queryset = Kost.objects.all()
    serializer_class = KostSerializers