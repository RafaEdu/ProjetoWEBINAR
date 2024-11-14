from django.db import models
from django.conf import settings
import os
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager

class UserManager(BaseUserManager):
    def create_user(self, email, nome, senha=None, **extra_fields):
        if not email:
            raise ValueError("O email é obrigatório.")
        email = self.normalize_email(email)
        user = self.model(email=email, nome=nome, **extra_fields)
        user.set_password(senha)  # Usa o hashing do Django para a senha
        user.save(using=self._db)
        return user

    def create_superuser(self, email, nome, senha=None, **extra_fields):
        extra_fields.setdefault("is_admin", True)
        extra_fields.setdefault("is_superuser", True)
        extra_fields.setdefault("is_staff", True)
        
        return self.create_user(email, nome, senha, **extra_fields)

class User(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(unique=True)
    nome = models.CharField(max_length=100)
    password = models.CharField(max_length=100) 
    is_active = models.BooleanField(default=True)
    is_admin = models.BooleanField(default=False)
    maquinas = models.ManyToManyField(
        'Maquina',
        related_name='usuarios',
        blank=True
    )

    objects = UserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['nome']

    def __str__(self):
        return self.nome

    @property
    def is_staff(self):
        return self.is_admin

class Admin(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    is_adm = models.BooleanField(default=True)

    def __str__(self):
        return f"Admin: {self.user.nome}"


class Maquina(models.Model):
    idmaquina = models.AutoField(primary_key=True)
    nomeMaquina = models.CharField(max_length=100)

    def __str__(self):
        return self.nomeMaquina

class Curso(models.Model):
    idcurso = models.AutoField(primary_key=True)
    titulo = models.CharField(max_length=255)
    descricao = models.CharField(max_length=255)
    idquestionario = models.ForeignKey('Questionario', on_delete=models.SET_NULL, null=True)
    idarea = models.ForeignKey('Area', on_delete=models.SET_NULL, null=True)
    dataCriacao = models.DateField()
    maquina = models.ManyToManyField(Maquina)



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
    arquivo_video = models.FileField(upload_to='videos/')  # Mantém a estrutura

    def save(self, *args, **kwargs):
        # Cria o diretório se não existir
        os.makedirs(os.path.join(settings.MEDIA_ROOT, 'videos'), exist_ok=True)
        super(Video, self).save(*args, **kwargs)


class Slide(models.Model):
    idslide = models.AutoField(primary_key=True)
    arquivo_pdf = models.FileField(upload_to='slides/')

    def save(self, *args, **kwargs):
        # Cria o diretório se não existir
        os.makedirs(os.path.join(settings.MEDIA_ROOT, 'slides'), exist_ok=True)
        super(Slide, self).save(*args, **kwargs)



class Aula(models.Model):
    idaula = models.AutoField(primary_key=True)
    titulo = models.CharField(max_length=255)
    duracao = models.TimeField()
    idvideo = models.ForeignKey(Video, on_delete=models.CASCADE, null=True)
    idslide = models.ForeignKey(Slide, on_delete=models.CASCADE, null=True)
    idcurso = models.ForeignKey(Curso, on_delete=models.SET_NULL, null=True)
