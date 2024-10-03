from django.shortcuts import render
from rest_framework import viewsets
from .models import User, Maquina
from .serializers import UserSerializer, MaquinaSerializer

# Create your views here.

class MaquinaViewSet(viewsets.ModelViewSet):
    queryset = Maquina.objects.all()
    serializer_class = MaquinaSerializer

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer