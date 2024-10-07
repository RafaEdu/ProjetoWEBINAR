from rest_framework import serializers
from .models import User, Maquina, Area, Questionario, Pergunta, Alternativa, Curso, Video, Slide, Aula


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


class VideoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Video
        fields = ['idvideo', 'arquivo_video']

class SlideSerializer(serializers.ModelSerializer):
    class Meta:
        model = Slide
        fields = ['idslide', 'arquivo_pdf']

class AulaSerializer(serializers.ModelSerializer):
    video = VideoSerializer(required=False)  # Relacionamento opcional com Video
    slide = SlideSerializer(required=False)  # Relacionamento opcional com Slide

    class Meta:
        model = Aula
        fields = ['idaula', 'titulo', 'duracao', 'idcurso', 'video', 'slide']

    def create(self, validated_data):
        video_data = validated_data.pop('video', None)
        slide_data = validated_data.pop('slide', None)

        # Criação da instância de aula
        aula = Aula.objects.create(**validated_data)

        # Se tiver vídeo, cria o objeto de vídeo e associa à aula
        if video_data:
            video_instance = Video.objects.create(**video_data)
            aula.idvideo = video_instance

        # Se tiver slide, cria o objeto de slide e associa à aula
        if slide_data:
            slide_instance = Slide.objects.create(**slide_data)
            aula.idslide = slide_instance

        aula.save()  # Salva as atualizações no banco
        return aula
