from django.db import models

from medical_finding.models import MedicalFinding

# Create your models here.


class DownloadFile(models.Model):

    medical_finding = models.ForeignKey(MedicalFinding, on_delete=models.CASCADE)

    def __str__(self):
        return self.medical_finding.uid
