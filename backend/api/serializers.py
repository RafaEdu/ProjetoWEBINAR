from rest_framework import serializers
from .models import User, Maquina, Area, Questionario, Pergunta, Alternativa, Curso 


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'


class MaquinaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Maquina
        fields = '__all__'


class AreaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Area  
        fields = '__all__'  

class AlternativaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Alternativa
        fields = ['texto', 'is_correta']

class AlternativaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Alternativa
        fields = ['texto', 'is_correta']

class PerguntaSerializer(serializers.ModelSerializer):
    alternativas = AlternativaSerializer(many=True)

    class Meta:
        model = Pergunta
        fields = ['texto', 'alternativas']

class QuestionarioSerializer(serializers.ModelSerializer):
    perguntas = PerguntaSerializer(many=True)

    class Meta:
        model = Questionario
        fields = ['idquestionario', 'titulo', 'perguntas']  # Adicione o campo idquestionario

    def create(self, validated_data):
        perguntas_data = validated_data.pop('perguntas')
        questionario = Questionario.objects.create(**validated_data)

        for pergunta_data in perguntas_data:
            alternativas_data = pergunta_data.pop('alternativas')
            pergunta = Pergunta.objects.create(questionario=questionario, **pergunta_data)
            for alternativa_data in alternativas_data:
                Alternativa.objects.create(pergunta=pergunta, **alternativa_data)
                
        return questionario



class CursoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Curso
        fields = '__all__'
