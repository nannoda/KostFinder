from django.shortcuts import render
from rest_framework import viewsets, status;
from .models import PemilikKost, Kost, KostImage;
from .serializers import PemilikKostSerializers, KostImageSerializers, KostSerializers, PemilikRegisterSerializers, PemilikLoginSerializers;
from rest_framework.views import APIView;
from rest_framework.response import Response
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

class PemilikRegisterView(APIView):
    def post(self, request):
        serializer = PemilikRegisterSerializers(data=request.data);
        if serializer.is_valid():
            serializer.save();
            return Response({'message':'Pendaftaran berhasil'}, status= status.HTTP_201_CREATED);
        return Response(serializer.errors, status= status.HTTP_400_BAD_REQUEST);
    
class PemilikLoginView(APIView):
    def post(self, request):
        serializer = PemilikLoginSerializers(data=request.data);
        if serializer.is_valid():
            return Response({"message": "Login berhasil", "data": serializer.validated_data});
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST);
