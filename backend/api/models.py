from django.db import models
from django.contrib.auth.models import AbstractUser


class User(models.Model):
    email = models.EmailField(unique=True)
    nome = models.CharField(max_length=100)
    senha = models.CharField(max_length=100)
    is_active = models.BooleanField(default=True)
    is_admin = models.BooleanField(default=False)
    idmaquina = models.ForeignKey(
        'Maquina',  # Certifique-se de que Maquina esteja definido corretamente
        on_delete=models.CASCADE,
        related_name='usuarios',
        null=True,  # Permitir valores nulos
        blank=True  # Permitir que o campo fique em branco
    )


    def __str__(self):
        return self.nome

class Admin(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    is_adm = models.BooleanField(default=True)

    def __str__(self):
        return f"Admin: {self.user.nome}"


class Maquina(models.Model):
    idmaquina = models.AutoField(primary_key=True)
    idcurso = models.ForeignKey('Curso', on_delete=models.CASCADE)
    nomeMaquina = models.CharField(max_length=100)


class Curso(models.Model):
    idcurso = models.AutoField(primary_key=True)
    descricao = models.CharField(max_length=255)
    tempoDuracao = models.TimeField()
    idquestionario = models.ForeignKey('Questionario', on_delete=models.CASCADE)
    idarea = models.ForeignKey('Area', on_delete=models.CASCADE)


class Questionario(models.Model):
    idquestionario = models.AutoField(primary_key=True)
    pergunta = models.CharField(max_length=255)
    alternativas = models.CharField(max_length=255)
    respostas = models.CharField(max_length=255)


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
