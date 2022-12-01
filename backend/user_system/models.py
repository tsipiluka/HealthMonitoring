import uuid
from django.contrib.auth.models import AbstractUser
from django.db import models
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.contrib.auth.base_user import BaseUserManager
from django.utils.translation import gettext_lazy as _


class AbstractUser(AbstractUser):
    created_at = models.DateField(auto_now=True)
    updated_at = models.DateField(auto_now_add=True)

    class Meta:
        abstract = True


class UserManager(BaseUserManager):
    use_in_migrations = True

    def _create_user(self, email, password, **extra_fields):
        if not email:
            raise ValueError("Users require an email field")
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_user(self, email, password=None, **extra_fields):
        extra_fields.setdefault("is_staff", False)
        extra_fields.setdefault("is_superuser", False)
        return self._create_user(email, password, **extra_fields)

    def create_superuser(self, email, password, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)

        if extra_fields.get("is_staff") is not True:
            raise ValueError("Superuser must have is_staff=True.")
        if extra_fields.get("is_superuser") is not True:
            raise ValueError("Superuser must have is_superuser=True.")

        return self._create_user(email, password, **extra_fields)


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

    username = None
    email = models.EmailField(_("email address"), unique=True)

    objects = UserManager()

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = []

    role = models.CharField(max_length=50, choices=Role.choices)
    birth_date = models.DateField(null=True, blank=True)
    is_email_verified = models.BooleanField(default=False)

    def save(self, *args, **kwargs):
        # if not self.pk:
        #     self.role = self.base_role
        return super().save(*args, **kwargs)

    def is_doctor(self):
        return self.role == "DOCTOR"

    def is_patient(self):
        return self.role == "PATIENT"


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

    def __str__(self):
        return self.user.first_name + " " + self.user.last_name + (" (Patient)")


class Doctor(User):
    base_role = User.Role.DOCTOR

    doctor = DoctorManager()  # used to filter doctors only

    class Meta:
        proxy = True

    def welcome(self):
        return "Welcome Doctor"


@receiver(post_save, sender=User)
def create_doctor_profile(sender, instance, created, **kwargs):
    if created and instance.role == User.Role.DOCTOR:
        DoctorProfile.objects.create(user=instance)


class DoctorProfile(models.Model):
    # set the object name to the first name and last name of the user

    user = models.OneToOneField(
        User, on_delete=models.CASCADE, related_name="doctor_profile"
    )
    doctor_id = models.CharField(max_length=100)

    def __str__(self):
        return self.user.first_name + " " + self.user.last_name + (" (Doctor)")
