# Generated by Django 4.1.2 on 2022-12-06 14:54

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ("medical_finding", "0002_initial"),
    ]

    operations = [
        migrations.CreateModel(
            name="DownloadFile",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                (
                    "medical_finding",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        to="medical_finding.medicalfinding",
                    ),
                ),
            ],
        ),
    ]
