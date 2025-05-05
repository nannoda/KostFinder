from django.contrib import admin
from .models import PemilikKost, Kost
# Register your models here.

@admin.register(PemilikKost)
class PemilikKostAdmin(admin.ModelAdmin):
    list_display = ('id', 'nama', 'no_hp', 'alamat_kost');

@admin.register(Kost)
class KostAdmin(admin.ModelAdmin):
    list_display = ('id', 'nama', 'alamat', 'harga', 'fasilitas', 'pemilik', 'admin');