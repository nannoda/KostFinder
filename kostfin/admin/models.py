from django.db import models

# Create your models here.

class Admin(models.Model):
    nama = models.CharField(max_length=255);
    email = models.CharField(max_length=255);
    no_hp = models.CharField(max_length=255);
    
    def __str__(self):
        return self.nama;
    
# class ReviewRating(models.Model):
#     admin = models.ForeignKey(Admin, on_delete=models.CASCADE);
#     penghuni = models.ForeignKey('pencari.PenghuniKost', on_delete=models.CASCADE);
#     komentar = models.CharField(max_length=255);
#     rating = models.IntegerField();
    
#     def __str__(self):
#         return f"Rating {self.rating} oleh {self.penghuni.nama}";
    

