from rest_framework import serializers;
from .models import PenghuniKost, Notifikasi, Booking, Pembayaran, ReviewRating;
from django.contrib.auth.hashers import make_password, check_password;

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
        
class PenghuniRegisterSerializer(serializers.ModelSerializer):
    no_hp = serializers.CharField()
    class Meta :
        model = PenghuniKost;
        fields = "__all__";
        
    def create(self, validated_data):
        validated_data['password'] = make_password(validated_data['password']);
        return PenghuniKost.objects.create(**validated_data);
        
class PenghuniLoginSerializer(serializers.Serializer):
        username = serializers.CharField();
        password = serializers.CharField();
        
        def validate(self, data):
            try:
                pencari = PenghuniKost.objects.get(username=data['username']);
            except PenghuniKost.DoesNotExist:
                raise serializers.ValidationError("Username tidak ditemukan.");

            if not check_password(data['password'], pencari.password):
                raise serializers.ValidationError("Password salah.");

            return {
                'id': pencari.id,
                'nama': pencari.nama,
                'username': pencari.username
            };