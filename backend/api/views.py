from django.shortcuts import render
from rest_framework import viewsets, status 
from rest_framework.response import Response  
from rest_framework import serializers  
from .models import Aula, Video, Slide, User, Maquina, Area, Questionario, Curso
from .serializers import UserSerializer, MaquinaSerializer, AreaSerializer, QuestionarioSerializer, CursoSerializer, AulaSerializer, VideoSerializer, SlideSerializer


class MaquinaViewSet(viewsets.ModelViewSet):
    queryset = Maquina.objects.all()
    serializer_class = MaquinaSerializer


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer


class AreaViewSet(viewsets.ModelViewSet):
    queryset = Area.objects.all()
    serializer_class = AreaSerializer

    from rest_framework import viewsets


class QuestionarioViewSet(viewsets.ModelViewSet):
    queryset = Questionario.objects.all()
    serializer_class = QuestionarioSerializer


class CursoViewSet(viewsets.ModelViewSet):
    queryset = Curso.objects.all()
    serializer_class = CursoSerializer  



class AulaViewSet(viewsets.ModelViewSet):
    queryset = Aula.objects.all()
    serializer_class = AulaSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        video_data = request.FILES.get('video', None)
        slide_data = request.FILES.get('slide', None)

        if video_data:
            video = Video.objects.create(arquivo_video=video_data)
            serializer.save(idvideo=video)
        elif slide_data:
            slide = Slide.objects.create(arquivo_pdf=slide_data)
            serializer.save(idslide=slide)
        else:
            return Response({"error": "You must attach a video or a slide."}, status=status.HTTP_400_BAD_REQUEST)

        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def list_by_curso(self, request, idcurso=None):
        """
        Retrieve a list of all aulas related to a specific curso.
        """
        if idcurso is None:
            return Response({"error": "idcurso is required."}, status=status.HTTP_400_BAD_REQUEST)

        aulas = Aula.objects.filter(idcurso=idcurso)
        serializer = self.get_serializer(aulas, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

class VideoViewSet(viewsets.ModelViewSet):
    queryset = Video.objects.all()
    serializer_class = VideoSerializer

class SlideViewSet(viewsets.ModelViewSet):
    queryset = Slide.objects.all()
    serializer_class = SlideSerializer
 
