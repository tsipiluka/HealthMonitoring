from django.contrib.auth.models import AbstractUser
from django.db import models
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.contrib.auth.base_user import BaseUserManager


class PatientManager(BaseUserManager):
    def get_queryset(self, *args, **kwargs):
        return super().get_queryset(*args, **kwargs).filter(role=User.Role.PATIENT)


class DoctorManager(BaseUserManager):
    def get_queryset(self, *args, **kwargs):
        return super().get_queryset(*args, **kwargs).filter(role=User.Role.DOCTOR)


class User(AbstractUser):
    class Role(models.TextChoices):
        ADMIN = "ADMIN", "Admin"
        PATIENT = "PATIENT", "Patient"
        DOCTOR = "DOCTOR", "Doctor"

    base_role = Role.PATIENT

    role = models.CharField(max_length=50, choices=Role.choices, default=base_role)
    birth_date = models.DateField(null=True, blank=True)
    is_email_verified = models.BooleanField(default=False)

    def save(self, *args, **kwargs):
        if not self.pk:
            self.role = self.base_role
        return super().save(*args, **kwargs)

    def is_doctor(self):
        return self.role == self.Role.DOCTOR
    
    def is_patient(self):
        return self.role == self.Role.PATIENT
    

class Patient(User):

    class Meta:
        proxy = True
    base_role = User.Role.PATIENT

    patient = PatientManager()  # used to filter patients only

    def welcome(self):
        return "Welcome Patient"


@receiver(post_save, sender=User)
def create_patient_profile(sender, instance, created, **kwargs):
    if created and instance.role == User.Role.PATIENT:
        # set a patient_id consisting of the first 3 letters of the first name and the first 3 letters of the last name + the id
        patient_id = instance.first_name[:3] + instance.last_name[:3] + str(instance.id)
        PatientProfile.objects.create(user=instance, patient_id=patient_id)



class PatientProfile(models.Model):
    user = models.OneToOneField(
        Patient, on_delete=models.CASCADE, related_name="patient_profile"
    )
    patient_id = models.CharField(max_length=50, unique=True, null=True, blank=True)


class Doctor(User):
    base_role = User.Role.DOCTOR

    doctor = DoctorManager()  # used to filter doctors only

    class Meta:
        proxy = True

    def welcome(self):
        return "Welcome Doctor"


@receiver(post_save, sender=Doctor)
def create_doctor_profile(sender, instance, created, **kwargs):
    if created and instance.role == User.Role.DOCTOR:
        DoctorProfile.objects.create(user=instance)


class DoctorProfile(models.Model):
    user = models.OneToOneField(
        Doctor, on_delete=models.CASCADE, related_name="doctor_profile"
    )
    doctor_id = models.CharField(max_length=100)
