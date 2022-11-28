from rest_framework import serializers
from medical_finding.models import MedicalFinding


class MedicalFindingSerializer(serializers.ModelSerializer):
    class Meta:
        model = MedicalFinding
        exclude = ["created_at"]
