# Generated by Django 4.1.2 on 2022-12-04 18:34

from django.db import migrations, models
import django_cryptography.fields


class Migration(migrations.Migration):

    dependencies = [
        ("medical_finding", "0008_remove_findingreadingright_doctor_and_more"),
    ]

    operations = [
        migrations.AlterField(
            model_name="medicalfinding",
            name="disease",
            field=django_cryptography.fields.encrypt(models.CharField(max_length=100)),
        ),
        migrations.AlterField(
            model_name="medicalfinding",
            name="medicine",
            field=django_cryptography.fields.encrypt(models.CharField(max_length=100)),
        ),
    ]
