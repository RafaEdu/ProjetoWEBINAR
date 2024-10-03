from rest_framework import serializers
from .models import User, Maquina

class MaquinaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Maquina
        fields = '__all__'

class UserSerializer(serializers.ModelSerializer):
    maquinas = MaquinaSerializer(many=True, read_only=True)

    class Meta:
        model = User
        fields = '__all__'
