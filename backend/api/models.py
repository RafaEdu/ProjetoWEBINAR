from django.db import models
from django.contrib.auth.models import AbstractUser


class User(models.Model):
    email = models.EmailField(unique=True)
    nome = models.CharField(max_length=100)
    senha = models.CharField(max_length=100)
    is_active = models.BooleanField(default=True)
    is_admin = models.BooleanField(default=False)
    maquinas = models.ManyToManyField(
        'Maquina',
        related_name='usuarios',
        blank=True  # Permitir que o campo fique em branco
    )



    def __str__(self):
        return self.nome

class Admin(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    is_adm = models.BooleanField(default=True)

    def __str__(self):
        return f"Admin: {self.user.nome}"


class Curso(models.Model):
    idcurso = models.AutoField(primary_key=True)
    descricao = models.CharField(max_length=255)
    tempoDuracao = models.TimeField()
    idquestionario = models.ForeignKey('Questionario', on_delete=models.CASCADE)
    idarea = models.ForeignKey('Area', on_delete=models.CASCADE)


class Maquina(models.Model):
    idmaquina = models.AutoField(primary_key=True)
    nomeMaquina = models.CharField(max_length=100)


class Questionario(models.Model):
    idquestionario = models.AutoField(primary_key=True)
    titulo = models.CharField(max_length=255)  
        
    def __str__(self):
        return self.titulo


class Pergunta(models.Model):
    idpergunta = models.AutoField(primary_key=True)
    texto = models.TextField()  # Texto da pergunta
    questionario = models.ForeignKey(Questionario, related_name='perguntas', on_delete=models.CASCADE)

    def __str__(self):
        return self.texto
    

class Alternativa(models.Model):
    idalternativa = models.AutoField(primary_key=True)
    texto = models.CharField(max_length=255)  # Texto da alternativa
    is_correta = models.BooleanField(default=False)  # Se a alternativa é a correta
    pergunta = models.ForeignKey(Pergunta, related_name='alternativas', on_delete=models.CASCADE)

    def __str__(self):
        return self.texto

class Area(models.Model):
    idarea = models.AutoField(primary_key=True)
    nome = models.CharField(max_length=100)
    descricao = models.CharField(max_length=255)


class Video(models.Model):
    idvideo = models.AutoField(primary_key=True)
    duracao = models.TimeField()
    descricao = models.CharField(max_length=255)
    arquivo_video = models.FileField(upload_to='videos/')  # Atributo para anexar vídeos


class Slide(models.Model):
    idslide = models.AutoField(primary_key=True)
    descricao = models.CharField(max_length=255)
    paginas = models.IntegerField()
    arquivo_pdf = models.FileField(upload_to='slides/')  # Atributo para anexar PDFs



class Aula(models.Model):
    idaula = models.AutoField(primary_key=True)
    titulo = models.CharField(max_length=255)
    duracao = models.TimeField()
    idvideo = models.ForeignKey(Video, on_delete=models.CASCADE)
    idslide = models.ForeignKey(Slide, on_delete=models.CASCADE)
