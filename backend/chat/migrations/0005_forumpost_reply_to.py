import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("chat", "0004_delete_chatmessage_delete_conversation"),
    ]

    operations = [
        migrations.AddField(
            model_name="forumpost",
            name="reply_to",
            field=models.ForeignKey(
                blank=True,
                null=True,
                on_delete=django.db.models.deletion.SET_NULL,
                related_name="replies",
                to="chat.forumpost",
                verbose_name="En réponse à",
            ),
        ),
    ]
