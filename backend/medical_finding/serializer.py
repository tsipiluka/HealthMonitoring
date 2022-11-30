from rest_framework import serializers
from medical_finding.models import MedicalFinding, FindingAccessRight


class MedicalFindingSerializer(serializers.ModelSerializer):
    class Meta:
        model = MedicalFinding
        exclude = ["created_at"]

class FindingAccessRightSerializer(serializers.ModelSerializer):
    class Meta:
        model = FindingAccessRight
        exclude = ["created_at"]
    
    def validate(self, attrs):
        return super().validate(attrs)