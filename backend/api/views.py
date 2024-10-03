from django.shortcuts import render
from rest_framework import viewsets
from .models import User, Maquina, Area  
from .serializers import UserSerializer, MaquinaSerializer, AreaSerializer  # Importar o serializer de Area


class MaquinaViewSet(viewsets.ModelViewSet):
    queryset = Maquina.objects.all()
    serializer_class = MaquinaSerializer


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer


class AreaViewSet(viewsets.ModelViewSet):
    queryset = Area.objects.all()
    serializer_class = AreaSerializer