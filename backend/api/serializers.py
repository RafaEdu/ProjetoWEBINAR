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
        fields = ['idquestionario', 'titulo', 'perguntas']

    def create(self, validated_data):
        perguntas_data = validated_data.pop('perguntas')
        questionario = Questionario.objects.create(**validated_data)

        for pergunta_data in perguntas_data:
            alternativas_data = pergunta_data.pop('alternativas')
            pergunta = Pergunta.objects.create(questionario=questionario, **pergunta_data)
            for alternativa_data in alternativas_data:
                Alternativa.objects.create(pergunta=pergunta, **alternativa_data)
                
        return questionario

def update(self, instance, validated_data):
    # Atualiza os dados do questionário
    instance.titulo = validated_data.get('titulo', instance.titulo)
    instance.save()

    perguntas_data = validated_data.pop('perguntas', None)
    if perguntas_data is not None:
        # Atualiza perguntas
        for pergunta_data in perguntas_data:
            pergunta_id = pergunta_data.get('id')  # Assumindo que cada pergunta tem um campo 'id'
            alternativas_data = pergunta_data.pop('alternativas', [])

            if pergunta_id:  # Se já existe uma pergunta
                pergunta = Pergunta.objects.get(id=pergunta_id)
                pergunta.texto = pergunta_data.get('texto', pergunta.texto)
                pergunta.save()  # Salva as alterações da pergunta

                # Atualiza ou cria alternativas
                for alternativa_data in alternativas_data:
                    alternativa_id = alternativa_data.get('id')
                    if alternativa_id:  # Atualizar alternativa existente
                        alternativa = Alternativa.objects.get(id=alternativa_id)
                        alternativa.texto = alternativa_data.get('texto', alternativa.texto)
                        alternativa.is_correta = alternativa_data.get('is_correta', alternativa.is_correta)
                        alternativa.save()
                    else:  # Criar nova alternativa
                        Alternativa.objects.create(pergunta=pergunta, **alternativa_data)
            else:  # Criar nova pergunta se não houver ID
                pergunta = Pergunta.objects.create(questionario=instance, **pergunta_data)
                for alternativa_data in alternativas_data:
                    Alternativa.objects.create(pergunta=pergunta, **alternativa_data)

    return instance



class CursoSerializer(serializers.ModelSerializer):
    maquina = serializers.PrimaryKeyRelatedField(queryset=Maquina.objects.all(), many=True)
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
    video = VideoSerializer(required=False)
    slide = SlideSerializer(required=False)
    idvideo_id = serializers.IntegerField(source='idvideo.idvideo', read_only=True)  # Adicione este campo
    idslide_id = serializers.IntegerField(source='idslide.idslide', read_only=True)  # E este campo

    class Meta:
        model = Aula
        fields = ['idaula', 'titulo', 'duracao', 'idcurso', 'video', 'slide', 'idvideo_id', 'idslide_id']  # Inclua os IDs aqui

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