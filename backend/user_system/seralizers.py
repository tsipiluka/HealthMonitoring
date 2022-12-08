from rest_framework import serializers
from user_system.models import PatientProfile, DoctorProfile
from user_system.models import Doctor, Patient, User


class UserSerializer(serializers.ModelSerializer):

    # dont allow to set role
    # role = serializers.CharField(read_only=True)
    class Meta:
        model = User
        fields = (
            "id",
            "email",
            "first_name",
            "last_name",
            "birth_date",
            "is_doctor",
            "is_patient",
            "is_active",
        )
        # make first_name and last_name required
        extra_kwargs = {
            "first_name": {"required": True},
            "last_name": {"required": True},
        }

    def validate(self, attrs):
        if "role" in attrs:
            raise serializers.ValidationError({"role": "Role cannot be set manually."})


class DoctorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Doctor
        fields = (
            "id",
            "email",
            "first_name",
            "last_name",
            "birth_date",
            "is_doctor",
            "is_patient",
        )


class PatientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Patient
        fields = ("id", "email", "first_name", "last_name", "birth_date")


class PatientProfileSerializer(serializers.ModelSerializer):

    # user = PatientSerializer()

    class Meta:
        model = PatientProfile
        fields = ("patient_id",)


class DoctorProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = DoctorProfile
        fields = ("doctor_id",)


class LightUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ("id", "first_name", "last_name", "email", "role", "birth_date")


class LightUserSerializerWithProfile(serializers.ModelSerializer):

    patient_profile = PatientProfileSerializer()
    doctor_profile = DoctorProfileSerializer()

    class Meta:
        model = User
        fields = ("id", "first_name", "last_name", "role")

    def to_representation(self, instance):
        if instance.is_patient():
            return {
                "id": instance.id,
                "first_name": instance.first_name,
                "last_name": instance.last_name,
                "role": instance.role,
                "patient_profile": PatientProfileSerializer(
                    instance.patient_profile
                ).data,
            }
        elif instance.is_doctor():
            return {
                "id": instance.id,
                "first_name": instance.first_name,
                "last_name": instance.last_name,
                "role": instance.role,
                "doctor_profile": DoctorProfileSerializer(instance.doctor_profile).data,
            }
        else:
            return {
                "id": instance.id,
                "first_name": instance.first_name,
                "last_name": instance.last_name,
                "role": instance.role,
            }


class UserIDSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ("id",)
