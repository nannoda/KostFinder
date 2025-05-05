from django.db import models

# Create your models here.

class PemilikKost(models.Model):
    nama = models.CharField(max_length=255);
    no_hp = models.IntegerField();
    alamat_kost = models.CharField(max_length=255);
    
    def __str__(self):
        return self.nama;
    
class Kost(models.Model):
    nama = models.CharField(max_length=255);
    alamat = models.CharField(max_length=255);
    harga = models.IntegerField();
    fasilitas = models.CharField(max_length=255);
    pemilik = models.ForeignKey('pemilik.PemilikKost', on_delete=models.CASCADE);
    admin = models.ForeignKey('Admin.Admin', on_delete=models.CASCADE);
    gambar = models.ImageField(upload_to='gambar_kost/', null=True, blank=True);
    lokasi = models.URLField(max_length=500, help_text="Masukkan URL Google Maps", null=True, blank=True);
    
    def __str__(self):
        return self.nama;