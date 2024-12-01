from django.shortcuts import render
from rest_framework import viewsets, status 
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken  
from rest_framework import serializers  
from django.contrib.auth import authenticate
from .models import AulaUsuario, MaquinaUsuarioProgresso, CursoUsuario, Aula, Video, Slide, User, Maquina, Area, Questionario, Curso, Pergunta, Alternativa
from .serializers import UserSerializer, MaquinaSerializer, AreaSerializer, QuestionarioSerializer, CursoSerializer, AulaSerializer, VideoSerializer, SlideSerializer
from .serializers import CursosSerializer, MaquinaUserSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from api.models import UsuarioRel, MaquinaRel, CursoRel, AreaRel


class LoginView(APIView):
    def post(self, request):
        email = request.data.get("email")
        id = request.data.get("id")
        password = request.data.get("password")

        # Tenta autenticar o usuário
        user = authenticate(email=email, password=password)
        if user is not None:
            refresh = RefreshToken.for_user(user)
            return Response({
                'email':user.email,
                'nome': user.nome,
                'id': user.id,
                'refresh': str(refresh),
                'access': str(refresh.access_token),
                'is_admin': user.is_admin  # Inclui o valor de is_admin na resposta
            })
        return Response({"error": "Credenciais inválidas"}, status=status.HTTP_401_UNAUTHORIZED)


