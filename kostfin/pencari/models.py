from django.db import models

# Create your models here.

class PenghuniKost(models.Model):
    nama = models.CharField(max_length=255);
    email = models.CharField(max_length=255);
    no_hp = models.IntegerField();
    
    def __str__(self):
        return self.nama;
    
class Booking(models.Model):
    kost = models.ForeignKey('pemilik.kost', on_delete=models.CASCADE);
    penghuni = models.ForeignKey('pencari.PenghuniKost', on_delete=models.CASCADE);
    status_booking = models.IntegerField();
    tanggal_booking = models.DateField();
    metode_pembayaran = models.CharField(max_length=255);
    
    def __str__(self):
        return f"{self.penghuni.nama} - {self.kost.nama}";
    
class Pembayaran(models.Model):
    booking = models.ForeignKey("pencari.Booking", on_delete=models.CASCADE);
    jumlah = models.IntegerField();
    tanggal_pembayaran = models.DateField();
    metode_pembayaran = models.CharField(max_length=20);
    
    def __str__(self):
        return f"Pembayaran {self.jumlah} untuk {self.booking}";
    
class ReviewRating(models.Model):
    admin = models.ForeignKey("Admin.Admin", on_delete=models.CASCADE);
    penghuni = models.ForeignKey('pencari.PenghuniKost', on_delete=models.CASCADE);
    komentar = models.CharField(max_length=255);
    rating = models.IntegerField();
    
    def __str__(self):
        return f"Rating {self.rating} oleh {self.penghuni.nama}";

class Notifikasi(models.Model):
    penghuni = models.ForeignKey('pencari.PenghuniKost', on_delete=models.CASCADE);
    pesan = models.CharField(max_length=255)
    tanggal_kirim = models.DateField()

    def __str__(self):
        return f"To {self.penghuni.nama}: {self.pesan[:30]}";