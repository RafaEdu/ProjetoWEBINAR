# Generated by Django 5.1.1 on 2024-11-04 12:25

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0011_remove_curso_maquina_curso_maquina'),
    ]

    operations = [
        migrations.AlterField(
            model_name='aula',
            name='idcurso',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='api.curso'),
        ),
        migrations.AlterField(
            model_name='curso',
            name='idarea',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='api.area'),
        ),
        migrations.AlterField(
            model_name='curso',
            name='idquestionario',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='api.questionario'),
        ),
    ]
