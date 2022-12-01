# Generated by Django 4.1.2 on 2022-12-01 09:55

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ("user_system", "0004_alter_user_role"),
    ]

    operations = [
        migrations.AlterField(
            model_name="doctorprofile",
            name="user",
            field=models.OneToOneField(
                on_delete=django.db.models.deletion.CASCADE,
                related_name="doctor_profile",
                to=settings.AUTH_USER_MODEL,
            ),
        ),
    ]
