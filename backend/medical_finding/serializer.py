from rest_framework import serializers
from medical_finding.models import MedicalFinding, FindingAccessRight


class MedicalFindingSerializer(serializers.ModelSerializer):
    class Meta:
        model = MedicalFinding
        exclude = ["created_at", "updated_at", "diagnosed_by"]
        # return the user obj instead of the id


class UpdateMedicalFindingSerializer(serializers.ModelSerializer):

    # do not allow to change the diagnosed_by field and the patient field
    class Meta:
        model = MedicalFinding
        disease = serializers.CharField(required=False)
        medicine = serializers.CharField(required=False)
        exclude = ["created_at", "updated_at", "diagnosed_by", "patient"]

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


class FindingAccessRightSerializer(serializers.ModelSerializer):
    class Meta:
        model = FindingAccessRight
        exclude = ["created_at"]

    def validate(self, attrs):
        return super().validate(attrs)
