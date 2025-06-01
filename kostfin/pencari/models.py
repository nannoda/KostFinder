from django.db import models
from django.contrib.auth.hashers import make_password;
from django.core.validators import RegexValidator;
# Create your models here.

class PenghuniKost(models.Model):
    nama = models.CharField(max_length=255);
    email = models.CharField(max_length=255);
    no_hp = models.CharField(
        max_length=13,
        validators=[
            RegexValidator(
                regex=r'^\d{12,13}$',
                message="Nomor HP harus terdiri dari 12–13 digit angka."
            )
        ]
    );
    username = models.CharField(max_length=255, unique=True, null= False);
    password = models.CharField(max_length=128, null= False);
    
    def save(self, *args, **kwargs):
        if not self.password.startswith('pbkdf2'):
            self.password = make_password(self.password);
        super().save(*args, **kwargs);
        
    def __str__(self):
        return self.nama;
    
class Booking(models.Model):
    kost = models.ForeignKey('pemilik.Kost', on_delete=models.CASCADE)
    penghuni = models.ForeignKey('pencari.PenghuniKost', on_delete=models.CASCADE)
    status_booking = models.CharField(
        max_length=20,
        choices=[("pending", "Pending"), ("disetujui", "Disetujui"), ("ditolak", "Ditolak")],
        default="pending")
    tanggal_booking = models.DateField(auto_now_add=True)
    tanggal_masuk = models.DateField(default=None, null=True, blank=True)

    def __str__(self):
        return f"{self.penghuni.nama} - {self.kost.nama} ({self.get_status_booking_display()})"

    
class Pembayaran(models.Model):
    booking = models.ForeignKey("pencari.Booking", on_delete=models.CASCADE);
    jumlah = models.IntegerField();
    tanggal_pembayaran = models.DateField();
    metode_pembayaran = models.CharField(max_length=20);
    
    def __str__(self):
        return f"Pembayaran {self.jumlah} untuk {self.booking}";
    
class ReviewRating(models.Model):
    admin = models.ForeignKey("Admin.Admin", on_delete=models.CASCADE);
    kost = models.ForeignKey("pemilik.Kost", on_delete=models.CASCADE, related_name="review")
    penghuni = models.ForeignKey('pencari.PenghuniKost', on_delete=models.CASCADE);
    komentar = models.CharField(max_length=255);
    rating = models.IntegerField();
    status = models.CharField(
        max_length=20,
        choices=[("pending", "Pending"), ("disetujui", "Disetujui"), ("ditolak", "Ditolak")],
        default="pending")
    tanggal = models.DateField(auto_now_add=True)
    
    def __str__(self):
        return f"Rating {self.rating} oleh {self.penghuni.nama}";

class Notifikasi(models.Model):
    penghuni = models.ForeignKey('pencari.PenghuniKost', on_delete=models.CASCADE);
    pesan = models.CharField(max_length=255)
    tanggal_kirim = models.DateField()

    def __str__(self):
        return f"To {self.penghuni.nama}: {self.pesan[:30]}";