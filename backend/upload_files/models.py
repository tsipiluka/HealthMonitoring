from django.db import models
from medical_finding.models import MedicalFinding


class File(models.Model):
    file = models.FileField(blank=False, null=False)
    medical_finding = models.ForeignKey(
        MedicalFinding, on_delete=models.CASCADE, blank=True, null=True
    )
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.file.name
