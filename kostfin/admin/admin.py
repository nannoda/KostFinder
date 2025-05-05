from django.contrib import admin
from .models import Admin
# Register your models here.

@admin.register(Admin)
class AdminAdmin(admin.ModelAdmin):
    list_display = ('id', 'nama', 'email', 'no_hp');