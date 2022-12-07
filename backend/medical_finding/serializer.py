from rest_framework import serializers
from user_system.models import User
from medical_finding.models import MedicalFinding, FindingReadingRight

from user_system.seralizers import UserSerializer, LightUserSerializerWithProfile


class MedicalFindingSerializer(serializers.ModelSerializer):

    patient = LightUserSerializerWithProfile(read_only=True)
    treator = LightUserSerializerWithProfile(read_only=True)

    class Meta:
        model = MedicalFinding
        exclude = ["created_at"]

class CreateMedicalFindingSerializer(serializers.ModelSerializer):

    patient = LightUserSerializerWithProfile(read_only=True)

    class Meta:
        model = MedicalFinding
        exclude = ["created_at", "updated_at"]

        # make treator optional
        extra_kwargs = {"treator": {"required": False}}


class UpdateMedicalFindingSerializer(serializers.ModelSerializer):

    patient = serializers.PrimaryKeyRelatedField(read_only=True)
    # do not allow to change the diagnosed_by field and the patient field
    class Meta:
        model = MedicalFinding
        disease = serializers.CharField(required=False)
        comment = serializers.CharField(required=False)
        exclude = ["created_at", "updated_at"]

        extra_kwargs = {
            "disease": {"required": False},
            "comment": {"required": False},
            "treator": {"required": False}
        }

    def validate(self, data):
        # check if either comment or disease is provided
        if not data.get("disease") and not data.get("comment") and data.get("treator") != None:
            raise serializers.ValidationError(
                "Either comment, disease or treator must be provided"
            )
        return data


class ReadingRightSerializer(serializers.ModelSerializer):

    reader = LightUserSerializerWithProfile(read_only=True)

    class Meta:
        model = FindingReadingRight
        fields = "__all__"


class AddReadingRightSerializer(serializers.ModelSerializer):

    medical_finding = serializers.PrimaryKeyRelatedField(read_only=True)
    class Meta:
        model = FindingReadingRight
        exclude = ["created_at", "updated_at"]

    def validate(self, data):
        # check if this reader already has reading rights for this medical finding
        if FindingReadingRight.objects.filter(
            medical_finding=data.get("medical_finding"),
            reader=data.get("reader"),
        ).exists():
            raise serializers.ValidationError("This reader already has reading rights")
        return data

    # run the validation before creating the instance
    def create(self, validated_data):
        self.validate(validated_data)
        return FindingReadingRight.objects.create(**validated_data)
