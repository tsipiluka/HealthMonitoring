from rest_framework import serializers
from medical_finding.models import MedicalFinding, FindingReadingRight


class MedicalFindingSerializer(serializers.ModelSerializer):
    
    patient = serializers.PrimaryKeyRelatedField(read_only=True)
    class Meta:
        model = MedicalFinding
        exclude = ["created_at"]

        # field patient optional
        # extra_kwargs = {"patient": {"required": False}}


class UpdateMedicalFindingSerializer(serializers.ModelSerializer):

    patient = serializers.PrimaryKeyRelatedField(read_only=True)
    # do not allow to change the diagnosed_by field and the patient field
    class Meta:
        model = MedicalFinding
        disease = serializers.CharField(required=False)
        medicine = serializers.CharField(required=False)
        exclude = ["created_at", "updated_at", "treator"]

        extra_kwargs = {
            "disease": {"required": False},
            "medicine": {"required": False},
        }

    def validate(self, data):
        # check if either medicine or disease is provided
        if not data.get("disease") and not data.get("medicine"):
            raise serializers.ValidationError(
                "Either medicine or disease must be provided"
            )
        return data
