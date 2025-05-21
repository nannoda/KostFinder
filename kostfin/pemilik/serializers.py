from rest_framework import serializers;
from .models import PemilikKost, Kost, KostImage;
from django.contrib.auth.hashers import make_password, check_password;

class PemilikKostSerializers(serializers.ModelSerializer):
    class Meta:
        model = PemilikKost;
        fields = '__all__';
    
class KostImageSerializers(serializers.ModelSerializer):
    class Meta:
        model = KostImage;
        fields = '__all__';

class KostSerializers(serializers.ModelSerializer):
    gambar_kost = KostImageSerializers(many=True, read_only=True);
    
    class Meta:
        model = Kost;
        fields = '__all__';
        
class PemilikRegisterSerializers(serializers.ModelSerializer):
    no_hp = serializers.CharField()
    class Meta:
        model = PemilikKost;
        fields = ['username', 'password', 'nama', 'no_hp', 'alamat_kost'];

    def create(self, validated_data):
        validated_data['password'] = make_password(validated_data['password']);
        return PemilikKost.objects.create(**validated_data);
    
class PemilikLoginSerializers(serializers.ModelSerializer):
    username = serializers.CharField();
    password = serializers.CharField();
    
    def validate(self, data):
        try:
            pemilik = PemilikKost.objects.get(username= data['username']);
        except PemilikKost.DoesNotExist:
            raise serializers.ValidationError('Username tidak ditemukan.');
        
        if not check_password(data['password'], pemilik.password):
            raise serializers.ValidationError("Password salah.");
        
        return {'id': pemilik.id, 'nama':pemilik.nama, 'username' : pemilik.username};