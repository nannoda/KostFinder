from rest_framework import serializers;
from .models import PemilikKost, Kost, KostImage;

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