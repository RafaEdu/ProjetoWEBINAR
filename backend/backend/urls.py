# urls.py
from django.contrib import admin
from django.conf import settings
from django.conf.urls.static import static
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from api.views import AulasComConclusaoView, ConsultarProgressoView, ConcluirAulaView, CursoListView, MaquinasDoUsuarioPorIDView, LoginView, LogoutView, UserViewSet, MaquinaViewSet, AreaViewSet, QuestionarioViewSet, CursoViewSet, AulaViewSet, VideoViewSet, SlideViewSet 
from api.views import (
    RelacoesUsuariosMaquinasView,
    RelacoesMaquinasUsuariosView,
    RelacoesCursosUsuariosView,
    RelacoesAreasMaquinasView
)

router = DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'cursos', CursoViewSet)
router.register(r'maquinas', MaquinaViewSet)
router.register(r'areas', AreaViewSet)
router.register(r'questionarios', QuestionarioViewSet)
router.register(r'aulas', AulaViewSet)
router.register(r'videos', VideoViewSet)
router.register(r'slides', SlideViewSet)

urlpatterns = [
    path('api/', include(router.urls)),
    path('api/login/', LoginView.as_view(), name='login'), 
    path('api/logout/', LogoutView.as_view(), name='logout'),
    path('api/aulas/curso/<int:idcurso>/completadas/', AulasComConclusaoView.as_view(), name='aulas_conclusao'),
    path('api/concluir-aula/', ConcluirAulaView.as_view(), name='concluir-aula'),
    path('api/progresso/<int:user_id>/', ConsultarProgressoView.as_view(), name='consultar-progresso'),
    path('api/cursos-list/<int:user_id>/', CursoListView.as_view(), name='curso-list-by-user'),
    path('api/aulas/curso/<int:idcurso>/', AulaViewSet.as_view({'get': 'list_by_curso'}), name='aula-by-curso'),
    path('api/maquinas-do-usuario/<int:user_id>/', MaquinasDoUsuarioPorIDView.as_view(), name='maquinas-do-usuario-id'),
    path('api/relacoes/usuarios-maquinas/', RelacoesUsuariosMaquinasView.as_view(), name='relacoes-usuarios-maquinas'),
    path('api/relacoes/maquinas-usuarios/', RelacoesMaquinasUsuariosView.as_view(), name='relacoes-maquinas-usuarios'),
    path('api/relacoes/cursos-usuarios/', RelacoesCursosUsuariosView.as_view(), name='relacoes-cursos-usuarios'),
    path('api/relacoes/areas-maquinas/', RelacoesAreasMaquinasView.as_view(), name='relacoes-areas-maquinas'),

]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
