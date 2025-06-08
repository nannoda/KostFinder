from django.db import models
from django.contrib.auth.hashers import make_password;
from django.core.validators import RegexValidator;

# Create your models here.

class PemilikKost(models.Model):
    nama = models.CharField(max_length=255);
    no_hp = models.CharField(
        max_length=13,
        validators=[
            RegexValidator(
                regex=r'^\d{12,13}$',
                message="Nomor HP harus terdiri dari 12–13 digit angka."
            )
        ]
    );
    alamat_kost = models.CharField(max_length=255);
    username = models.CharField(max_length=255, null= False);
    password = models.CharField(max_length=128, null= False);
    email = models.EmailField(max_length=255, default='');
    
    def save(self, *args, **kwargs):
        if not self.password.startswith('pbkdf2'):
            self.password = make_password(self.password);
        super().save(*args, **kwargs);
        
    def __str__(self):
        return self.nama;

class Kost(models.Model):
    nama = models.CharField(max_length=255);
    alamat = models.CharField(max_length=255);
    harga = models.IntegerField();
    fasilitas = models.CharField(max_length=255);
    deskripsi = models.TextField(default='Deskripsi belum tersedia');
    tipe_kost = models.CharField(max_length=255, choices=[('Putra', 'Putra'), ('Putri', 'Putri'), ('Campur', 'Campur')], default='Putra')
    rating = models.FloatField(default=0.0);
    pemilik = models.ForeignKey('pemilik.PemilikKost', on_delete=models.CASCADE);
    admin = models.ForeignKey('Admin.Admin', on_delete=models.CASCADE, default=1);
    lokasi = models.URLField(max_length=2000, help_text="Masukkan URL Google Maps", null=True, blank=True);
    created_at = models.DateTimeField(auto_now_add=True)
    status = models.CharField(
        max_length=20,
        choices=[("pending", "Pending"), ("disetujui", "Disetujui"), ("ditolak", "Ditolak")],
        default="pending")
    
    status_booking = models.CharField(
        max_length=20,
        choices=[("tidak tersedia", "Tidak Tersedia"), ("tersedia", "Tersedia"), ("pending", "Pending")],
        default="tersedia")
    
    def __str__(self):
        return self.nama;
    
class KostImage(models.Model):
    kost = models.ForeignKey(Kost, on_delete=models.CASCADE, related_name='gambar_kost')
    gambar1 = models.ImageField(upload_to='gambar_kost/', default='default.jpg')
    gambar2 = models.ImageField(upload_to='gambar_kost/', default='default.jpg')
    gambar3 = models.ImageField(upload_to='gambar_kost/', default='default.jpg')
    gambar4 = models.ImageField(upload_to='gambar_kost/', default='default.jpg')
    gambar5 = models.ImageField(upload_to='gambar_kost/', default='default.jpg')

    def __str__(self):
        return f"Gambar untuk {self.kost.nama}"