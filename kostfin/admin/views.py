from django.shortcuts import render;
from rest_framework import viewsets;
from .models import Admin;
from .serializers import AdminSerializer;
# Create your views here.

class AdminViewSet(viewsets.ModelViewSet):
    queryset = Admin.objects.all();
    serializer_class = AdminSerializer;
