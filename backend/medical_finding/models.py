from django.db import models
import uuid
from user_system.models import User

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
    user = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="user_medicalFindings"
    )
