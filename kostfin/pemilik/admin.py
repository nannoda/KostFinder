from django.contrib import admin
from .models import PemilikKost, Kost, KostImage
from django.utils.safestring import mark_safe
# Register your models here.

@admin.register(PemilikKost)
class PemilikKostAdmin(admin.ModelAdmin):
    list_display = ('id', 'nama', 'no_hp', 'alamat_kost');

@admin.register(Kost)
class KostAdmin(admin.ModelAdmin):
    list_display = ('id', 'nama', 'alamat', 'harga', 'fasilitas', 'pemilik', 'admin');

class KostImageAdmin(admin.ModelAdmin):
    list_display = ('kost', 'preview_gambar1', 'preview_gambar2', 'preview_gambar3')
    readonly_fields = ('preview_gambar1', 'preview_gambar2', 'preview_gambar3', 'preview_gambar4', 'preview_gambar5')

    def preview_gambar1(self, obj):
        if obj.gambar1:
            return mark_safe(f'<img src="{obj.gambar1.url}" width="100"/>')
        return "-"

    def preview_gambar2(self, obj):
        if obj.gambar2:
            return mark_safe(f'<img src="{obj.gambar2.url}" width="100"/>')
        return "-"

    def preview_gambar3(self, obj):
        if obj.gambar3:
            return mark_safe(f'<img src="{obj.gambar3.url}" width="100"/>')
        return "-"

    def preview_gambar4(self, obj):
        if obj.gambar4:
            return mark_safe(f'<img src="{obj.gambar4.url}" width="100"/>')
        return "-"

    def preview_gambar5(self, obj):
        if obj.gambar5:
            return mark_safe(f'<img src="{obj.gambar5.url}" width="100"/>')
        return "-"

    class Media:
        css = {
            'all': ('admin/css/custom_admin.css',)
        }

admin.site.register(KostImage, KostImageAdmin)