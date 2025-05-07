from django.shortcuts import render
from rest_framework import viewsets;
from .models import PemilikKost, Kost, KostImage;
from .serializers import PemilikKostSerializers, KostImageSerializers, KostSerializers;
# Create your views here.

class PemilikKostViewSet(viewsets.ModelViewSet):
    queryset = PemilikKost.objects.all();
    serializer_class = PemilikKostSerializers;
    
class KostViewSet(viewsets.ModelViewSet):
    queryset = Kost.objects.all();
    serializer_class = KostSerializers;

class KostImageViewSet(viewsets.ModelViewSet):
    queryset = KostImage.objects.all();
    serializer_class = KostImageSerializers;
