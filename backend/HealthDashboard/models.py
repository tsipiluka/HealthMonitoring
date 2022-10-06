from django.db import models

# Create your models here.

class Person(models.Model):
    peID = models.AutoField(primary_key=True)
    vorname = models.CharField(max_length=100)
    nachname = models.CharField(max_length=100)

class Patient(models.Model):
    paID = models.AutoField(primary_key=True)
    peID = models.ForeignKey(Person, on_delete=models.CASCADE)

class Arzt(models.Model):   
    aID = models.AutoField(primary_key=True)
    bezeichnung = models.CharField(max_length=100)
    peID = models.ForeignKey(Person, on_delete=models.CASCADE)

class Befund(models.Model):
    bID = models.AutoField(primary_key=True)
    krankheit = models.CharField(max_length=100)
    medikament = models.CharField(max_length=100)
    paID = models.ForeignKey(Patient, on_delete=models.CASCADE)

class PatientenZugriff(models.Model):
    paID = models.ForeignKey(Patient, on_delete=models.CASCADE)
    bID = models.ForeignKey(Befund, on_delete=models.CASCADE)

class ArztZugriff(models.Model):
    aID = models.ForeignKey(Arzt, on_delete=models.CASCADE)
    bID = models.ForeignKey(Befund, on_delete=models.CASCADE)