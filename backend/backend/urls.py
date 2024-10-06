from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from api.views import UserViewSet, MaquinaViewSet, AreaViewSet, QuestionarioViewSet, CursoViewSet 

router = DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'cursos', CursoViewSet)
router.register(r'maquinas', MaquinaViewSet)
router.register(r'areas', AreaViewSet)
router.register(r'questionarios', QuestionarioViewSet)


urlpatterns = [
    path('api/', include(router.urls)),
]