class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            refresh_token = request.data.get("refresh")
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response(status=status.HTTP_205_RESET_CONTENT)
        except Exception as e:
            return Response(status=status.HTTP_400_BAD_REQUEST)

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

    def update(self, request, *args, **kwargs):
        questionario = self.get_object()  # Obtém o questionário pelo ID passado na URL

        # Exclui todas as perguntas e alternativas associadas ao questionário atual
        Pergunta.objects.filter(questionario_id=questionario.idquestionario).delete()

        # Atualiza o título do questionário com o dado recebido
        questionario.titulo = request.data.get('titulo', questionario.titulo)
        questionario.save()

        # Recria as perguntas e alternativas com os novos dados
        for pergunta_data in request.data.get('perguntas', []):
            nova_pergunta = Pergunta.objects.create(
                texto=pergunta_data['texto'],
                questionario=questionario
            )
            for alternativa_data in pergunta_data['alternativas']:
                Alternativa.objects.create(
                    texto=alternativa_data['texto'],
                    is_correta=alternativa_data['is_correta'],
                    pergunta=nova_pergunta
                )

        # Serializa e retorna o questionário atualizado
        serializer = self.get_serializer(questionario)
        return Response(serializer.data, status=status.HTTP_200_OK)


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
            return Response({"error": "Você deve anexar um vídeo ou um slide."}, status=status.HTTP_400_BAD_REQUEST)

        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def update(self, request, *args, **kwargs):
        aula = self.get_object()  # Obtém a instância da aula a ser atualizada
        serializer = self.get_serializer(aula, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)

        # Verifica se o novo vídeo ou slide foi enviado
        video_data = request.FILES.get('video', None)
        slide_data = request.FILES.get('slide', None)

        if video_data:
            # Se já houver um vídeo, o excluímos antes de criar um novo
            if aula.idvideo:
                aula.idvideo.delete()  # Remove o vídeo antigo
            video = Video.objects.create(arquivo_video=video_data)
            aula.idvideo = video  # Atribui o novo vídeo

        if slide_data:
            # Se já houver um slide, o excluímos antes de criar um novo
            if aula.idslide:
                aula.idslide.delete()  # Remove o slide antigo
            slide = Slide.objects.create(arquivo_pdf=slide_data)
            aula.idslide = slide  # Atribui o novo slide

        # Salva a aula atualizada
        serializer.save()

        return Response(serializer.data, status=status.HTTP_200_OK)

    def list_by_curso(self, request, idcurso=None):
        if idcurso is None:
            return Response({"error": "idcurso é obrigatório."}, status=status.HTTP_400_BAD_REQUEST)

        aulas = Aula.objects.filter(idcurso=idcurso)
        serializer = self.get_serializer(aulas, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class VideoViewSet(viewsets.ModelViewSet):
    queryset = Video.objects.all()
    serializer_class = VideoSerializer

class SlideViewSet(viewsets.ModelViewSet):
    queryset = Slide.objects.all()
    serializer_class = SlideSerializer
 
class MaquinasDoUsuarioPorIDView(APIView):
    def get(self, request, user_id):
        try:
            # Busca o usuário pelo ID
            usuario = User.objects.get(id=user_id)

           
            maquinas = usuario.maquinas.all()

            
            serializer = MaquinaUserSerializer(maquinas, many=True)

            return Response(serializer.data, status=200)
        except User.DoesNotExist:
            return Response({'error': 'Usuário não encontrado.'}, status=404)
        except Exception as e:
            return Response({'error': str(e)}, status=500)
        
        
class CursoListView(APIView):
    def get(self, request, user_id):
        try:
            # Busca o usuário pelo ID
            usuario = User.objects.get(id=user_id)

            # Obtém as máquinas associadas ao usuário
            user_maquinas = usuario.maquinas.all()

            if not user_maquinas:
                return Response({'error': 'O usuário não tem máquinas associadas.'}, status=404)

            # Filtra os cursos vinculados às máquinas do usuário
            cursos = Curso.objects.filter(maquina__in=user_maquinas).distinct()

            if not cursos.exists():
                return Response({'detail': 'Nenhum curso encontrado para as máquinas associadas a este usuário.'}, status=404)

            # Serializa os cursos filtrados
            serializer = CursosSerializer(cursos, many=True)

            return Response(serializer.data, status=status.HTTP_200_OK)

        except User.DoesNotExist:
            return Response({'error': 'Usuário não encontrado.'}, status=404)
        except Exception as e:
            return Response({'error': str(e)}, status=500)



class ConcluirAulaView(APIView):
    def post(self, request):
        user_id = request.data.get('user_id')  # Obter o ID do usuário do payload
        aula_id = request.data.get('aula_id')

        try:
            usuario = User.objects.get(pk=user_id)  # Busca o usuário pelo ID
        except User.DoesNotExist:
            return Response({"error": "Usuário não encontrado."}, status=status.HTTP_404_NOT_FOUND)

        try:
            aula = Aula.objects.get(pk=aula_id)
        except Aula.DoesNotExist:
            return Response({"error": "Aula não encontrada."}, status=status.HTTP_404_NOT_FOUND)

        # Marca a aula como concluída para o usuário
        aula_usuario, created = AulaUsuario.objects.get_or_create(
            usuario=usuario,
            aula=aula
        )
        aula_usuario.concluida = True
        aula_usuario.save()

        # Atualiza o progresso do curso relacionado
        self.atualizar_progresso_curso(usuario, aula.idcurso)

        return Response({"message": "Aula concluída com sucesso!"}, status=status.HTTP_200_OK)

    def atualizar_progresso_curso(self, usuario, curso):
        # Busca todas as aulas do curso
        aulas_do_curso = curso.aula_set.all()
        total_aulas = aulas_do_curso.count()

        # Verifica quantas aulas desse curso o usuário concluiu
        aulas_concluidas = AulaUsuario.objects.filter(
            usuario=usuario,
            aula__idcurso=curso,
            concluida=True
        ).count()

        # Calcula o progresso
        progresso = (aulas_concluidas / total_aulas) * 100 if total_aulas > 0 else 0

        # Atualiza ou cria o registro de progresso do curso para o usuário
        curso_usuario, created = CursoUsuario.objects.get_or_create(
            usuario=usuario,
            curso=curso
        )
        curso_usuario.progresso = progresso
        curso_usuario.save()

        # Atualiza o progresso da máquina associada
        self.atualizar_progresso_maquina(usuario, curso)

    def atualizar_progresso_maquina(self, usuario, curso):
        # Identifica as máquinas associadas ao curso
        maquinas = curso.maquina.all()
        for maquina in maquinas:
            cursos_da_maquina = maquina.curso_set.all()
            total_cursos = cursos_da_maquina.count()

            # Verifica quantos cursos dessa máquina o usuário concluiu
            cursos_concluidos = CursoUsuario.objects.filter(
                usuario=usuario,
                curso__in=cursos_da_maquina,
                progresso=100
            ).count()

            # Calcula o progresso da máquina
            progresso_maquina = (cursos_concluidos / total_cursos) * 100 if total_cursos > 0 else 0

            # Atualiza ou cria o registro de progresso da máquina
            maquina_usuario, created = MaquinaUsuarioProgresso.objects.get_or_create(
                usuario=usuario,
                maquina=maquina
            )
            maquina_usuario.progresso = progresso_maquina
            maquina_usuario.save()



class ConsultarProgressoView(APIView):
    def get(self, request, user_id):
        # Valida a existência do user_id
        if not user_id:
            return Response({"error": "O parâmetro user_id é obrigatório."}, status=status.HTTP_400_BAD_REQUEST)

        # Verifica se o usuário existe
        try:
            usuario = User.objects.get(pk=user_id)
        except User.DoesNotExist:
            return Response({"error": "Usuário não encontrado."}, status=status.HTTP_404_NOT_FOUND)

        # Consulta os dados relacionados
        maquinas_progresso = MaquinaUsuarioProgresso.objects.filter(usuario=usuario).values(
            "maquina__idmaquina", "maquina__nomeMaquina", "progresso"
        )
        cursos_progresso = CursoUsuario.objects.filter(usuario=usuario).values(
            "curso__idcurso", "curso__titulo", "progresso"
        )
        aulas_concluidas = AulaUsuario.objects.filter(usuario=usuario, concluida=True).values(
            "aula__idaula", "aula__titulo"
        )

        # Retorna os dados em formato simplificado
        return Response({
            "maquinas": list(maquinas_progresso),
            "cursos": list(cursos_progresso),
            "aulasConcluidas": list(aulas_concluidas),
        }, status=status.HTTP_200_OK)




class AulasComConclusaoView(APIView):
    def get(self, request, idcurso):
        user_id = request.query_params.get('user_id')  # Obtém o user_id dos parâmetros da URL

        if not user_id:
            return Response({"error": "O parâmetro user_id é obrigatório."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            usuario = User.objects.get(pk=user_id)  # Busca o usuário pelo ID
        except User.DoesNotExist:
            return Response({"error": "Usuário não encontrado."}, status=status.HTTP_404_NOT_FOUND)

        try:
            # Obtém as aulas do curso
            aulas = Aula.objects.filter(idcurso_id=idcurso).order_by('titulo')

            # Monta os dados das aulas com o status de conclusão
            aulas_data = []
            for aula in aulas:
                concluida = AulaUsuario.objects.filter(usuario=usuario, aula=aula, concluida=True).exists()
                aulas_data.append({
                    "idaula": aula.idaula,
                    "titulo": aula.titulo,
                    "duracao": aula.duracao,
                    "concluida": concluida,
                })

            return Response(aulas_data, status=status.HTTP_200_OK)
        except Aula.DoesNotExist:
            return Response({"error": "Curso não encontrado ou sem aulas."}, status=status.HTTP_404_NOT_FOUND)
        



class RelacoesUsuariosMaquinasView(APIView):
    def get(self, request):
        relacoes = UsuarioRel.objects.prefetch_related('maquinas').all()
        resultado = [
            {
                'user_id': usuario.id,
                'usuario_nome': usuario.nome,
                'maquinas': [maquina.nome for maquina in usuario.maquinas.all()]
            }
            for usuario in relacoes
        ]
        return Response(resultado)

class RelacoesMaquinasUsuariosView(APIView):
    def get(self, request):
        relacoes = MaquinaRel.objects.prefetch_related('usuarios').all()
        resultado = [
            {
                'maquina_id': maquina.id,
                'maquina_nome': maquina.nome,
                'usuarios': [usuario.nome for usuario in maquina.usuarios.all()]
            }
            for maquina in relacoes
        ]
        return Response(resultado)

class RelacoesCursosUsuariosView(APIView):
    def get(self, request):
        relacoes = CursoRel.objects.prefetch_related('usuarios').all()
        resultado = [
            {
                'curso_id': curso.id,
                'curso_nome': curso.nome,
                'usuarios': [usuario.nome for usuario in curso.usuarios.all()]
            }
            for curso in relacoes
        ]
        return Response(resultado)

class RelacoesAreasMaquinasView(APIView):
    def get(self, request):
        relacoes = AreaRel.objects.prefetch_related('maquinas').all()
        resultado = [
            {
                'area_id': area.id,
                'area_nome': area.nome,
                'maquinas': [maquina.nome for maquina in area.maquinas.all()]
            }
            for area in relacoes
        ]
        return Response(resultado)
