from django.db import models
import uuid
from user_system.models import User, Doctor, Patient
from django_cryptography.fields import encrypt

# Create your models here.


class BaseModel(models.Model):
    uid = models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True)
    created_at = models.DateField(auto_now=True)
    updated_at = models.DateField(auto_now_add=True)

    class Meta:
        abstract = True


class MedicalFinding(BaseModel):
    disease = encrypt(models.CharField(max_length=100))
    comment = encrypt(models.CharField(max_length=100))
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE)
    treator = models.ForeignKey(
        Doctor, on_delete=models.CASCADE, related_name="treator", null=True, blank=True
    )


class FindingReadingRight(BaseModel):
    medical_finding = models.ForeignKey(MedicalFinding, on_delete=models.CASCADE)
    reader = models.ForeignKey(User, on_delete=models.CASCADE, related_name="reader")
