# urls.py
from django.contrib import admin
from django.conf import settings
from django.conf.urls.static import static
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from api.views import CursoListView, MaquinasDoUsuarioPorIDView, LoginView, LogoutView, UserViewSet, MaquinaViewSet, AreaViewSet, QuestionarioViewSet, CursoViewSet, AulaViewSet, VideoViewSet, SlideViewSet 

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
    path('api/cursos-list/<int:user_id>/', CursoListView.as_view(), name='curso-list-by-user'),
    path('api/aulas/curso/<int:idcurso>/', AulaViewSet.as_view({'get': 'list_by_curso'}), name='aula-by-curso'),
    path('api/maquinas-do-usuario/<int:user_id>/', MaquinasDoUsuarioPorIDView.as_view(), name='maquinas-do-usuario-id'),

]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
