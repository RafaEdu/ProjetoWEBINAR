from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from api.views import UserViewSet, MaquinaViewSet, AreaViewSet  # Adicione AreaViewSet aqui

router = DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'maquinas', MaquinaViewSet)
router.register(r'areas', AreaViewSet)  # Verifique se isso está correto

urlpatterns = [
    path('api/', include(router.urls)),
]
