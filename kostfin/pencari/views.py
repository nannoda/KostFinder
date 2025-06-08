from django.shortcuts import render
from rest_framework import viewsets, status;
from .models import *;
from .serializers import *;
from rest_framework.views import APIView;
from rest_framework.response import Response;
import json # ✅ Pastikan ini diimport
from django.contrib.auth.hashers import check_password
from rest_framework.decorators import api_view
from django.core.mail import send_mail
from django.conf import settings

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

    def create(self, request, *args, **kwargs):
        response = super().create(request, *args, **kwargs)
        booking = Booking.objects.get(pk=response.data['id'])

        # Kirim email ke pemilik kost
        pemilik_email = booking.kost.pemilik.email
        send_mail(
            subject='Ada Booking Baru untuk Kost Anda',
            message=(
                f"Nama Kost: {booking.kost.nama}\n"
                f"Pemesan: {booking.penghuni.nama}\n"
                f"Tanggal Masuk: {booking.tanggal_masuk}\n\n"
                "Silakan tinjau permintaan booking ini."
            ),
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[pemilik_email],
            fail_silently=True,
        )

        return response

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        old_status = instance.status_booking

        response = super().update(request, *args, **kwargs)
        instance.refresh_from_db()
        new_status = instance.status_booking

        # Jika status booking berubah dari pending ke disetujui/ditolak, kirim email ke pencari
        if old_status != new_status and new_status in ['disetujui', 'ditolak']:
            penghuni_email = instance.penghuni.email
            status_pesan = "disetujui" if new_status == "disetujui" else "ditolak"
            send_mail(
                subject='Status Booking Anda Telah Diperbarui',
                message=(
                    f"Hallo {instance.penghuni.nama},\n\n"
                    f"Booking Anda untuk kost '{instance.kost.nama}' telah {status_pesan} oleh pemilik.\n\n"
                    f"Terima kasih telah menggunakan aplikasi kami!"
                ),
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[penghuni_email],
                fail_silently=True,
            )

        return response
    
class PembayaranViewSet(viewsets.ModelViewSet):
    queryset = Pembayaran.objects.all();
    serializer_class = Pembayaranserializers;

class ReviewRatingViewSet(viewsets.ModelViewSet):
    serializer_class = ReviewRatingSerializer

    def get_queryset(self):
        kost_id = self.request.query_params.get("kost_id")
        qs = ReviewRating.objects.select_related("kost", "penghuni")
        if kost_id:
            return qs.filter(kost_id=kost_id, status="disetujui")
        return qs

    
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

# Di kelas PenghuniLoginView di views.py Anda
class PenghuniLoginView(APIView):
    def get(self, request):
        no_hp = request.GET.get("no_hp")
        if no_hp:
            penghuni_kost = PenghuniKost.objects.filter(no_hp=no_hp).first()
            if penghuni_kost:
                # ✅ Gunakan PenghuniKostSerializer untuk mendapatkan data lengkap
                serializer = PenghuniKostSerializer(penghuni_kost)
                return Response(serializer.data, status=status.HTTP_200_OK)
            return Response({"error": "Nomor telepon tidak ditemukan"}, status=status.HTTP_404_NOT_FOUND)

        # ... sisa kode get (jika no_hp tidak ada di query) ...
        penghuni_kost = PenghuniKost.objects.values("no_hp")
        return Response(list(penghuni_kost), status=status.HTTP_200_OK)

    def post(self, request):
        try:
            no_hp = request.data.get("no_hp")
            password = request.data.get("password") # Akan None jika dari Login Step 1
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

        # ✅ LOGIKA PEMISAH ANTARA STEP 1 DAN STEP 2
        if password: # Jika password ada, berarti ini dari Login Step 2
            # Ini adalah skenario Login Step 2: verifikasi password
            if check_password(password, penghuni_kost.password):
                # Login BERHASIL
                return Response({
                    "success": True,
                    "message": "Login berhasil!"
                }, status=status.HTTP_200_OK)
            else:
                # Password SALAH
                return Response({
                    "success": False,
                    "message": "Password salah."
                }, status=status.HTTP_401_UNAUTHORIZED)
        else: # Jika password TIDAK ada (None), berarti ini dari Login Step 1
            # Ini adalah skenario Login Step 1: hanya verifikasi nomor HP
            return Response({"success": True, "message": "Nomor ditemukan, lanjut ke login step 2."}, status=status.HTTP_200_OK)

@api_view(['POST'])
def buat_booking(request):
    serializer = BookingSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=201)
    return Response(serializer.errors, status=400)