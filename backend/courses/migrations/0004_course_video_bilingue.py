from django.db import migrations, models


class Migration(migrations.Migration):
    """Vidéo bilingue : la vidéo unique `video_url` devient `video_url_fr`
    (renommage, on conserve la valeur existante) + nouveau champ `video_url_en`."""

    dependencies = [
        ('courses', '0003_course_video_url'),
    ]

    operations = [
        migrations.RenameField(
            model_name='course',
            old_name='video_url',
            new_name='video_url_fr',
        ),
        migrations.AlterField(
            model_name='course',
            name='video_url_fr',
            field=models.URLField(blank=True, help_text='Vidéo de cours en français (YouTube) — lecteur intégré sur la page FR.', max_length=300, verbose_name='Vidéo du cours — FR (YouTube)'),
        ),
        migrations.AddField(
            model_name='course',
            name='video_url_en',
            field=models.URLField(blank=True, help_text='Vidéo de cours en anglais (YouTube) — lecteur intégré sur la page EN.', max_length=300, verbose_name='Vidéo du cours — EN (YouTube)'),
        ),
    ]
