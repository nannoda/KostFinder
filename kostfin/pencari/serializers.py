from rest_framework import serializers;
from .models import PenghuniKost, Notifikasi, Booking, Pembayaran, ReviewRating;

class PenghuniKostSerializer(serializers.ModelSerializer):
    class Meta:
        model = PenghuniKost;
        fields = "__all__";
        
class NotifikasiSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notifikasi;
        fields = "__all__";

class BookingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Booking;
        fields = "__all__";
        
class Pembayaranserializers(serializers.ModelSerializer):
    class Meta:
        model = Pembayaran;
        fields = "__all__";
        
class ReviewRatingSerializer(serializers.ModelSerializer):
    class Meta:
        model = ReviewRating;
        fields = "__all__";