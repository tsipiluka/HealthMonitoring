# Generated by Django 4.1.2 on 2022-12-01 09:13

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ("user_system", "0003_alter_user_id"),
        ("medical_finding", "0004_findingaccessright_is_accepted"),
    ]

    operations = [
        migrations.AddField(
            model_name="medicalfinding",
            name="diagnosed_by",
            field=models.ForeignKey(
                default=1,
                on_delete=django.db.models.deletion.CASCADE,
                related_name="doctor_medicalFindings",
                to="user_system.doctor",
            ),
            preserve_default=False,
        ),
    ]