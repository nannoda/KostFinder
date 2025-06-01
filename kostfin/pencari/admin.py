from django.contrib import admin
from .models import PenghuniKost, Notifikasi, Booking, Pembayaran, ReviewRating
# Register your models here.

@admin.register(PenghuniKost)
class PenghuniKostAdmin(admin.ModelAdmin):
    list_display = ('id', 'nama', 'email', 'no_hp');

@admin.register(Notifikasi)
class NotifikasiAdmin(admin.ModelAdmin):
    list_display = ('id', 'penghuni', 'pesan', 'tanggal_kirim');

@admin.register(Booking)
class BookingAdmin(admin.ModelAdmin):
    list_display = ('id', 'kost', 'penghuni', 'status_booking', 'tanggal_booking', 'tanggal_masuk');

@admin.register(Pembayaran)
class PembayaranAdmin(admin.ModelAdmin):
    list_display = ('id', 'booking', 'jumlah', 'tanggal_pembayaran', 'metode_pembayaran');

@admin.register(ReviewRating)
class ReviewRatingAdmin(admin.ModelAdmin):
    list_display = ('id', 'admin', 'penghuni', 'komentar', 'rating', 'status', 'tanggal');