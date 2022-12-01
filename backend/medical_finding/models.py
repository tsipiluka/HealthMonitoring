from django.db import models
import uuid
from user_system.models import User, Doctor, Patient

# Create your models here.


class BaseModel(models.Model):
    uid = models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True)
    created_at = models.DateField(auto_now=True)
    updated_at = models.DateField(auto_now_add=True)

    class Meta:
        abstract = True


class MedicalFinding(BaseModel):
    disease = models.CharField(max_length=100)
    medicine = models.CharField(max_length=100)
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE)
    treator = models.ForeignKey(Doctor, on_delete=models.CASCADE, related_name="treator", null=True, blank=True)


class FindingReadingRight(BaseModel):
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE, related_name="patient")
    doctor = models.ForeignKey(Doctor, on_delete=models.CASCADE, related_name="doctor")
    medical_finding = models.ForeignKey(MedicalFinding, on_delete=models.CASCADE)