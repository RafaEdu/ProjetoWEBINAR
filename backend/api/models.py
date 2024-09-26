from django.db import models
from django.contrib.auth.models import AbstractUser


class User(AbstractUser):
    matricula = models.IntegerField(unique=True)
    nome = models.CharField(max_length=100)
    area = models.ForeignKey('Area', on_delete=models.SET_NULL, null=True)
    setor = models.CharField(max_length=100)


class Admin(User):
    idadm = models.AutoField(primary_key=True)


class Maquina(models.Model):
    idmaquina = models.AutoField(primary_key=True)
    idcurso = models.ForeignKey('Curso', on_delete=models.CASCADE)


class Linha(models.Model):
    idlinha = models.AutoField(primary_key=True)
    idmaquina = models.ForeignKey(Maquina, on_delete=models.CASCADE)


class Funcionario(models.Model):
    idmatricula = models.ForeignKey(User, on_delete=models.CASCADE)
    idmaquina = models.ForeignKey(Maquina, on_delete=models.CASCADE)
    idcursos = models.ForeignKey('Curso', on_delete=models.CASCADE)


class Curso(models.Model):
    idcurso = models.AutoField(primary_key=True)
    descricao = models.CharField(max_length=255)
    porcentagem = models.IntegerField()
    vencimento = models.DateField()
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


class Slide(models.Model):
    idslide = models.AutoField(primary_key=True)
    descricao = models.CharField(max_length=255)
    paginas = models.IntegerField()


class Aula(models.Model):
    idaula = models.AutoField(primary_key=True)
    titulo = models.CharField(max_length=255)
    duracao = models.TimeField()
    idvideo = models.ForeignKey(Video, on_delete=models.CASCADE)
    idslide = models.ForeignKey(Slide, on_delete=models.CASCADE)
