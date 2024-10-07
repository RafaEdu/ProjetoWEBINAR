# api/signals.py
import os
from django.conf import settings
from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Video, Slide

@receiver(post_save, sender=Video)
@receiver(post_save, sender=Slide)
def create_upload_dirs(sender, **kwargs):
    # Define o caminho completo para as pastas
    video_dir = os.path.join(settings.MEDIA_ROOT, 'videos')
    slide_dir = os.path.join(settings.MEDIA_ROOT, 'slides')
    
    # Verifica se a pasta videos existe, se não, cria
    if not os.path.exists(video_dir):
        os.makedirs(video_dir)
    
    # Verifica se a pasta slides existe, se não, cria
    if not os.path.exists(slide_dir):
        os.makedirs(slide_dir)
