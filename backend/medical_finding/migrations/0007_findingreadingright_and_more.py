# Generated by Django 4.1.2 on 2022-12-01 21:53

from django.db import migrations, models
import django.db.models.deletion
import uuid


class Migration(migrations.Migration):

    dependencies = [
        ("user_system", "0006_remove_user_is_email_verified_alter_user_is_active"),
        ("medical_finding", "0006_remove_medicalfinding_user_medicalfinding_patient"),
    ]

    operations = [
        migrations.CreateModel(
            name="FindingReadingRight",
            fields=[
                (
                    "uid",
                    models.UUIDField(
                        default=uuid.uuid4,
                        editable=False,
                        primary_key=True,
                        serialize=False,
                    ),
                ),
                ("created_at", models.DateField(auto_now=True)),
                ("updated_at", models.DateField(auto_now_add=True)),
                (
                    "doctor",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="doctor",
                        to="user_system.doctor",
                    ),
                ),
            ],
            options={
                "abstract": False,
            },
        ),
        migrations.RemoveField(
            model_name="medicalfinding",
            name="diagnosed_by",
        ),
        migrations.AddField(
            model_name="medicalfinding",
            name="treator",
            field=models.ForeignKey(
                blank=True,
                null=True,
                on_delete=django.db.models.deletion.CASCADE,
                related_name="treator",
                to="user_system.doctor",
            ),
        ),
        migrations.DeleteModel(
            name="FindingAccessRight",
        ),
        migrations.AddField(
            model_name="findingreadingright",
            name="medical_finding",
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.CASCADE,
                to="medical_finding.medicalfinding",
            ),
        ),
        migrations.AddField(
            model_name="findingreadingright",
            name="patient",
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.CASCADE,
                related_name="patient",
                to="user_system.patient",
            ),
        ),
    ]