# Generated by Django 4.1.2 on 2022-11-30 10:15

from django.db import migrations
import user_system.models


class Migration(migrations.Migration):

    dependencies = [
        ("user_system", "0008_remove_user_username_alter_user_email"),
    ]

    operations = [
        migrations.AlterModelManagers(
            name="user",
            managers=[
                ("objects", user_system.models.UserManager()),
            ],
        ),
    ]