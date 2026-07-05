from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('portfolio', '0002_alter_project_options_project_client_en_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='project',
            name='logo',
            field=models.ImageField(
                blank=True,
                null=True,
                help_text='Logo affiché en couverture. Sinon icône + dégradé.',
                upload_to='portfolio/logos/',
            ),
        ),
        migrations.AddField(
            model_name='project',
            name='screenshots',
            field=models.JSONField(
                blank=True,
                default=list,
                help_text="Liste d'URLs d'images (captures). La 1re sert de couverture si pas de logo.",
            ),
        ),
    ]
